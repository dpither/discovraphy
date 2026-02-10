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
			className={`${isSelected ? "border-transparent bg-blue text-white hover:bg-hover-blue" : "sub-text hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"} cursor-pointer rounded-sm border px-4 py-1 outline-blue outline-offset-2 focus-visible:outline-2 lg:rounded-lg`}
			onClick={onClick}
			type="button"
		>
			{text}
		</button>
	);
}
