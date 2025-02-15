/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5f60b9',
        black: '#000000',
        dark: '#263446',
        gray: '#545354',
        white: '#FFFFFF',
        lightGrey: '#EFEFFA',
        yellow: '#eab308',
        error: '#C62B3B',
      },
    },
  },
  plugins: [],
};
