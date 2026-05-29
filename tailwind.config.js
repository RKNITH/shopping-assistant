/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF6B1A',
          light: '#FF8C42',
          dark: '#CC4A00',
        },
        turmeric: {
          DEFAULT: '#F4C430',
          light: '#FFD700',
          dark: '#C9960C',
        },
        soil: {
          DEFAULT: '#3D1A00',
          light: '#6B3A1F',
          dark: '#1A0A00',
        },
        cream: {
          DEFAULT: '#FFF8E7',
          dark: '#F0E0C0',
        },
        diya: '#FF4500',
      },
      fontFamily: {
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'ripple': 'ripple 1.5s linear infinite',
        'ripple2': 'ripple 1.5s linear 0.5s infinite',
        'ripple3': 'ripple 1.5s linear 1s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-warm': 'pulseWarm 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px #FF6B1A, 0 0 40px #FF6B1A' },
          '50%': { boxShadow: '0 0 40px #FF4500, 0 0 80px #FF4500, 0 0 120px #F4C430' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseWarm: {
          '0%, 100%': { backgroundColor: '#FF6B1A' },
          '50%': { backgroundColor: '#FF4500' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
