/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // Teal accent for medical
        background: "#ffffff",
        text: "#111827"
      }
    },
  },
  plugins: [],
}
