/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode
        'ada-red': '#E30614',
        'ada-bg-dark': '#2D2440',
        'ada-section-dark': '#1C1726',
        'ada-accent-dark': '#F24444',
        'ada-text-primary-dark': '#F2F2F2',
        'ada-text-secondary-dark': '#282136',
        
        // Light Mode
        'ada-bg-light': '#FFFFFF',
        'ada-section-light': '#F2F2F2',
        'ada-accent-light': '#F25050',
        'ada-text-primary-light': '#282136',
      }
    },
  },
  plugins: [],
}