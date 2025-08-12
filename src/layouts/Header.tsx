import Logo from "../assets/Logo";
import DarkModeSelector from "../components/DarkModeSelector";
import { Link } from "react-router";
import tailwindConfig from "../../tailwind.config";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black bg-white p-4 dark:border-white dark:bg-black">
      <div className="mx-auto flex items-center justify-between">
        <div className="md:flex-1"></div>
        <Link to={`../`} className="flex w-56 md:w-80">
          <Logo fill={tailwindConfig.theme.colors.blue} />
        </Link>
        <div className="mb-2 flex-1 text-end">
          <DarkModeSelector />
        </div>
      </div>
    </header>
  );
}
