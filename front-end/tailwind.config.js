/** @type {import('tailwindcss').Config} */
module.exports = {
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
        'custom-blue': {
          '50': '#f2f9f9',
          '100': '#ddeef0',
          '200': '#bedde3',
          '300': '#91c4cf',
          '400': '#5ca2b2',
          '500': '#428798',
          '600': '#396f81',
          '700': '#345b6a',
          '800': '#314d59',
          '900': '#2c424d',
          '950': '#192a33',
        },
      }
    },
  },
  plugins: [require('tailwindcss-primeui')],
}

