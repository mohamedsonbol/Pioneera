/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
        serif: ['Amiri', 'serif'],
      },
      colors: {
        brand: {
          50: '#fff5f6',
          100: '#ffe3e8',
          200: '#ffc9d4',
          300: '#ff9fb3',
          400: '#ff6b8a',
          500: '#f23e6a',
          600: '#d91e4f',
          700: '#b3153f',
          800: '#931336',
          900: '#7a1330',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        ink: {
          50: '#f8f9fa',
          100: '#eef0f2',
          200: '#dde1e6',
          300: '#c2c8d0',
          400: '#9aa3ad',
          500: '#727b85',
          600: '#545b63',
          700: '#3f444b',
          800: '#272a2e',
          900: '#15171a',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
