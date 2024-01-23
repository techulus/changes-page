const { neutral } = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        gray: neutral,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
