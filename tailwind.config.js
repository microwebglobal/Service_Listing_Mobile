/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5f60b9',
        black: '#000000',
        dark: '#263446',
        gray: '#605f60',
        white: '#FFFFFF',
        lightGrey: '#EFEFFA',
        green: '#22c55e',
        // yellow: '#eab308',
        error: '#d33646',
        primaryBlackRGBA: 'rgba(12,15,20,0.5)',
        secondaryBlackRGBA: 'rgba(0,0,0,0.7)',
      },
      fontFamily: {
        PoppinsBlack: ['Poppins-Black', 'sans-serif'],
        PoppinsRegular: ['Poppins-Regular', 'sans-serif'],
        PoppinsBold: ['Poppins-Bold', 'sans-serif'],
        PoppinsMedium: ['Poppins-Medium', 'sans-serif'],
        PoppinsSemiBold: ['Poppins-SemiBold', 'sans-serif'],
        PoppinsLight: ['Poppins-Light', 'sans-serif'],
        PoppinsThin: ['Poppins-Thin', 'sans-serif'],
        PoppinsExtraLight: ['Poppins-ExtraLight', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
