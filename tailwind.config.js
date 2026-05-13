/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0d0d0d',
          900: '#141414',
          800: '#1c1c1c',
          700: '#242424',
          600: '#2e2e2e',
          500: '#3a3a3a',
        },
        amber: {
          film: '#e8a045',
          light: '#f0bc72',
          muted: '#c4864a',
          dim: '#7a4f2a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
