/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0c0e12',
        foreground: '#f3f4f6',
        card: '#13161c',
        'card-foreground': '#f3f4f6',
        muted: '#1f242d',
        'muted-foreground': '#9ca3af',
        accent: '#1e2430',
        'accent-foreground': '#f9fafb',
        border: '#232936',
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
          hover: '#2563eb',
        },
        secondary: {
          DEFAULT: '#1f2937',
          foreground: '#d1d5db',
        },
      },
      borderRadius: {
        lg: '0.625rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
