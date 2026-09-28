/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean': '#1E3A5F',
        'seaglass': '#8FC1B5',
        'sand': '#E9DCC3',
        'coral': '#E8735A',
        'offwhite': '#FAFAF7',
        'ink': '#1C1C1C',
      },
      fontFamily: {
        'serif': ['Literata', 'serif'],
        'sans': ['Figtree', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.08)',
        'card': '0 0 4px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'lifted': '0 4px 8px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'ring-inset': 'inset 0 0 0 1px rgba(0, 0, 0, 0.06)',
        'input-inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
