/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C8A891',
        'primary-dark': '#A0795C',
        secondary: '#8B6F47',
        dark: '#6B4F3A',
        light: '#FBF7F4',
        border: '#E0D0C1',
        cream: '#F5EDE4',
        muted: '#9C8577'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
}
