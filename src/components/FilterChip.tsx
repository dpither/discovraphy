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
			className={`${isSelected ? "bg-blue text-white hover:bg-hover-blue" : "text-sub-text-light hover:border-black hover:text-black dark:text-sub-text-dark dark:hover:border-white dark:hover:text-white"} cursor-pointer rounded-full border border-transparent px-4 py-1 outline-blue outline-offset-2 focus-visible:outline-2`}
			onClick={onClick}
			type="button"
		>
			{text}
		</button>
	);
}
