interface ButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  children?: React.ReactNode;
}
export default function Button({
  text,
  onClick,
  disabled,
  type,
  children,
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg bg-blue disabled:bg-disabledGrey disabled:text-lightGrey ${text ? "px-4 py-2" : "p-2"} text-xl font-semibold text-white transition enabled:hover:bg-hoverBlue enabled:active:scale-95 enabled:active:brightness-75`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
      {children}
    </button>
  );
}
