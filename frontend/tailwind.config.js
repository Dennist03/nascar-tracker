/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nascar: {
          bg: '#1A1A2E',
          card: '#222244',
          surface: '#2A2A4A',
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
