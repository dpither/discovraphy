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
      className={`rounded-full ${isSelected ? "border border-blue bg-blue text-white " : "border border-black text-black dark:border-white dark:text-white"} px-4 py-1`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
