interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: React.ReactNode;
}

export default function Button({
  text,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`bg-blue disabled:bg-sub-text-dark disabled:text-sub-text-light dark:disabled:bg-sub-text-light dark:disabled:text-sub-text-dark disabled:pointer-events-none ${text ? "rounded-sm lg:rounded-md" : "rounded-full"} ${text ? "px-4 py-2" : "p-2"} hover:bg-hover-blue text-lg font-semibold text-white transition cursor-pointer`}
      {...props}
    >
      {text}
      {children}
    </button>
  );
}
