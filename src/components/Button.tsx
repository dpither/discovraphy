interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string;
	children?: React.ReactNode;
}

export default function Button({ text, children, ...props }: ButtonProps) {
	return (
		<button
			className={`$ bg-blue disabled:pointer-events-none disabled:bg-sub-text-dark disabled:text-sub-text-light dark:disabled:bg-sub-text-light dark:disabled:text-sub-text-dark ${text ? "min-w-32 px-4 py-2" : "p-2"} group cursor-pointer rounded-full font-semibold text-lg text-white outline-blue outline-offset-2 transition-colors hover:bg-hover-blue focus-visible:outline-2 group-hover:bg-hover-blue`}
			{...props}
		>
			{text}
			{children}
		</button>
	);
}

// OLD TEXT CLASS "rounded-sm px-4 py-2 lg:rounded-lg"
