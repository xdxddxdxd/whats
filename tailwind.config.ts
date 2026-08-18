import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: "#FFFFFF",
          "bg-soft": "#F7F9FC",
          ink: "#0A0A0A",
          "ink-soft": "#6B7280",
          card: "#FFFFFF",
          border: "#E5E9F0",
        },
        accent: {
          blue: "#7DD3FC",
          "blue-strong": "#38BDF8",
          "blue-deep": "#0284C7",
          "blue-light": "#F0F9FF",
          "blue-hover": "#BAE6FD",
        },
        wrap: {
          bg: "#0A0A0A",
          "bg-2": "#141414",
          ink: "#FFFFFF",
          "ink-soft": "#A3A3A3",
          "glow-1": "#38BDF8",
          "glow-2": "#0284C7",
          surface: "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.12)",
        }
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        display: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        caveat: ["var(--font-caveat)", "Caveat", "cursive"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SF Mono", "monospace"],
        emoji: [
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
          "sans-serif"
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(10, 10, 10, 0.05)',
        'soft-hover': '0 12px 32px -4px rgba(10, 10, 10, 0.09)',
        'bubble': '0 6px 20px -4px rgba(2, 132, 199, 0.12)',
        'glow-blue': '0 0 35px -5px rgba(56, 189, 248, 0.35)',
        'glow-dark': '0 0 40px -10px rgba(10, 10, 10, 0.6)',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.4s infinite ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        typing: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
