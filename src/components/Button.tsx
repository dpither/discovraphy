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
      className="rounded-lg bg-blue px-4 py-2 text-xl font-semibold text-white hover:bg-blue-h active:brightness-75"
      onClick={func}
    >
      {title}
    </button>
  );
}
