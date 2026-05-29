'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import MicButton from '../components/MicButton'
import ChatMessage from '../components/ChatMessage'
import ShoppingList from '../components/ShoppingList'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'नमस्ते! 🙏 मैं आपका बाज़ार सहायक हूँ।\n\nमाइक का बटन दबाएं और बोलें कि आपको क्या चाहिए।\n\nजैसे: "मुझे 5 किलो आटा, 2 किलो चावल और सरसों का तेल चाहिए"\n\nमैं आपको सबसे अच्छी कीमत खोजकर दूंगा! 😊',
      products: [],
      timestamp: Date.now(),
    }
  ])
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shoppingList, setShoppingList] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [activeTab, setActiveTab] = useState('chat') // 'chat' | 'list'

  const recognitionRef = useRef(null)
  const chatEndRef = useRef(null)
  const synthRef = useRef(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    return () => {
      if (synthRef.current) synthRef.current.cancel()
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speak = useCallback((text) => {
    if (!synthRef.current) return
    synthRef.current.cancel()

    // Clean text for speech
    const cleanText = text
      .replace(/<[^>]*>/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\n+/g, '. ')
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'hi-IN'
    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1

    // Try to find a Hindi female voice
    const voices = synthRef.current.getVoices()
    const hindiVoice = voices.find(v =>
      (v.lang === 'hi-IN' || v.lang.startsWith('hi')) && v.name.toLowerCase().includes('female')
    ) || voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'))

    if (hindiVoice) utterance.voice = hindiVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }, [])

  const setupRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      setTranscript(final || interim)
      if (final) {
        setIsListening(false)
        sendQuery(final)
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error)
      setIsListening(false)
      setTranscript('')
      if (event.error === 'no-speech') {
        addSystemMessage('कोई आवाज़ नहीं आई। दोबारा कोशिश करें।')
      } else if (event.error === 'not-allowed') {
        addSystemMessage('माइक की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक चालू करें।')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    return recognition
  }, [])

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: `⚠️ ${text}`,
      products: [],
      timestamp: Date.now(),
    }])
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    // Stop any ongoing speech
    synthRef.current?.cancel()
    setIsSpeaking(false)

    const recognition = setupRecognition()
    if (!recognition) {
      addSystemMessage('आपका ब्राउज़र आवाज़ पहचान का समर्थन नहीं करता। कृपया नीचे टाइप करें।')
      return
    }

    recognitionRef.current = recognition
    setTranscript('')
    setIsListening(true)

    try {
      recognition.start()
    } catch (e) {
      setIsListening(false)
      addSystemMessage('माइक शुरू नहीं हो सका। दोबारा कोशिश करें।')
    }
  }

  const sendQuery = async (query) => {
    if (!query.trim() || isLoading) return
    setIsLoading(true)
    setTranscript('')

    // Add user message
    const userMsg = { role: 'user', text: query, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])

    // Add loading placeholder
    const loadingId = Date.now() + 1
    setMessages(prev => [...prev, { role: 'assistant', loading: true, timestamp: loadingId }])

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, shoppingList }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages(prev => prev.map(m =>
          m.timestamp === loadingId
            ? { role: 'assistant', text: `❌ माफ़ करें: ${data.error}`, products: [], timestamp: loadingId }
            : m
        ))
      } else {
        const aiMsg = {
          role: 'assistant',
          text: data.text,
          products: data.products || [],
          timestamp: loadingId,
        }

        setMessages(prev => prev.map(m => m.timestamp === loadingId ? aiMsg : m))

        // Add products to shopping list
        if (data.products && data.products.length > 0) {
          const newItems = data.products.map(p => ({
            name: p.name,
            quantity: p.quantity,
            estimatedPrice: p.estimatedPrice,
            products: data.products,
          }))
          setShoppingList(prev => {
            const existingNames = new Set(prev.map(i => i.name))
            const unique = newItems.filter(i => !existingNames.has(i.name))
            return [...prev, ...unique]
          })
        }

        // Speak the response
        if (data.text) {
          setTimeout(() => speak(data.text), 300)
        }
      }
    } catch (e) {
      setMessages(prev => prev.map(m =>
        m.timestamp === loadingId
          ? { role: 'assistant', text: '❌ इंटरनेट कनेक्शन की जाँच करें और दोबारा कोशिश करें।', products: [], timestamp: loadingId }
          : m
      ))
    }

    setIsLoading(false)
  }

  const handleTextSubmit = (e) => {
    e?.preventDefault()
    if (textInput.trim()) {
      sendQuery(textInput)
      setTextInput('')
    }
  }

  const handleHelp = () => {
    const helpText = 'बाज़ार सहायक में आपका स्वागत है। माइक का गोल बटन दबाएं। फिर बोलें कि आपको क्या सामान चाहिए। जैसे — मुझे आटा, चावल, और तेल चाहिए। मैं आपको सभी ऑनलाइन दुकानों की कीमत बताऊंगा। आप नीचे की सूची में सामान जोड़ सकते हैं और व्हाट्सएप पर भेज सकते हैं।'
    speak(helpText)
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: '🙏 **बाज़ार सहायक - उपयोग की जानकारी**\n\n1️⃣ बड़े माइक बटन को दबाएं\n2️⃣ बोलें: "मुझे आटा, चावल चाहिए"\n3️⃣ मैं कीमतें खोजकर बताऊंगा\n4️⃣ सूची में सामान जुड़ जाएगा\n5️⃣ "भेजें" से WhatsApp पर भेजें\n\n💡 आप नीचे टाइप भी कर सकते हैं!',
      products: [],
      timestamp: Date.now(),
    }])
  }

  return (
    <div
      className="min-h-screen flex flex-col village-pattern"
      style={{ background: 'linear-gradient(180deg, #1A0A00 0%, #0D0500 100%)' }}
    >
      <Header onHelp={handleHelp} />

      {/* Tab switcher */}
      <div
        className="flex mx-4 mt-3 rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(255,107,26,0.3)', background: 'rgba(26,10,0,0.6)' }}
      >
        {[
          { id: 'chat', label: '💬 बातचीत', count: null },
          { id: 'list', label: '🛒 सूची', count: shoppingList.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #CC4A00, #FF6B1A)'
                : 'transparent',
              color: activeTab === tab.id ? '#FFF8E7' : 'rgba(255,255,255,0.45)',
              minHeight: '48px',
            }}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-black"
                style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : '#FF6B1A', color: 'white' }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <>
          {/* Chat messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ minHeight: '200px', maxHeight: 'calc(100vh - 420px)' }}
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} onSpeak={speak} />
            ))}
            {isSpeaking && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl w-fit"
                style={{ background: 'rgba(255,107,26,0.15)', border: '1px solid rgba(255,107,26,0.3)' }}>
                <span className="text-sm" style={{ color: '#FF8C42' }}>🔊 बोल रहा हूँ...</span>
                <button onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false) }}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: 'rgba(255,99,71,0.3)', color: '#FF6347' }}>
                  रोकें
                </button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Mic section */}
          <div
            className="border-t"
            style={{ borderColor: 'rgba(255,107,26,0.2)', background: 'rgba(26,10,0,0.8)' }}
          >
            <MicButton
              isListening={isListening}
              onToggle={toggleListening}
              transcript={transcript}
            />

            {/* Text input fallback */}
            <div className="px-4 pb-4">
              <div
                className="flex gap-2 rounded-2xl overflow-hidden"
                style={{ border: '1.5px solid rgba(255,107,26,0.4)', background: 'rgba(61,26,0,0.5)' }}
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
                  placeholder="या यहाँ टाइप करें..."
                  className="flex-1 bg-transparent px-4 py-3 font-medium outline-none"
                  style={{
                    color: '#FFF8E7',
                    fontSize: '15px',
                    caretColor: '#FF6B1A',
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim() || isLoading}
                  className="px-5 py-3 font-bold text-sm transition-all active:scale-95 disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #CC4A00, #FF6B1A)',
                    color: '#FFF8E7',
                    minWidth: '64px',
                  }}
                >
                  {isLoading ? '⏳' : 'भेजें'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* LIST TAB */}
      {activeTab === 'list' && (
        <div className="flex-1 overflow-y-auto">
          <ShoppingList
            items={shoppingList}
            onRemove={(idx) => setShoppingList(prev => prev.filter((_, i) => i !== idx))}
            onClear={() => setShoppingList([])}
          />

          {shoppingList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
              <div className="text-6xl opacity-40">🛒</div>
              <p className="font-bold text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
                सूची खाली है
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
                बातचीत वाले टैब में जाकर सामान पूछें
              </p>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #CC4A00, #FF6B1A)', color: 'white' }}
              >
                💬 बात करें
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
