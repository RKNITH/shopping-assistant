import './globals.css'

export const metadata = {
  title: '🛒 बाज़ार सहायक - आपका स्मार्ट खरीदारी दोस्त',
  description: 'ग्रामीण भारत के लिए आवाज़-आधारित स्मार्ट शॉपिंग सहायक',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1A0A00',
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-hindi">{children}</body>
    </html>
  )
}
