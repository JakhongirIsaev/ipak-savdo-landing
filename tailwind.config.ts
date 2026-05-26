import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BirLiy Green scale
        green: {
          50: "#ECFAEE",
          100: "#D6F3DD",
          300: "#7ED99A",
          500: "#03B73D",
          700: "#027F2E",
          800: "#015521",
        },
        // BirLiy ink/paper/mist
        ink: {
          900: "#0B1826",
          700: "#3B4756",
          500: "#6B7682",
        },
        paper: "#F6F7F4",
        mist: "#E8EBE5",
        // Signals — UI states only, never decoration
        warn: "#FFC83D",
        stop: "#E5484D",
        info: "#3C82F6",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        // Sora display headlines benefit from slightly tighter tracking
        tightish: "-0.015em",
      },
      transitionTimingFunction: {
        // BirLiy default ease-out — settle, don't bounce
        "birliy": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      transitionDuration: {
        "120": "120ms",
        "320": "320ms",
        "600": "600ms",
      },
      animation: {
        "settle-in": "settleIn 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
      keyframes: {
        settleIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
