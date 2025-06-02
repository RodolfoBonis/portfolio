export default {
  darkMode: 'class',

  content: [
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './plugins/**/*.ts',
    './App.vue',
    './assets/**/*.css',
    './error.vue',
  ],

  safelist: [
    'bg-[var(--bg-color)]',
    'text-[var(--text-color)]',
    'text-[var(--heading-color)]',
  ],

  theme: {
    extend: {
      colors: {
        darkBG: '#0D1117',
        darkCard: '#161B22',
        darkBorder: '#30363D',
        textLight: '#C9D1D9',
        heading: '#F0F6FC',
        accent: '#58A6FF',
        accentLight: '#79C0FF',
        textDark: '#24292F',
        lightBG: '#FFFFFF',
        lightCard: '#F6F8FA',
        lightText: '#24292F',
        lightHeading: '#0D1117',
        lightAccent: '#0366D6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
