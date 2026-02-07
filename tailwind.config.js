/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f172a",
          dark: "#020617",
          light: "#1e293b",
        },
        toss: "#3182F6",
        accent: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
          dark: "#6D28D9",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        surface: {
          DEFAULT: "#f8fafc",
          dark: "#0f172a",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Helvetica Neue",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "message-in-left": "messageInLeft 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "message-in-right": "messageInRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "typing-cursor": "typingCursor 1s step-end infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "welcome-pop": "welcomePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(49, 130, 246, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(49, 130, 246, 0.3)" },
        },
        messageInLeft: {
          "0%": { opacity: "0", transform: "translateX(-12px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        messageInRight: {
          "0%": { opacity: "0", transform: "translateX(12px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        typingCursor: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        welcomePop: {
          "0%": { opacity: "0", transform: "scale(0.8) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
