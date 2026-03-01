/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f1726',
        panel: '#1f2c46',
        panelSoft: '#233252',
        line: '#3f567c',
        sand: '#f4f0e4',
        muted: '#c7d3e8',
        brand: '#f3b747',
        brandDark: '#d69f35',
        ok: '#65d6a3'
      }
    }
  },
  plugins: []
};
