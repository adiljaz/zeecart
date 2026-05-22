/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "var(--text-primary)",
        terracotta: "var(--accent)",
        "warm-white": "var(--bg-primary)",
        border: "var(--border)",
        "card-bg": "var(--bg-secondary)",
        "navy-fixed": "var(--navy-fixed)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      aspectRatio: {
        'product': '4 / 5',
      },
      zIndex: {
        'header': '100',
      },
    },
  },
  plugins: [],
}
