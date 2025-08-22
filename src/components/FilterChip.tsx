interface FilterChipProps {
  text: string;
  isSelected: boolean;
}

export default function FilterChip({text, isSelected} : FilterChipProps) {
  return <button className="border-black dark:border-white border rounded-full text-black dark:text-white px-4 py-1">
    {text}
  </button>;
}
