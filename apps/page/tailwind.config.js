const { neutral } = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@changes-page/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Roadmap category colors
    'bg-blue-100', 'text-blue-800', 'border-blue-200', 'dark:bg-blue-900', 'dark:text-blue-200', 'dark:border-blue-800',
    'bg-indigo-100', 'text-indigo-800', 'border-indigo-200', 'dark:bg-indigo-900', 'dark:text-indigo-200', 'dark:border-indigo-800',
    'bg-purple-100', 'text-purple-800', 'border-purple-200', 'dark:bg-purple-900', 'dark:text-purple-200', 'dark:border-purple-800',
    'bg-pink-100', 'text-pink-800', 'border-pink-200', 'dark:bg-pink-900', 'dark:text-pink-200', 'dark:border-pink-800',
    'bg-red-100', 'text-red-800', 'border-red-200', 'dark:bg-red-900', 'dark:text-red-200', 'dark:border-red-800',
    'bg-orange-100', 'text-orange-800', 'border-orange-200', 'dark:bg-orange-900', 'dark:text-orange-200', 'dark:border-orange-800',
    'bg-yellow-100', 'text-yellow-800', 'border-yellow-200', 'dark:bg-yellow-900', 'dark:text-yellow-200', 'dark:border-yellow-800',
    'bg-green-100', 'text-green-800', 'border-green-200', 'dark:bg-green-900', 'dark:text-green-200', 'dark:border-green-800',
    'bg-emerald-100', 'text-emerald-800', 'border-emerald-200', 'dark:bg-emerald-900', 'dark:text-emerald-200', 'dark:border-emerald-800',
    'bg-cyan-100', 'text-cyan-800', 'border-cyan-200', 'dark:bg-cyan-900', 'dark:text-cyan-200', 'dark:border-cyan-800',
    // Dark mode backgrounds
    'bg-gray-950', 'bg-gray-900', 'bg-gray-800', 'dark:bg-gray-950', 'dark:bg-gray-900', 'dark:bg-gray-800',
    'border-gray-800', 'dark:border-gray-800', 'border-gray-700', 'dark:border-gray-700'
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
