/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#00A3FF",  // 포인트(토스 느낌의 블루)
          600: "#0A84FF"
        }
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.25)"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        slideUp: {
          "0%": { transform: "translateY(24px)" },
          "100%": { transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fadeIn .35s ease-out forwards",
        "fade-in-up": "fadeInUp .45s ease-out forwards",
        "slide-up": "slideUp .35s ease-out forwards"
      }
    }
  },
  plugins: []
};
