/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Important prefix to ensure Tailwind doesn't conflict with MUI
  corePlugins: {
    // Disable preflight to avoid conflicts with MUI's baseline
    preflight: false,
  },
}
