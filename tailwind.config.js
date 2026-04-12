/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b9ccff',
          300: '#8aa8ff',
          400: '#5b7fff',
          500: '#3a5bdb',
          600: '#2d47c2',
          700: '#2337a0',
          800: '#1c2b7f',
          900: '#141f5c',
        },
      },
    },
  },
  plugins: [],
}

