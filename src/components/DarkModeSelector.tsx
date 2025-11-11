import { useState } from "react";
import DarkModeIcon from "../assets/dark_mode_icon.svg?react";
import LightModeIcon from "../assets/light_mode_icon.svg?react";
import FlatButton from "./FlatButton";

export default function DarkModeSelector() {
	const [isDark, setIsDark] = useState(localStorage.theme === "dark");

	function toggleDarkMode() {
		setIsDark(!isDark);
		document.documentElement.classList.toggle("dark");
		localStorage.theme = isDark ? "light" : "dark";
	}

	return (
		<FlatButton onClick={toggleDarkMode}>
			{isDark ? (
				<LightModeIcon className="flat-icon" />
			) : (
				<DarkModeIcon className="flat-icon" />
			)}
		</FlatButton>
	);
}
