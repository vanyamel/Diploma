/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f6f7fa',
          100: '#ebedf4',
          200: '#d3d7e6',
          300: '#acb5d1',
          400: '#7f8fb8',
          500: '#5e729e',
          600: '#485880',
          700: '#3a4768',
          800: '#262f45',
          900: '#141a28',
          950: '#0b0e17',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
