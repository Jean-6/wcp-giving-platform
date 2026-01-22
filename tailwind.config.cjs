/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      extend: {
        keyframes:{
          slideLeft:{
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0%)' },
          }
        },
        animation: {
          'slide-left': 'slideLeft 0.1s ease-out',
        }
      },
    },
  },
  plugins: [],
};



