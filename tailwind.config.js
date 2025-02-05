/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0070FF',
        dark: '#263446',
        gray: '#788AA5',
        white: '#FFFFFF',
        lightGrey: '#EFEFFA',
        yellow: '#eab308',
        error: '#C62B3B',
      },
    },
  },
  plugins: [],
};
