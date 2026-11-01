/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#030814',
          900: '#060f24',
          850: '#08142c',
          800: '#0b1a3a',
          700: '#12264f',
          600: '#1a3468',
        },
        electric: {
          300: '#7defff',
          400: '#3ee6ff',
          500: '#18d4f5',
          600: '#00b4d8',
        },
        gold: {
          300: '#ffe39a',
          400: '#f7cf6a',
          500: '#eab84a',
        },
        pitch: {
          400: '#4ade80',
          500: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(24, 212, 245, 0.18)',
        card: '0 18px 44px -24px rgba(2, 8, 23, 0.9)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at 15% 0%, rgba(0, 180, 216, 0.22), transparent 42%), radial-gradient(circle at 85% 15%, rgba(234, 184, 74, 0.12), transparent 40%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        'fade-up': 'fade-up 0.45s ease-out both',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
