import { useRef, useState } from "react";

interface SliderProps {
	value: number;
	maxValue: number;
	onValueChange: (value: number) => void;
	onValueChangeFinished?: (value: number) => void;
}

export default function Slider({
	value,
	maxValue,
	onValueChange,
	onValueChangeFinished,
}: SliderProps) {
	const sliderRef = useRef<HTMLDivElement>(null);
	const dragValueRef = useRef(value);
	const [isDragging, setIsDragging] = useState(false);
	const percent = value / maxValue;

	function handlePointerDown(e: React.PointerEvent) {
		setIsDragging(true);
		handlePointerMove(e);
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);
		e.stopPropagation();
	}

	function handlePointerMove(e: React.PointerEvent | PointerEvent) {
		if (!sliderRef.current) return;
		const rect = sliderRef.current.getBoundingClientRect();
		let newPercent = (e.clientX - rect.left) / rect.width;
		newPercent = Math.max(0, Math.min(1, newPercent));
		const newVal = Math.floor(newPercent * maxValue);
		dragValueRef.current = newVal;
		onValueChange(newVal);
	}

	function handlePointerUp() {
		setIsDragging(false);
		if (onValueChangeFinished) onValueChangeFinished(dragValueRef.current);
		window.removeEventListener("pointermove", handlePointerMove);
		window.removeEventListener("pointerup", handlePointerUp);
	}

	return (
		<div
			className="group relative flex w-full cursor-pointer py-1"
			onPointerDownCapture={handlePointerDown}
		>
			{/* Full Bar */}
			<div
				className="relative h-1 flex-1 rounded-full bg-sub-text-light dark:bg-sub-text-dark"
				ref={sliderRef}
			>
				{/* Filled Progress */}
				<div
					className="absolute top-0 bottom-0 left-0 rounded-full bg-blue transition-colors"
					style={{ width: `${percent * 100}%` }}
				/>
				{/* Thumb */}
				<div
					className={`-translate-y-1/2 absolute top-1/2 size-2 rounded-full ${isDragging ? "bg-hover-blue" : "bg-transparent group-hover:bg-blue"}`}
					style={{ left: `calc(${percent * 100}% - 0.25rem)` }}
				></div>
			</div>
		</div>
	);
}
