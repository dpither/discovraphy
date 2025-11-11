import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import SpotifyPlayerCard from "../../components/SpotifyPlayerCard";
import { usePlayerStore } from "../../hooks/usePlayerStore";
import { useSetupStore } from "../../hooks/useSetupStore";

export default function TrackQueue() {
	const { selectedAlbums } = useSetupStore();
	const { queue, currentIndex, next, prev, getQueue } = usePlayerStore();
	const [direction, setDirection] = useState<"NEXT" | "PREV">("NEXT");

	function handleNext() {
		setDirection("NEXT");
		next();
	}

	function handlePrev() {
		setDirection("PREV");
		prev();
	}

	const variants = {
		initial: (direction: "NEXT" | "PREV") => ({
			y: direction === "NEXT" ? "5%" : "-5%",
			opacity: 0,
		}),
		center: { y: 0, scale: 1, opacity: 1 },
	};

	useEffect(() => {
		if (queue.length > 0 || selectedAlbums.length === 0) return;

		getQueue(selectedAlbums);
	}, [queue, selectedAlbums, getQueue]);

	return (
		<AnimatePresence custom={direction} mode="wait">
			<motion.div
				animate="center"
				className="origin-bottom"
				custom={direction}
				initial="initial"
				key={currentIndex}
				transition={{ duration: 0.5, ease: "easeInOut", bounce: 0 }}
				variants={variants}
			>
				{queue.length > 0 && (
					<SpotifyPlayerCard
						albumTrack={queue[currentIndex]}
						onNextTrack={handleNext}
						onPrevTrack={handlePrev}
						onSwipeLeft={() => {
							console.log("Swiped left");
							handleNext();
						}}
						onSwipeRight={() => {
							console.log("Swiped right");
							handleNext();
						}}
					/>
				)}
			</motion.div>
		</AnimatePresence>
	);
}
