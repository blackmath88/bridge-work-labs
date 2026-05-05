/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — warm-neutral, layered like macOS materials
        canvas: "#f6f5f1",
        surface: "#ffffff",
        "surface-2": "#faf9f6",
        "surface-3": "#f1efe9",
        "surface-sunken": "#ecebe5",

        // Borders — hairlines, weighted by depth
        hairline: "rgba(20, 24, 22, 0.08)",
        "hairline-strong": "rgba(20, 24, 22, 0.14)",

        // Text
        ink: "#15171a",
        "ink-2": "#3a3f44",
        "ink-3": "#6b7178",
        "ink-4": "#9aa0a6",

        // Brand — calm sage, used sparingly
        sage: {
          50: "#eef4f2",
          100: "#dbe7e2",
          200: "#b9d0c8",
          300: "#8fb3a8",
          400: "#5f8d80",
          500: "#3e6b5e",
          600: "#2f5447",
          700: "#264438",
          800: "#1d3429",
          900: "#13241c",
        },

        // Accent — warm amber for moments of attention
        accent: {
          400: "#f0c060",
          500: "#e3a93e",
          600: "#c48a23",
        },
      },
      borderRadius: {
        // Apple-consistent scale
        xs: "6px",
        sm: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "22px",
        "3xl": "28px",
      },
      boxShadow: {
        // Layered Apple-style shadows
        hairline: "inset 0 0 0 1px rgba(20, 24, 22, 0.06)",
        e1: "0 1px 0 rgba(20, 24, 22, 0.04), 0 1px 2px rgba(20, 24, 22, 0.04)",
        e2: "0 1px 0 rgba(20, 24, 22, 0.04), 0 6px 16px -8px rgba(20, 24, 22, 0.12)",
        e3: "0 1px 0 rgba(20, 24, 22, 0.04), 0 12px 32px -12px rgba(20, 24, 22, 0.18)",
        e4: "0 2px 0 rgba(20, 24, 22, 0.04), 0 24px 60px -24px rgba(20, 24, 22, 0.22)",
        focus: "0 0 0 4px rgba(95, 141, 128, 0.18)",
        "focus-tight": "0 0 0 3px rgba(95, 141, 128, 0.22)",
        glass:
          "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 0 rgba(20,24,22,0.04), 0 8px 24px -12px rgba(20,24,22,0.12)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "ui-monospace",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
        tight: "-0.01em",
        snug: "-0.005em",
        wide: "0.04em",
        widest: "0.14em",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backdropBlur: {
        xs: "4px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 240ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 220ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
