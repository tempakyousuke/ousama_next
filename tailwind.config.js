const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      amber: colors.amber,
      lime: colors.lime,
      warmGray: colors.warmGray,
    },
    extend: {
      colors: {
        amber: {
          1000: '#642c0d',
          1100: '#50230a',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
