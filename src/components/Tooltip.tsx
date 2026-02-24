interface TooltipProps {
	text: string;
	children: React.ReactNode;
	disabled?: boolean;
	position?: "TOP" | "BOTTOM";
}

export default function Tooltip({
	text,
	children,
	disabled = false,
	position = "BOTTOM",
}: TooltipProps) {
	if (disabled) {
		return <>{children}</>;
	}
	return (
		<div className="group relative inline-block">
			{children}
			<p
				className={`-translate-x-1/2 pointer-events-none invisible absolute ${position === "TOP" ? "bottom-full mb-1" : "top-full mt-1"} left-1/2 z-50 select-none rounded-sm bg-sub-text-dark px-2 py-1 text-center font-semibold text-xs opacity-0 transition-all group-hover:visible group-hover:opacity-100 lg:rounded-lg dark:bg-sub-text-light`}
			>
				{text}
			</p>
		</div>
	);
}
