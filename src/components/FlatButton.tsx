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
			className={`disabled:pointer-events-none ${text ? "rounded-sm lg:rounded-lg" : "rounded-full"} ${text ? "px-4 py-2" : "p-2"} cursor-pointer font-semibold text-white text-xl transition`}
			{...props}
		>
			{text}
			{children}
		</button>
	);
}
