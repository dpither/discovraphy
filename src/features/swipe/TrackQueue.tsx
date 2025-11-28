import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import TrackCard from "../../components/TrackCard";
import {
	type QueueDirection,
	usePlayerStore,
} from "../../hooks/usePlayerStore";

export default function TrackQueue() {
	const { queue, currentIndex, swipe, queueDirection, triggerSwipe } =
		usePlayerStore();

	const variants = {
		initial: (direction: QueueDirection) => ({
			y: direction === "NEXT" ? "5%" : "-5%",
			opacity: 0,
		}),
		center: { y: 0, scale: 1, opacity: 1 },
	};

	// Keyboard Listener
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.repeat) return;
			if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
				triggerSwipe("RIGHT");
				console.log("Swiped right with keyboard");
			}
			if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
				triggerSwipe("LEFT");
				console.log("Swiped left with keyboard");
			}
		};
		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [triggerSwipe]);

	return (
		<AnimatePresence custom={queueDirection} mode="wait">
			<motion.div
				animate="center"
				className="origin-bottom"
				custom={queueDirection}
				initial="initial"
				key={currentIndex}
				transition={{ duration: 0.5, ease: "easeInOut", bounce: 0 }}
				variants={variants}
			>
				{queue.length > 0 && (
					<TrackCard albumTrack={queue[currentIndex]} onSwipe={swipe} />
				)}
			</motion.div>
		</AnimatePresence>
	);
}
