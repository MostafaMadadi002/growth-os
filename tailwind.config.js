/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          500: '#10b981', // Emerald 500
          900: '#064e3b',
        },
        slate: {
          50: '#f8fafc',
          500: '#64748b',
          900: '#0f172a',
        },
        indigo: {
          600: '#4f46e5',
        },
        amber: {
          500: '#f59e0b',
        },
        success: '#22c55e',
        error: '#ef4444',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      }
    },
  },
  plugins: [],
}
