import IconMoon from "../assets/IconMoon";
import IconSun from "../assets/IconSun";
import { useState } from "react";

export default function DarkModeSelector() {
  const [isDark, setIsDark] = useState(localStorage.theme === "dark");

  function toggleDarkMode() {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    isDark ? (localStorage.theme = "light") : (localStorage.theme = "dark");
  }

  return (
    <button
      className="rounded-full bg-blue p-2 hover:bg-blue-h active:brightness-75 transition"
      onClick={toggleDarkMode}
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  );
}
