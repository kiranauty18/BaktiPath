/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          cream: "#FDFBF7",
          saffron: "#FF8C00",
          golden: "#D4AF37",
          pink: "#F8BBD0",
          darkMaroon: "#4A0E17",
        }
      }
    },
  },
  plugins: [],
}