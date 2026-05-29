'use client'

const PLATFORMS = [
  {
    key: 'flipkart',
    name: 'Flipkart',
    emoji: '🛍️',
    color: '#F7AE01',
    bg: 'rgba(247,174,1,0.1)',
  },
  {
    key: 'amazon',
    name: 'Amazon',
    emoji: '📦',
    color: '#FF9900',
    bg: 'rgba(255,153,0,0.1)',
  },
  {
    key: 'meesho',
    name: 'Meesho',
    emoji: '🛒',
    color: '#F43397',
    bg: 'rgba(244,51,151,0.1)',
  },
  {
    key: 'jiomart',
    name: 'JioMart',
    emoji: '🏪',
    color: '#0088CC',
    bg: 'rgba(0,136,204,0.1)',
  },
  {
    key: 'indiamart',
    name: 'IndiaMART',
    emoji: '🏭',
    color: '#2E8B57',
    bg: 'rgba(46,139,87,0.1)',
  },
]

export default function ProductTable({ products }) {
  if (!products || products.length === 0) return null

  return (
    <div className="mt-4 space-y-6">
      <h3
        className="font-bold text-center"
        style={{ color: '#F4C430', fontSize: '16px' }}
      >
        🛒 ऑनलाइन कीमतें देखें
      </h3>

      {products.map((product, idx) => (
        <div
          key={idx}
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,107,26,0.3)',
            background: 'rgba(26,10,0,0.6)',
          }}
        >
          {/* Product header */}
          <div
            className="px-4 py-3 flex items-center justify-between flex-wrap gap-2"
            style={{
              background: 'linear-gradient(90deg, rgba(204,74,0,0.4), rgba(61,26,0,0.6))',
              borderBottom: '1px solid rgba(255,107,26,0.3)',
            }}
          >
            <div>
              <span
                className="font-bold"
                style={{ color: '#FFF8E7', fontSize: '16px' }}
              >
                📦 {product.name}
              </span>
              {product.quantity && (
                <span
                  className="ml-2 text-sm font-medium"
                  style={{ color: '#F4C430' }}
                >
                  ({product.quantity})
                </span>
              )}
            </div>
            {product.estimatedPrice && (
              <span
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(244,196,48,0.2)',
                  border: '1px solid rgba(244,196,48,0.4)',
                  color: '#F4C430',
                }}
              >
                अनुमान: {product.estimatedPrice}
              </span>
            )}
          </div>

          {product.tip && (
            <div
              className="px-4 py-2 text-sm flex items-start gap-2"
              style={{
                background: 'rgba(144,238,144,0.08)',
                borderBottom: '1px solid rgba(144,238,144,0.15)',
                color: '#90EE90',
              }}
            >
              <span>💡</span>
              <span>{product.tip}</span>
            </div>
          )}

          {/* Platform rows */}
          <div className="divide-y" style={{ borderColor: 'rgba(255,107,26,0.1)' }}>
            {PLATFORMS.map((platform) => {
              const info = product[platform.key]
              const available = info?.available !== false

              return (
                <div
                  key={platform.key}
                  className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
                  style={{ background: available ? platform.bg : 'transparent' }}
                >
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <span className="text-lg">{platform.emoji}</span>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: platform.color }}
                    >
                      {platform.name}
                    </span>
                  </div>

                  {available ? (
                    <>
                      <span
                        className="font-bold text-sm flex-1 text-center"
                        style={{ color: '#F4C430' }}
                      >
                        {info?.price || product.estimatedPrice || 'देखें'}
                      </span>
                      <a
                        href={info?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="buy-btn"
                        style={{ minHeight: '36px', display: 'flex', alignItems: 'center' }}
                        onClick={(e) => {
                          if (!info?.url || info.url === '#') e.preventDefault()
                        }}
                      >
                        खरीदें →
                      </a>
                    </>
                  ) : (
                    <span
                      className="flex-1 text-center text-sm italic"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      उपलब्ध नहीं
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
