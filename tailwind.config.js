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
        "slide-up-delay": "slideUp 0.6s ease-out 0.15s forwards",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "message-in-left": "messageInLeft 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "message-in-right": "messageInRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "typing-cursor": "typingCursor 1s step-end infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "welcome-pop": "welcomePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "gradient-slow": "gradientX 15s ease infinite",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "slide-in-left": "slideInLeft 0.3s ease-out forwards",
        "reveal-up": "revealUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "reveal-left": "revealLeft 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "reveal-right": "revealRight 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "reveal-scale": "revealScale 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "marquee": "marquee 30s linear infinite",
        "marquee-reverse": "marqueeReverse 30s linear infinite",
        "chat-msg-1": "chatMsg 0.4s cubic-bezier(0.16,1,0.3,1) 0.5s forwards",
        "chat-msg-2": "chatMsg 0.4s cubic-bezier(0.16,1,0.3,1) 1.8s forwards",
        "chat-msg-3": "chatMsg 0.4s cubic-bezier(0.16,1,0.3,1) 2.6s forwards",
        "chat-typing": "chatTyping 0.4s ease 1.2s forwards",
        "dot-pulse": "dotPulse 1.4s ease-in-out infinite",
        "number-pop": "numberPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        borderGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        revealLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        revealRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        revealScale: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        chatMsg: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        chatTyping: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        dotPulse: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        numberPop: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "premium": "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.04)",
        "premium-lg": "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06), 0 24px 60px rgba(0,0,0,0.06)",
        "premium-blue": "0 2px 4px rgba(49,130,246,0.04), 0 8px 24px rgba(49,130,246,0.08), 0 24px 48px rgba(49,130,246,0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};
