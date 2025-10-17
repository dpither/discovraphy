import { useRef, useState } from "react";
import { formatTimeMs } from "../lib/util";

interface ProgressBarProps {
	durationMs: number;
	currentTimeMs: number;
	handleSeek: (timeMs: number) => void;
	handleSeekConfirm: (timeMs: number) => void;
}

export default function ProgressBar({
	durationMs,
	currentTimeMs,
	handleSeek,
	handleSeekConfirm,
}: ProgressBarProps) {
	const [isDragging, setIsDragging] = useState(false);
	const seekTarget = useRef(currentTimeMs);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const displayedTime = isDragging ? seekTarget.current : currentTimeMs;
	const percent = (displayedTime / Math.max(durationMs, 1)) * 100;

	function handlePointerDown(e: React.PointerEvent) {
		if (e.button !== 0) return;
		setIsDragging(true);
		handlePointerMove(e);
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);
		e.stopPropagation();
	}

	function handlePointerMove(e: React.PointerEvent | PointerEvent) {
		if (!progressBarRef.current) return;
		const rect = progressBarRef.current?.getBoundingClientRect();
		let newPercent = (e.clientX - rect.left) / rect.width;
		newPercent = Math.max(0, Math.min(1, newPercent));
		const newTimeMs = Math.floor(newPercent * durationMs);
		seekTarget.current = newTimeMs;
		currentTimeMs = newTimeMs;
		handleSeek(newTimeMs);
	}

	function handlePointerUp() {
		setIsDragging(false);
		handleSeekConfirm(seekTarget.current);
		window.removeEventListener("pointermove", handlePointerMove);
		window.removeEventListener("pointerup", handlePointerUp);
	}

	// function handleClick(e: React.MouseEvent) {
	// 	handlePointerMove(e as React.PointerEvent);
	// }

	return (
		<div className="flex w-full flex-col">
			<div
				className="group relative flex w-full cursor-pointer py-1"
				onPointerDownCapture={handlePointerDown}
				// onClick={handleClick}
			>
				<div
					className="relative h-1 flex-1 cursor-pointer rounded-full bg-sub-text-light dark:bg-sub-text-dark"
					ref={progressBarRef}
				>
					{/* filled progress */}
					<div
						className="w- absolute top-0 bottom-0 left-0 rounded-full bg-blue"
						style={{ width: `${percent}%` }}
					/>
					{/* thumb */}
					<div
						className={`-translate-y-1/2 absolute top-1/2 size-2 rounded-full ${isDragging ? "bg-hover-blue" : "bg-transparent group-hover:bg-blue"}`}
						style={{
							left: `calc(${percent}% - 0.25rem)`,
						}}
					/>
				</div>
			</div>
			{/* time labels */}
			<div className="flex justify-between text-sub-text-light text-xs dark:text-sub-text-dark">
				<span>{formatTimeMs(displayedTime)}</span>
				<span>{formatTimeMs(durationMs)}</span>
			</div>
		</div>
	);
}
