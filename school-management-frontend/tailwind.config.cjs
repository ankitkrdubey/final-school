/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        danger: 'var(--danger)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        muted: 'var(--text-muted)',
        background: 'var(--bg-body)',
        card: 'var(--bg-card)',
      },
    },
  },
  plugins: [],
};
