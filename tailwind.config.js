/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#150c2b',
          'bg-secondary': '#1f1440',
          'bg-card': '#241a4d',
          'bg-card-alt': '#2c2060',
          cyan: '#35d0f5',
          purple: '#7c4dff',
          pink: '#ff3d81',
          gold: '#ffb238',
          'gold-dark': '#ff7a1a',
          green: '#34d17a',
          red: '#ef4a5f',
        }
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Fredoka"', 'system-ui', 'sans-serif'],
        body: ['"Fredoka"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(53, 208, 245, 0.4)',
        'glow-purple': '0 0 20px rgba(124, 77, 255, 0.4)',
        'glow-gold': '0 0 25px rgba(255, 178, 56, 0.55)',
        'glow-pink': '0 0 20px rgba(255, 61, 129, 0.4)',
        'glow-green': '0 0 20px rgba(52, 209, 122, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
