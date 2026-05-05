/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#fbf9f4",
        "surface-low": "#f5f3ee",
        "surface-mid": "#f0eee9",
        "surface-high": "#e4e2dd",
        primary: "#27443d",
        sage: "#3e5c54",
        "sage-soft": "#c8eadf",
        "sage-muted": "#adcdc3",
        ink: "#1b1c19",
        "ink-muted": "#414846",
        outline: "#c1c8c4",
        amber: "#ebc351",
      },
      boxShadow: {
        sage: "0 4px 20px rgba(62, 92, 84, 0.06)",
        lift: "0 8px 32px rgba(62, 92, 84, 0.1)",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
