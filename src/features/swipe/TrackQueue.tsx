import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import SpotifyPlayerCard from "../../components/SpotifyPlayerCard";
import { usePlayerStore } from "../../hooks/usePlayerStore";
import testAlbumTrack from "../../lib/testAlbumTrack";

export default function TrackQueue() {
	const { currentTrack, currentIndex, next, prev, setQueue } = usePlayerStore();
	const [direction, setDirection] = useState<"NEXT" | "PREV">("NEXT");

	useEffect(() => {
		setQueue([
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
			testAlbumTrack,
		]);
	}, [setQueue]);

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
			y: direction === "NEXT" ? "10%" : "-10%",
			opacity: 0,
		}),
		center: { y: 0, scale: 1, opacity: 1 },
	};

	return (
		<AnimatePresence custom={direction} mode="wait">
			<motion.div
				animate="center"
				className="origin-bottom"
				custom={direction}
				initial="initial"
				key={currentIndex}
				transition={{ duration: 0.3, ease: "easeInOut", bounce: 0 }}
				variants={variants}
			>
				{currentTrack ? (
					<SpotifyPlayerCard
						albumTrack={currentTrack}
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
				) : (
					<div>ERROR</div>
				)}
			</motion.div>
		</AnimatePresence>
	);
}
