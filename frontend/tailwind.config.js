/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4ECE1',
          300: '#EBDDC9',
          400: '#DFCBB1',
        },
        charcoal: {
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
        },
        terracotta: {
          50: '#FCF5F3',
          100: '#F7E7E3',
          200: '#EFCDC5',
          300: '#E2A99B',
          400: '#D27B66',
          500: '#C85A32',
          600: '#B84A28',
          700: '#9A3A1E',
          800: '#7E311A',
          900: '#672A19',
        },
        burgundy: {
          800: '#701A24',
          900: '#58111B',
        },
        champagne: {
          400: '#E7C89E',
          500: '#D8B17C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
