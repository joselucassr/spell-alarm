module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      customSerif: 'Merriweather',
      mont: 'Montserrat',
      nunito: 'Nunito',
    },
    extend: {
      saturate: {
        25: '.25',
        75: '.75',
      },
      brightness: {
        25: '.25',
        175: '1.75',
      },
    },
  },
  plugins: [],
};
