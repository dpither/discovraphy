import Logo from "../assets/Logo";
import DarkModeSelector from "./DarkModeSelector";

export default function Header() {
  return (
    <header className="border-b border-black bg-white p-4 dark:border-white dark:bg-black">
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>
        <div>
          <Logo />
        </div>
        <div className="mb-2 flex-1 text-end">
          <DarkModeSelector />
        </div>
      </div>
    </header>
  );
}
