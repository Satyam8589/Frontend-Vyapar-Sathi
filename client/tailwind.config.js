/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f9fafb',
        primary: {
          500: '#f59e0b',
        },
        accent: {
          500: '#0ea5e9', // Blue
        },
      },
      backgroundImage: {
        'radial-yellow-blue': 'radial-gradient(circle at 10% 20%, rgba(254, 252, 232, 1) 0%, rgba(239, 246, 255, 1) 100%)',
        'mesh-light': 'radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.15) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(2, 6, 23, 0.2) 0, transparent 50%), radial-gradient(at 0% 100%, rgba(2, 6, 23, 0.15) 0, transparent 50%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
