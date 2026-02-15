/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nascar: {
          bg: '#171717',
          card: '#010101',
          surface: '#3d3d40',
          border: '#4e4e4e',
          yellow: '#FEDB00',
          red: '#E31937',
        },
        flag: {
          green: '#00A651',
          yellow: '#FFD700',
          red: '#DC143C',
          checkered: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
