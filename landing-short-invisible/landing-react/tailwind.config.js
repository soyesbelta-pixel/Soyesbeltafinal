/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'esbelta-chocolate': '#2C1E1E',
        'esbelta-cream': '#FBF7F4',
        'esbelta-sand': '#D7BFA3',
        'esbelta-coral': '#F88379',
        'esbelta-rose': '#E64A7B',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
