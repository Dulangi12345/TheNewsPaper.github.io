/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'serif': ['PT Serif', 'serif'],
    },

    extend: {
      width:{
        '500' : '500px',
      },
      height:{
        '500' : '500px',
        '700' : '700px',
        '800' : '800px',

      },
      colors:{
        'quiz-green' : '#4D455D',
        'quiz-red' : '#E96479'
      }
    },
  },
  plugins: [],
}

