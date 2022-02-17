const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['smallest-pixel-7', ...defaultTheme.fontFamily.sans],
    }
  },
  plugins: [],
  mode: 'jit',
}
