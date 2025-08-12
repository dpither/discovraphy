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
      hoverBlue: "#185cff",
      disabledGrey: "#a9a9a9",
      lightGrey: "#e5e4e2",
    },
    extend: {
    },
  },
  plugins: [],
} satisfies Config;
