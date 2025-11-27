interface FlatButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string;
	children?: React.ReactNode;
}

export default function FlatButton({
	text,
	children,
	...props
}: FlatButtonProps) {
	return (
		<button
			className={`group rounded-full disabled:pointer-events-none ${text ? "min-w-32 px-4 py-2" : "p-2"} cursor-pointer font-semibold text-white text-xl outline-blue transition focus-visible:outline-2`}
			{...props}
		>
			{text}
			{children}
		</button>
	);
}
