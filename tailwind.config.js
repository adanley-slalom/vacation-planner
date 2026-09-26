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
      }
    },
  },
  plugins: [],
}
