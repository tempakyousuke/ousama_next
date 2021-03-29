const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: ["bg-opacity-70"],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      lightBlue: colors.lightBlue,
      red: colors.rose,
      amber: colors.amber,
      lime: colors.lime,
      warmGray: colors.warmGray,
      violet: colors.violet,
      purple: colors.purple,
    },
    extend: {
      colors: {
        amber: {
          1000: "#642c0d",
          1100: "#50230a",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
