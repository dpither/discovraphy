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
      className={`rounded-full border border-transparent ${isSelected ? "bg-blue hover:bg-hover-blue text-white" : "text-sub-text-light dark:text-sub-text-dark hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"} px-4 py-1`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
