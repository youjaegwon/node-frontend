module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#3182f6', // 토스 블루
          600: '#1b64da',
        },
        'toss-blue': '#3182f6',
      },
      boxShadow: {
        brand: '0 8px 24px rgba(49,130,246,0.35)',
        toss: '0 8px 24px rgba(49,130,246,0.4)', // ✅ shadow-toss 정의 추가
      },
    },
  },
  plugins: [],
}
