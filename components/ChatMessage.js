'use client'

import ProductTable from './ProductTable'

export default function ChatMessage({ message, onSpeak }) {
  const isUser = message.role === 'user'
  const isLoading = message.loading

  // Format AI text with basic styling
  const formatText = (text) => {
    if (!text) return ''
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F4C430">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#FF8C42">$1</em>')
      .replace(/⚠️/g, '<span style="color:#FF6B6B">⚠️</span>')
      .replace(/✅/g, '<span style="color:#90EE90">✅</span>')
      .replace(/💡/g, '<span style="color:#FFD700">💡</span>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div
      className={`flex gap-3 animate-[fadeIn_0.4s_ease-out] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animationFillMode: 'both' }}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl mt-1"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #CC4A00, #FF6B1A)'
            : 'linear-gradient(135deg, #1A0A00, #3D1A00)',
          border: `2px solid ${isUser ? '#FF6B1A' : 'rgba(255,107,26,0.4)'}`,
          boxShadow: isUser ? '0 0 10px rgba(255,107,26,0.3)' : 'none',
        }}
      >
        {isUser ? '🧑' : '🤖'}
      </div>

      {/* Message bubble */}
      <div
        className="flex-1 max-w-[85%] rounded-2xl px-4 py-3"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #8B2500, #CC4A00)'
            : 'linear-gradient(135deg, #2A1200, #3D1A00)',
          border: isUser
            ? 'none'
            : '1px solid rgba(255,107,26,0.3)',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          boxShadow: isUser
            ? '0 4px 16px rgba(0,0,0,0.3)'
            : '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        {/* Timestamp */}
        <div
          className="text-xs mb-1 flex items-center justify-between gap-2"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <span>{isUser ? 'आपने पूछा' : '🤖 बाज़ार सहायक'}</span>
          <span>{new Date(message.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {isLoading ? (
          /* Loading dots */
          <div className="loading-dots flex items-center gap-1 py-2">
            <span></span><span></span><span></span>
            <span className="ml-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              सोच रहा हूँ...
            </span>
          </div>
        ) : (
          <>
            {/* Message text */}
            <div
              className="font-medium leading-relaxed"
              style={{ color: '#FFF8E7', fontSize: '15px', lineHeight: '1.7' }}
              dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
            />

            {/* Products table for AI messages */}
            {!isUser && message.products && message.products.length > 0 && (
              <ProductTable products={message.products} />
            )}

            {/* Speak button for AI messages */}
            {!isUser && !isLoading && message.text && (
              <button
                onClick={() => onSpeak(message.text)}
                className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
                style={{
                  background: 'rgba(255,107,26,0.15)',
                  border: '1px solid rgba(255,107,26,0.3)',
                  color: '#FF8C42',
                  minHeight: '40px',
                }}
              >
                <span>🔊</span>
                <span>सुनें</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
