const { neutral } = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@changespage/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      // emit base + dark variants for the used families and shades (incl. preview 500)
      pattern:
        /(bg|text|border)-(blue|indigo|purple|pink|red|orange|yellow|green|emerald|cyan)-(100|200|500|800|900)/,
      variants: ["dark"],
    },
    // Gray backgrounds/borders used globally
    { pattern: /bg-gray-(800|900|950)/, variants: ["dark"] },
    { pattern: /border-gray-(700|800)/, variants: ["dark"] },
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
