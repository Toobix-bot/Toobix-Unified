/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        consciousness: '#9D4EDD',
        flow: '#06FFA5',
        alert: '#FF006E',
        luna: '#4CC9F0',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
