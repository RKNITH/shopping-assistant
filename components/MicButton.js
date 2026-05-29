'use client'

import { useEffect, useRef } from 'react'

export default function MicButton({ isListening, onToggle, transcript }) {
  const canvasRef = useRef(null)

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Mic button with ripple rings */}
      <div className="relative flex items-center justify-center">
        {/* Ripple rings - only show when listening */}
        {isListening && (
          <>
            <div className="absolute rounded-full border-2 animate-ping"
              style={{
                width: '160px', height: '160px',
                borderColor: 'rgba(255,107,26,0.6)',
                animationDuration: '1s',
              }} />
            <div className="absolute rounded-full border-2 animate-ping"
              style={{
                width: '200px', height: '200px',
                borderColor: 'rgba(255,107,26,0.4)',
                animationDuration: '1.4s',
                animationDelay: '0.2s',
              }} />
            <div className="absolute rounded-full border-2 animate-ping"
              style={{
                width: '240px', height: '240px',
                borderColor: 'rgba(244,196,48,0.3)',
                animationDuration: '1.8s',
                animationDelay: '0.4s',
              }} />
          </>
        )}

        {/* Glow aura */}
        <div
          className="absolute rounded-full"
          style={{
            width: '140px', height: '140px',
            background: isListening
              ? 'radial-gradient(circle, rgba(255,69,0,0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,107,26,0.25) 0%, transparent 70%)',
            transition: 'all 0.3s',
          }}
        />

        {/* Main mic button */}
        <button
          onClick={onToggle}
          className="relative z-10 rounded-full flex flex-col items-center justify-center gap-1 transition-all active:scale-95 select-none"
          style={{
            width: '120px',
            height: '120px',
            background: isListening
              ? 'radial-gradient(circle at 40% 35%, #FF6666, #FF0000, #8B0000)'
              : 'radial-gradient(circle at 40% 35%, #FF9955, #FF6B1A, #CC4400)',
            border: `4px solid ${isListening ? '#FF4500' : '#F4C430'}`,
            boxShadow: isListening
              ? '0 0 30px rgba(255,0,0,0.6), 0 0 60px rgba(255,69,0,0.4), 0 8px 32px rgba(0,0,0,0.5)'
              : '0 0 20px rgba(255,107,26,0.5), 0 0 40px rgba(255,107,26,0.3), 0 8px 32px rgba(0,0,0,0.4)',
            cursor: 'pointer',
          }}
          aria-label={isListening ? 'सुनना बंद करें' : 'बोलना शुरू करें'}
        >
          {/* Flame tip on top */}
          <div
            className="absolute"
            style={{
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '18px',
              background: isListening
                ? 'linear-gradient(to top, #FF4500, #FF8C00, rgba(255,255,0,0.5), transparent)'
                : 'linear-gradient(to top, #F4C430, #FF8C00, rgba(255,200,0,0.5), transparent)',
              clipPath: 'polygon(50% 0%, 15% 100%, 85% 100%)',
              animation: 'flicker 0.6s ease-in-out infinite alternate',
            }}
          />

          {/* Mic icon */}
          <span style={{ fontSize: '36px', lineHeight: 1 }}>
            {isListening ? '🔴' : '🎤'}
          </span>
          <span
            className="font-bold text-center leading-tight"
            style={{ fontSize: '11px', color: '#FFF8E7', maxWidth: '80px' }}
          >
            {isListening ? 'सुन रहा हूँ...' : 'बोलें'}
          </span>
        </button>
      </div>

      {/* Status text */}
      <div className="text-center px-4">
        {isListening ? (
          <div className="flex flex-col items-center gap-2">
            <p className="font-semibold" style={{ color: '#FF8C42', fontSize: '16px' }}>
              🎙️ आपकी आवाज़ सुन रहा हूँ...
            </p>
            {transcript && (
              <p
                className="font-medium px-4 py-2 rounded-xl text-sm italic"
                style={{
                  background: 'rgba(255,107,26,0.15)',
                  border: '1px solid rgba(255,107,26,0.3)',
                  color: '#F0E0C0',
                  maxWidth: '320px',
                }}
              >
                "{transcript}"
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="font-bold" style={{ color: '#FFF8E7', fontSize: '17px' }}>
              ऊपर का बटन दबाएं और बोलें 🗣️
            </p>
            <p className="font-medium" style={{ color: '#C9960C', fontSize: '14px' }}>
              जैसे: "मुझे आटा, चावल और तेल चाहिए"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
