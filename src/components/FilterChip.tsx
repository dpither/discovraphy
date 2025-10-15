interface FilterChipProps {
	text: string;
	isSelected: boolean;
	onClick: () => void;
}

export default function FilterChip({
	text,
	isSelected,
	onClick,
}: FilterChipProps) {
	return (
		<button
			className={`rounded-full border border-transparent ${isSelected ? "bg-blue text-white hover:bg-hover-blue" : "text-sub-text-light hover:border-black hover:text-black dark:text-sub-text-dark dark:hover:border-white dark:hover:text-white"} px-4 py-1`}
			onClick={onClick}
			type="button"
		>
			{text}
		</button>
	);
}
