interface RangeSliderProps {
  value?: number;
  max?: number;
  onChange?: (val: number) => void;
  onCommit?: (val: number) => void;
}

export default function RangeSlider({ value, max }: RangeSliderProps) {
  function onRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
    value = Number(e.target.value);
  }

  // function onRangeCommit(e: React.ChangeEvent<HTMLInputElement>) {
  //   value = Number(e.target.value);
  // }

  return (
    <div className="relative flex h-4 w-full items-center">
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={onRangeChange}
        // onMouseUp={onRangeCommit}
        // onTouchEnd={onRangeCommit}
      />
    </div>
  );
}
