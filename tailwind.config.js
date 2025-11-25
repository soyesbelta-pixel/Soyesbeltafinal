/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'heading': ['Playfair Display', 'serif'],
        'body': ['Manrope', 'sans-serif'],
      },
      colors: {
        // Paleta Chocolate & Beige
        'chocolate': '#2C1E1E',      // Textos principales - Chocolate oscuro
        'chocolate-light': '#6D4A40', // Textos secundarios - Chocolate claro
        'beige': '#EAD9C8',          // Botones y fondos suaves
        'beige-hover': '#DCC9B8',    // Hover state para beige
        'rose': '#C96F7B',           // Acentos (solo badges/destacados)
        'rose-hover': '#B85F6C',     // Hover state para rosa
        'paper': '#FFFFFF',          // Fondo principal - Blanco
        'line': '#EDE9E6',           // Bordes y líneas suaves

        // Compatibilidad con código existente (mapeo a nueva paleta)
        esbelta: {
          chocolate: '#2C1E1E',
          'chocolate-light': '#6D4A40',
          'chocolate-dark': '#2C1E1E',
          beige: '#EAD9C8',
          rose: '#E64A7B',
          cream: '#FBF7F4',
          sand: '#D7BFA3',
          sage: '#EAD9C8',
          coral: '#F88379',
          terracotta: '#C96F7B',
          'cream-light': '#FFFFFF',
          'sand-light': '#EDE9E6',
          'sand-dark': '#DCC9B8',
          'sage-light': '#EAD9C8',
          'sage-dark': '#DCC9B8',
          'terracotta-light': '#C96F7B',
          'terracotta-dark': '#B85F6C',
        },
        // Colores funcionales
        primary: '#EAD9C8',      // beige (botones)
        secondary: '#2C1E1E',    // chocolate (textos)
        accent: '#C96F7B',       // rosa (badges)
        neutral: '#EDE9E6',      // líneas
        background: '#FFFFFF',   // blanco
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8', transform: 'scale(1.05)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}