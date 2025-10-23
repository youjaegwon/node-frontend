module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#3182f6',   // Toss Blue
          600: '#1b64da',
        },
        'toss-blue': '#3182f6',
      },
      boxShadow: {
        brand: '0 8px 24px rgba(49,130,246,0.35)',
        toss:  '0 8px 24px rgba(49,130,246,0.40)',  // shadow-toss
      },
      keyframes: {
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
      },
      animation: {
        'scale-in': 'scale-in 180ms cubic-bezier(0.2, 0.6, 0.2, 1) both',
        'fade-in':  'fade-in 180ms ease-out both',
        'slide-up': 'slide-up 220ms cubic-bezier(0.2, 0.6, 0.2, 1) both',
      },
    },
  },
  plugins: [],
}
