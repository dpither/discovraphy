import type { Config } from "tailwindcss"
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    colors: {
      transparent: 'transparent',
      black: "#121212",
      white: "#ffffff",
      green: "#1ed760",
      blue: "#3772ff",
      "blue-h": "#185cff",
    },
    extend: {
    },
  },
  plugins: [],
} satisfies Config;
