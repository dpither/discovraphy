import { Link } from "react-router";
import DiscovraphyLogo from "../assets/discovraphy_logo.svg?react";
import DarkModeSelector from "../components/DarkModeSelector";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-black border-b bg-white px-4 dark:border-white dark:bg-black">
			<div className="mx-auto flex items-center justify-between">
				<div className="md:flex-1"></div>
				<Link className="mt-3 flex h-12" draggable={false} to={`../`}>
					<DiscovraphyLogo className="h-full w-full fill-blue hover:fill-hover-blue" />
				</Link>
				<div className="flex-1 text-end">
					<DarkModeSelector />
				</div>
			</div>
		</header>
	);
}
