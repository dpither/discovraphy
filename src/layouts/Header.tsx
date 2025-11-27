import { Link } from "react-router";
import DiscovraphyLogo from "../assets/discovraphy_logo.svg?react";
import DarkModeSelector from "../components/DarkModeSelector";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-black border-b bg-white transition-all dark:border-white dark:bg-black">
			<div className="flex items-center justify-between">
				<div className="md:flex-1 md:pl-4"></div>
				<Link
					className="flex px-4 pt-2.5 outline-blue outline-offset focus-visible:outline-2"
					draggable={false}
					to={`../`}
				>
					<DiscovraphyLogo className="h-12 w-full fill-blue hover:fill-hover-blue" />
				</Link>
				<div className="flex-1 pr-4 text-end">
					<DarkModeSelector />
				</div>
			</div>
		</header>
	);
}
