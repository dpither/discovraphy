import DarkModeIcon from "../assets/dark_mode_icon.svg?react";
import LightModeIcon from "../assets/light_mode_icon.svg?react";
import { useState } from "react";
import Button from "./Button";

export default function DarkModeSelector() {
  const [isDark, setIsDark] = useState(localStorage.theme === "dark");

  function toggleDarkMode() {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    isDark ? (localStorage.theme = "light") : (localStorage.theme = "dark");
  }

  return (
    // <button
    //   className="bg-blue enabled:hover:bg-hover-blue rounded-full p-2 transition enabled:active:scale-95 enabled:active:brightness-75"
    //   onClick={toggleDarkMode}
    // >
    //   {isDark ? <LightModeIcon /> : <DarkModeIcon/>}
    // </button>
    <Button onClick={toggleDarkMode}>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </Button>
  );
}
