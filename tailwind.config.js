/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C151E',
          50: '#3D0C12',
          100: '#4A0E15',
          500: '#6C151E',
          600: '#581018',
          700: '#3D0C12',
        },
        secondary: {
          DEFAULT: '#F5DABF',
          50: '#0A1F1D',
          100: '#0C2A27',
          600: '#0C302E',
          700: '#0F3D3A',
        },
        green: {
          DEFAULT: '#0F3D3A',
          50: '#071412',
          100: '#0A1F1D',
          600: '#0C302E',
          700: '#082422',
        },
        accent: '#1A6B65',
        cream: {
          DEFAULT: '#F5DABF',
          50: '#FDF8F0',
          100: '#F5DABF',
          200: '#E8C49A',
        },
        success: '#1A6B65',
        warning: '#E8C49A',
        danger: '#6C151E',
        bg: '#071412',
        card: '#140A0C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.35), 0 1px 2px -1px rgba(108, 21, 30, 0.35)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.45), 0 2px 8px -2px rgba(108, 21, 30, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
