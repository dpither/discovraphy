import DiscovraphyLogo from "../assets/discovraphy_logo.svg?react";
import DarkModeSelector from "../components/DarkModeSelector";
import { Link } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black bg-white px-4 dark:border-white dark:bg-black">
      <div className="mx-auto flex items-center justify-between">
        <div className="md:flex-1"></div>
        <Link to={`../`} className="flex h-12 mt-3" draggable={false}>
          <DiscovraphyLogo className="fill-blue w-full h-full hover:fill-hover-blue" />
        </Link>
        <div className="flex-1 text-end">
          <DarkModeSelector />
        </div>
      </div>
    </header>
  );
}
