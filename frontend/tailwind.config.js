/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9ff',
          100: '#f0f4ff',
          200: '#e8f2ff',
          300: '#c7d2fe',
          400: '#a5b4fc',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          medium: 'rgba(255, 255, 255, 0.5)',
          dark: 'rgba(255, 255, 255, 0.3)',
        },
        text: {
          primary: '#2d3748',
          secondary: '#64748b',
          muted: '#94a3b8',
        }
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        'secondary-gradient': 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
        'app-bg': 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 50%, #e8f2ff 100%)',
      },
      backdropBlur: {
        'glass': '40px',
      },
      boxShadow: {
        'glass-light': '0 8px 16px -4px rgba(139, 92, 246, 0.15)',
        'glass-heavy': '0 25px 50px -12px rgba(99, 102, 241, 0.15)',
        'glass-inner': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)',
      },
      borderRadius: {
        'glass': '1.5rem',
      },
      animation: {
        'glass-shimmer': 'glass-shimmer 2s ease-in-out infinite',
        'liquid-float': 'liquid-float 6s ease-in-out infinite',
      },
      keyframes: {
        'glass-shimmer': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
        'liquid-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}