/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "#0B0F1A",
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at center, rgba(168,85,247,0.5), rgba(59,130,246,0.4), rgba(0,0,0,0.9))',
      },
    },
  },
  plugins: [],
}