module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#3182f6',
          600: '#1b64da',
        },
      },
      boxShadow: {
        brand: '0 8px 24px rgba(49,130,246,0.35)',
      },
    },
  },
  plugins: [],
}
