/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        deep: '#000000',
        'dark-gray': '#0a0a0a',
        'mid-gray': '#141414',
        'line-gray': '#1f1f1f',
        'muted': '#6b6b6b',
        'soft-white': '#f5f5f5',
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 255, 255, 0.08)',
        'glow-strong': '0 0 60px rgba(255, 255, 255, 0.15)',
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};
