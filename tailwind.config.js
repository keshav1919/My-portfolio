/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: {
    preflight: false, // CRITICAL: Do NOT reset existing portfolio styles
  },
  theme: {
    extend: {
      colors: {
        kc: {
          bg: 'var(--bg)',
          'bg-soft': 'var(--bg-soft)',
          surface: 'var(--surface)',
          'surface-2': 'var(--surface-2)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          accent: 'var(--accent)',
          'accent-surface': 'var(--accent-surface)',
          'accent-dark': 'var(--accent-dark)',
          'accent-muted': 'var(--accent-muted)',
          border: 'var(--border)',
          'border-hover': 'var(--border-hover)',
          danger: 'var(--danger)',
          success: 'var(--success)',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'kc-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'kc-md': '0 10px 30px rgba(0, 0, 0, 0.12)',
        'kc-lg': '0 20px 50px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'kc-sm': '10px',
        'kc-md': '16px',
        'kc-lg': '24px',
        'kc-xl': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
};
