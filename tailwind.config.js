/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        coral: '#FF8B6A',
        'coral-dark': '#E8664A',
        sage: '#8FBC8F',
        'sage-dark': '#6A9C6A',
        honey: '#FFD166',
        'honey-dark': '#F0BB44',
        bark: '#3D2E1E',
        'bark-light': '#6B4F35',
        parchment: '#FFFAF5',
        blush: '#FFE0D6',
      },
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
