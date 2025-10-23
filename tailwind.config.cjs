/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#22c55e' /* 토스 느낌의 민트/그린 톤 */,
      },
      boxShadow: {
        toss: '0 8px 24px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'scale-in': { '0%': { transform: 'scale(0.96)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
      animation: {
        'scale-in': 'scale-in .18s ease-out',
      },
    },
  },
  plugins: [],
};
