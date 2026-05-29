# 🛒 बाज़ार सहायक

## आपका स्मार्ट गांव खरीदारी दोस्त

---

## यह ऐप क्या है?

बाज़ार सहायक एक **आवाज़-आधारित स्मार्ट शॉपिंग सहायक** है जो भारत के ग्रामीण इलाकों के लिए बनाया गया है।

- 🎤 **बोलकर पूछें** — माइक का बटन दबाएं और हिंदी में बोलें
- 💰 **कीमत तुलना** — Flipkart, Amazon, Meesho, JioMart, IndiaMART पर कीमतें देखें
- 🛒 **खरीदारी सूची** — सामान की सूची बनाएं और WhatsApp पर भेजें
- 🔊 **जवाब सुनें** — AI का जवाब आवाज़ में सुनाई देगा

---

## ऐप चलाने के लिए क्या चाहिए?

1. **Node.js** — version 18 या उससे नया
2. **Google Gemini API Key** — [यहाँ से लें](https://aistudio.google.com/app/apikey)
3. **Internet Connection**

---

## पहली बार Setup कैसे करें?

### Step 1 — फ़ाइलें डाउनलोड करें

```bash
# ZIP खोलें और folder में जाएं
cd bazar-sahayak
```

### Step 2 — API Key सेट करें

`.env.local` नाम की फ़ाइल बनाएं और अपनी Gemini API Key डालें:

```
GEMINI_API_KEY=आपकी_api_key_यहाँ_डालें
```

> 💡 **Gemini API Key कैसे लें?**
> 1. [Google AI Studio](https://aistudio.google.com/app/apikey) पर जाएं
> 2. "Create API Key" पर क्लिक करें
> 3. Key कॉपी करें और `.env.local` में डालें

### Step 3 — Dependencies Install करें

```bash
npm install
```

### Step 4 — ऐप चलाएं

```bash
npm run dev
```

अब ब्राउज़र में `http://localhost:3000` खोलें।

---

## Vercel पर Deploy करें (एक क्लिक में)

1. [Vercel.com](https://vercel.com) पर अकाउंट बनाएं
2. GitHub पर यह project push करें
3. Vercel में "New Project" → अपना repo चुनें
4. Environment Variables में `GEMINI_API_KEY` डालें
5. "Deploy" दबाएं — बस हो गया! 🎉

---

## ऐप कैसे इस्तेमाल करें?

1. **ऐप खोलें** — कोई login नहीं, सीधे काम करता है
2. **माइक का बड़ा बटन दबाएं** (दिया की तरह दिखता है)
3. **हिंदी में बोलें**: "मुझे 5 किलो आटा, 2 किलो चावल और सरसों का तेल चाहिए"
4. **जवाब सुनें** — AI बोलकर भी बताएगा
5. **कीमतें देखें** — सभी दुकानों की तुलना होगी
6. **"खरीदें" दबाएं** — सीधे दुकान की website खुलेगी
7. **सूची भेजें** — WhatsApp पर सूची share करें

---

## किन phones में चलेगा?

- ✅ Android phones (Chrome browser)
- ✅ iPhone (Safari browser)
- ✅ सभी computers
- ✅ आवाज़ के लिए internet ज़रूरी है

---

## समस्या हो तो क्या करें?

| समस्या | हल |
|--------|-----|
| माइक काम नहीं करता | Browser settings में Microphone "Allow" करें |
| आवाज़ नहीं आती | Phone का volume बढ़ाएं |
| कीमतें नहीं दिख रहीं | API Key जाँचें |
| ऐप नहीं खुल रहा | Internet connection जाँचें |

---

## किसने बनाया?

यह ऐप **Claude AI (Anthropic)** की मदद से बनाया गया।

Google Gemini API का उपयोग करता है।

---

*🌾 ग्रामीण भारत के लिए — प्यार के साथ*
