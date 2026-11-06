/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        brand: {
          50: '#F0FAF9',
          100: '#D5F1EE',
          200: '#A9E2DC',
          300: '#74CCC3',
          400: '#42B1A7',
          500: '#2A958C',
          600: '#1F7A73',
          700: '#1B6360',
          800: '#1A4F4D',
          900: '#183F3E',
        },
        ink: {
          50: '#F7F5F2',
          100: '#EDEAE4',
          200: '#DCD8D0',
          300: '#BDB8AE',
          400: '#908B81',
          500: '#6B6761',
          600: '#54514C',
          700: '#3F3D39',
          800: '#2A2926',
          900: '#1C1B19',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'sheet-up': {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(48px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-48px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'slide-up-sheet': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
        'sheet-up': 'sheet-up 0.35s ease-out both',
        'slide-in-right': 'slide-in-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'slide-in-left': 'slide-in-left 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'progress-fill': 'progress-fill 2.5s linear forwards',
        'slide-up-sheet': 'slide-up-sheet 0.4s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
