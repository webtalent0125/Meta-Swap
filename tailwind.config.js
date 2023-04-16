/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    colors: {
      primary: '#1E1E1E',
      bgbutton: '#E5E54B',
      bgsection: '#101010',
      bginnersection: '#141822',
      percentborder: '#1D2A43',
      title: '#ffffff',
      subtitle: '#7185AA',
    },
    borderRadius: {
      none: '0',
      sm: '13px',
      DEFAULT: '30px',
      md: '7px',
      lg: '20px',
      full: '50%',
      large: '12px',
    },
    padding: {
      '30px': '30px',
      '24px': '24px',
      '18px': '18px',
      '14px': '14px',
    },
  },
  extend: {
    colors: {
      gray: {
        100: '#ffffff',
      },
    },
  },
  Plugin: {
    'postcss-import': {},
  },
};
