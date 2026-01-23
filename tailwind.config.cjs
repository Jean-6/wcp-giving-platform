/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
      extend: {
        keyframes:{
          slideLeft:{
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0%)' },
          }
        },
        animation: {
          'slide-left': 'slideLeft 0.35s ease-out forwards',
        }
      },
  },
  plugins: [],
};



