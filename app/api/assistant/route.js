export async function POST(request) {
  try {
    const { query, shoppingList } = await request.json()

    if (!query) {
      return Response.json({ error: 'कोई सवाल नहीं मिला' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'API key सेट नहीं है' }, { status: 500 })
    }

    const systemPrompt = `आप "बाज़ार सहायक" हैं — भारतीय गांव के लोगों के लिए एक दोस्ताना और भरोसेमंद खरीदारी सहायक।

आपका काम:
1. उपयोगकर्ता की बात ध्यान से सुनें और समझें कि उन्हें क्या चाहिए
2. 4-5 लोगों के परिवार के लिए उचित मात्रा सुझाएं
3. मौसमी उपलब्धता के बारे में चेतावनी दें
4. सस्ते स्थानीय विकल्प सुझाएं
5. Flipkart, Amazon India, Meesho, JioMart और IndiaMART पर कीमतें खोजें

जवाब देने का तरीका:
- सरल, आसान हिंदी में बात करें (गांव के लोगों के लिए)
- हर सामान के लिए अनुमानित कीमत बताएं
- अगर कोई चीज़ सस्ती मिल सकती है तो ज़रूर बताएं
- प्यार और देखभाल से बात करें जैसे कोई पड़ोसी दोस्त बात करता है

जवाब का format:
1. पहले एक छोटा दोस्ताना स्वागत संदेश
2. फिर हर सामान के बारे में जानकारी:
   - सामान का नाम
   - सुझाई गई मात्रा
   - अनुमानित कीमत
   - कोई special tip या चेतावनी
3. अंत में online खरीदारी की सलाह

उत्पाद की जानकारी के साथ JSON भी दें इस format में:
<PRODUCTS>
[
  {
    "name": "उत्पाद का नाम",
    "quantity": "मात्रा",
    "estimatedPrice": "₹XXX",
    "tip": "कोई सुझाव",
    "searchQuery": "product name in English for searching",
    "flipkart": {"available": true/false, "price": "₹XXX", "url": "search_url"},
    "amazon": {"available": true/false, "price": "₹XXX", "url": "search_url"},
    "meesho": {"available": true/false, "price": "₹XXX", "url": "search_url"},
    "jiomart": {"available": true/false, "price": "₹XXX", "url": "search_url"},
    "indiamart": {"available": true/false, "price": "₹XXX", "url": "search_url"}
  }
]
</PRODUCTS>

Platform URLs format:
- Flipkart: https://www.flipkart.com/search?q=PRODUCT_NAME
- Amazon: https://www.amazon.in/s?k=PRODUCT_NAME
- Meesho: https://meesho.com/search?q=PRODUCT_NAME
- JioMart: https://www.jiomart.com/search/PRODUCT_NAME
- IndiaMART: https://dir.indiamart.com/search.mp?ss=PRODUCT_NAME

हमेशा realistic prices दें और URLs में product name को URL-encoded करें।`

    const userMessage = `${query}

${shoppingList && shoppingList.length > 0 ? `\n\nमेरी मौजूदा खरीदारी सूची:\n${shoppingList.map(item => `- ${item.name}: ${item.quantity}`).join('\n')}` : ''}`

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt + '\n\nउपयोगकर्ता का सवाल: ' + userMessage }]
        }
      ],
      tools: [
        {
          google_search: {}
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      return Response.json(
        { error: `API गड़बड़: ${errorData.error?.message || 'कुछ गलत हुआ'}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Parse products JSON from response
    let products = []
    let displayText = rawText

    const productsMatch = rawText.match(/<PRODUCTS>([\s\S]*?)<\/PRODUCTS>/)
    if (productsMatch) {
      try {
        products = JSON.parse(productsMatch[1].trim())
        displayText = rawText.replace(/<PRODUCTS>[\s\S]*?<\/PRODUCTS>/, '').trim()
      } catch (e) {
        console.error('Failed to parse products:', e)
      }
    }

    return Response.json({
      text: displayText,
      products,
      rawText,
    })
  } catch (error) {
    console.error('Assistant API error:', error)
    return Response.json(
      { error: 'माफ़ करें, कुछ गलत हो गया। दोबारा कोशिश करें।' },
      { status: 500 }
    )
  }
}
