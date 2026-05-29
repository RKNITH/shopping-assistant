'use client'

export default function Header({ onHelp }) {
  return (
    <header className="relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1A0A00 0%, #3D1A00 50%, #1A0A00 100%)',
      borderBottom: '3px solid #FF6B1A',
    }}>
      {/* Decorative rangoli pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 20px,
          rgba(244,196,48,0.3) 20px,
          rgba(244,196,48,0.3) 21px
        ), repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 20px,
          rgba(255,107,26,0.2) 20px,
          rgba(255,107,26,0.2) 21px
        )`
      }} />

      {/* Village silhouette decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 40'%3E%3Cpath fill='%23FF6B1A' d='M0,40 L0,25 L20,15 L40,25 L60,10 L80,20 L100,5 L120,20 L140,15 L160,25 L180,10 L200,20 L220,25 L240,15 L260,20 L280,8 L300,20 L320,15 L340,25 L360,12 L380,22 L400,18 L420,25 L440,10 L460,20 L480,15 L500,25 L520,8 L540,20 L560,15 L580,25 L600,12 L620,22 L640,18 L660,25 L680,10 L700,20 L720,15 L740,25 L760,8 L780,20 L800,25 L800,40 Z'/%3E%3C/svg%3E")`,
        backgroundSize: '100% 100%'
      }} />

      <div className="relative z-10 px-4 py-4 flex items-center justify-between max-w-4xl mx-auto">
        {/* App Name */}
        <div className="flex items-center gap-3">
          <div className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🛒</div>
          <div>
            <h1 className="font-black leading-tight" style={{
              fontSize: '22px',
              color: '#FFF8E7',
              textShadow: '0 0 20px rgba(255,107,26,0.5)',
              letterSpacing: '-0.5px'
            }}>
              बाज़ार सहायक
            </h1>
            <p className="text-xs font-medium" style={{ color: '#F4C430', opacity: 0.9 }}>
              आपका स्मार्ट खरीदारी दोस्त 🌾
            </p>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="hidden sm:flex gap-1 items-center">
          {['🌸', '🪔', '🌸'].map((icon, i) => (
            <span key={i} className="text-lg opacity-70">{icon}</span>
          ))}
        </div>

        {/* Help Button */}
        <button
          onClick={onHelp}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(255,107,26,0.3), rgba(244,196,48,0.2))',
            border: '1.5px solid rgba(255,107,26,0.5)',
            color: '#FFF8E7',
            minHeight: '56px',
            minWidth: '56px',
          }}
          aria-label="मदद"
        >
          <span className="text-lg">❓</span>
          <span className="hidden sm:inline">मदद</span>
        </button>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, #FF6B1A, #F4C430, #FF6B1A, transparent)'
      }} />
    </header>
  )
}
