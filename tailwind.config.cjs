/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // 토스 블루
        toss: {
          blue: "#3182f6",
          dark: "#111827"
        }
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "fade-out": { from: { opacity: 1 }, to: { opacity: 0 } },
        "slide-up": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to:   { opacity: 1, transform: "translateY(0)" }
        },
        "scale-in": {
          from: { opacity: 0, transform: "scale(0.98)" },
          to:   { opacity: 1, transform: "scale(1)" }
        }
      },
      animation: {
        "fade-in": "fade-in .25s ease-out",
        "fade-out": "fade-out .25s ease-in forwards",
        "slide-up": "slide-up .35s cubic-bezier(.22,.61,.36,1)",
        "scale-in": "scale-in .25s ease-out",
      },
      boxShadow: {
        'toss': '0 8px 24px rgba(49,130,246,.25)'
      }
    },
  },
  plugins: [],
}
