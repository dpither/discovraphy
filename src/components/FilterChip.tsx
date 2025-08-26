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
      className={`rounded-full ${isSelected ? "border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border border-black text-black dark:border-white dark:text-white"} px-4 py-1`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
