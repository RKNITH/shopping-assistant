'use client'

import { useState } from 'react'
import ProductTable from './ProductTable'

export default function ShoppingList({ items, onRemove, onClear }) {
  const [expanded, setExpanded] = useState(true)
  const [expandedItem, setExpandedItem] = useState(null)

  const handleShare = async () => {
    if (!items || items.length === 0) return

    const text = `🛒 मेरी खरीदारी सूची (बाज़ार सहायक)\n\n` +
      items.map((item, i) => `${i + 1}. ${item.name} - ${item.quantity || ''} (${item.estimatedPrice || ''})`).join('\n') +
      `\n\nबाज़ार सहायक ऐप से बनाई गई सूची 🌾`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'मेरी खरीदारी सूची',
          text,
        })
      } catch (e) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text)
        alert('सूची कॉपी हो गई! अब WhatsApp पर भेज सकते हैं।')
      } catch (e) {
        alert(text)
      }
    }
  }

  if (!items || items.length === 0) {
    return (
      <div
        className="mx-4 my-3 rounded-2xl p-4 text-center"
        style={{
          background: 'rgba(26,10,0,0.8)',
          border: '1px dashed rgba(255,107,26,0.3)',
        }}
      >
        <p className="text-2xl mb-1">🛒</p>
        <p className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          अभी कोई सामान नहीं है
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
          ऊपर माइक दबाएं और बोलें
        </p>
      </div>
    )
  }

  return (
    <div
      className="mx-4 my-3 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(26,10,0,0.9)',
        border: '1px solid rgba(255,107,26,0.35)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
        style={{
          background: 'linear-gradient(90deg, rgba(204,74,0,0.5), rgba(61,26,0,0.7))',
          borderBottom: '1px solid rgba(255,107,26,0.3)',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🛒</span>
          <span className="font-bold" style={{ color: '#FFF8E7', fontSize: '16px' }}>
            खरीदारी सूची
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: '#FF6B1A', color: 'white' }}
          >
            {items.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleShare() }}
            className="px-3 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-1"
            style={{
              background: 'rgba(144,238,144,0.15)',
              border: '1px solid rgba(144,238,144,0.3)',
              color: '#90EE90',
              minHeight: '40px',
            }}
          >
            <span>📤</span>
            <span className="hidden sm:inline">भेजें</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClear() }}
            className="px-3 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-1"
            style={{
              background: 'rgba(255,99,71,0.15)',
              border: '1px solid rgba(255,99,71,0.3)',
              color: '#FF6347',
              minHeight: '40px',
            }}
          >
            <span>🗑️</span>
            <span className="hidden sm:inline">साफ़ करें</span>
          </button>
          <span style={{ color: '#F4C430', fontSize: '18px' }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="divide-y max-h-[60vh] overflow-y-auto" style={{ borderColor: 'rgba(255,107,26,0.1)' }}>
          {items.map((item, idx) => (
            <div key={idx} className="shopping-item mx-3 my-2 rounded-xl overflow-hidden">
              {/* Item row */}
              <div
                className="px-4 py-3 flex items-center justify-between gap-2 cursor-pointer"
                onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
                style={{
                  background: 'rgba(61,26,0,0.5)',
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">📦</span>
                  <div className="min-w-0">
                    <p className="font-bold truncate" style={{ color: '#FFF8E7', fontSize: '15px' }}>
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: '#C9960C' }}>
                      {item.quantity} {item.estimatedPrice ? `• ${item.estimatedPrice}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.products && item.products.length > 0 && (
                    <span style={{ color: '#F4C430', fontSize: '12px' }}>
                      {expandedItem === idx ? '▲' : '🔍'}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(idx) }}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: 'rgba(255,99,71,0.2)',
                      border: '1px solid rgba(255,99,71,0.3)',
                      color: '#FF6347',
                      fontSize: '14px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Expanded product comparison */}
              {expandedItem === idx && item.products && item.products.length > 0 && (
                <div className="px-3 pb-3">
                  <ProductTable products={item.products} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
