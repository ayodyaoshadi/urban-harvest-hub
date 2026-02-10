/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* Extended: two new colours (eco-green, earth-brown) + harvest-gold, fresh-teal for branding */
      colors: {
        'eco-green': '#2E8B57',
        'earth-brown': '#8B4513',
        'harvest-gold': '#FFD700',
        'fresh-teal': '#20B2AA',
      },
      /* Extended: one new font family */
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

