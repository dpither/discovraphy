import Logo from "../assets/Logo";
import DarkModeSelector from "./DarkModeSelector";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-black bg-white p-4 dark:border-white dark:bg-black">
      <div className="flex items-center justify-between">
        <div className="md:flex-1"></div>
        <Link to={`/`} className="flex w-56 md:w-96">
          <Logo />
        </Link>
        <div className="mb-2 flex-1 text-end">
          <DarkModeSelector />
        </div>
      </div>
    </header>
  );
}
