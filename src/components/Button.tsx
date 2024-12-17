interface ButtonProps {
  text?: string;
  onClick?: () => void;
  children?: React.ReactNode
}
export default function Button({ text, onClick , children}: ButtonProps) {
  return (
    <button
      className={`rounded-lg bg-blue ${text ? "px-4 py-2" : "p-2"} text-xl font-semibold text-white transition hover:bg-blue-h active:scale-95 active:brightness-75`}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
}
