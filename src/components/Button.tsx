// import { getStarted } from "../script";

export default function Button({
  title,
  func = () => {},
}: {
  title: string;
  func?: () => void;
}) {
  return (
    <button
      className="rounded-lg bg-blue px-6 py-3 text-2xl font-bold text-white hover:bg-blue-h active:brightness-75"
      onClick={func}
    >
      {title}
    </button>
  );
}
