/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./presets/**/*.{js,vue,ts}",
    ],
  theme: {
    extend: {
      colors: {
        'custom-blue-50': '#f2f9f9',
        'custom-blue-100': '#ddeef0',
        'custom-blue-200': '#bedde3',
        'custom-blue-300': '#91c4cf',
        'custom-blue-400': '#5ca2b2',
        'custom-blue-500': '#428798',
        'custom-blue-600': '#396f81',
        'custom-blue-700': '#345b6a',
        'custom-blue-800': '#314d59',
        'custom-blue-900': '#2c424d',
        'custom-blue-950': '#192a33',
      }
    },
  },
  plugins: [require('tailwindcss-primeui')],
}

