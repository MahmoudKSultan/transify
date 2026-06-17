import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        success: { DEFAULT: "#22c55e", 50: "#f0fdf4", 100: "#dcfce7" },
        error: { DEFAULT: "#ef4444", 50: "#fef2f2", 100: "#fee2e2" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        input: "8px",
        card: "12px",
        overlay: "16px",
      },
      animation: {
        "swap-in": "swapIn 250ms ease-in-out",
        "fade-in": "fadeIn 200ms ease-out",
      },
      keyframes: {
        swapIn: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
