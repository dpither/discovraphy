interface ButtonProps {
  text?: string;
  onClick: () => void;
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
      className={`bg-blue disabled:bg-disabled-grey disabled:text-lightGrey disabled:pointer-events-none ${text ? "rounded-sm lg:rounded-md" : "rounded-full"} ${text ? "px-4 py-2" : "p-2"} hover:bg-hover-blue text-xl font-semibold text-white transition`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
      {children}
    </button>
  );
}
