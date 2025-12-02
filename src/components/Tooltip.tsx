interface TooltipProps {
	text: string;
	position?: "TOP" | "BOTTOM";
	disabled?: boolean;
	children: React.ReactNode;
}

export default function Tooltip({
	text,
	position = "BOTTOM",
	disabled = false,
	children,
}: TooltipProps) {
	if (disabled) {
		return <>{children}</>;
	}
	return (
		<div className="group relative inline-block">
			{children}
			<span
				className={`-translate-x-1/2 pointer-events-none invisible absolute ${position === "TOP" ? "bottom-full mb-1" : "top-full mt-1"} left-1/2 z-50 select-none rounded-sm bg-sub-text-dark px-2 py-1 text-center font-semibold text-black text-xs opacity-0 transition-all group-hover:visible group-hover:opacity-100 lg:rounded-lg dark:bg-sub-text-light dark:text-white`}
			>
				{text}
			</span>
		</div>
	);
}
