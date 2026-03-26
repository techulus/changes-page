const { neutral, amber } = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@changespage/ui/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/streamdown/dist/*.js",
  ],
  safelist: [
    {
      // emit base + dark variants for the used families and shades (incl. preview 500)
      pattern:
        /(bg|text|border)-(blue|indigo|purple|violet|pink|red|orange|yellow|green|emerald|teal|cyan)-(100|200|400|500|600|800|900)/,
      variants: ["dark"],
    },
    // Gray backgrounds/borders used globally
    { pattern: /bg-gray-(800|900|950)/, variants: ["dark"] },
    { pattern: /border-gray-(700|800)/, variants: ["dark"] },
  ],
  theme: {
    extend: {
      colors: {
        gray: neutral,
        yellow: amber,
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "'Instrument Serif'",
          "Georgia",
          "serif",
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
