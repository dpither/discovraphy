/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    colors: {
      black: "#121212",
      white: "#ffffff",
      green: "#1ed760",
      blue: "#3772ff",
      "blue-h": "#185cff",
    },
    extend: {
      animation: {
        fadeInUp: "fadeInUp 1s ease-in-out",
        fadeOutDown: "fadeOutDown 1s ease-in-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeOutDown: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(20px)" },
        },
      },
    },
  },
  plugins: [],
};
