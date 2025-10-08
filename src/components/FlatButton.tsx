interface FlatButtonProps {
  text?: string;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function FlatButton({
  text,
  onClick,
  disabled,
  children,
}: FlatButtonProps) {
  return (
    <button
      className={`disabled:pointer-events-none ${text ? "rounded-sm lg:rounded-lg" : "rounded-full"} ${text ? "px-4 py-2" : "p-2"}text-xl font-semibold text-white transition enabled:active:scale-95 group`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      {children}
    </button>
  );
}

