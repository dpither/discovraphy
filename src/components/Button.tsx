interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string;
	children?: React.ReactNode;
}

export default function Button({ text, children, ...props }: ButtonProps) {
	return (
		<button
			className={`bg-blue disabled:pointer-events-none disabled:bg-sub-text-dark disabled:text-sub-text-light dark:disabled:bg-sub-text-light dark:disabled:text-sub-text-dark ${text ? "rounded-sm lg:rounded-md" : "rounded-full"} ${text ? "px-4 py-2" : "p-2"} cursor-pointer font-semibold text-lg text-white outline-blue outline-offset-2 transition hover:bg-hover-blue focus-visible:outline-2`}
			{...props}
		>
			{text}
			{children}
		</button>
	);
}
