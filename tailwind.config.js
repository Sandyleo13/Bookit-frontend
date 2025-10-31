/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF",        // main blue from Figma
        secondary: "#F8F8F8",
        accent: "#FFB800",
        textMain: "#1E1E1E",
        textSecondary: "#555555",
        cardBg: "#FFFFFF",
        borderLight: "#E5E5E5",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0px 4px 12px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
