import { AnimatePresence, motion } from "motion/react";
import { type QueueDecision, usePlayerStore } from "../../hooks/usePlayerStore";
import TrackCard from "./TrackCard";

export default function TrackQueue() {
	const { currentTrack, currentIndex, currentTimeMs, queueDecision } =
		usePlayerStore();

	const variants = {
		initial: (direction: QueueDecision) => ({
			y: direction === "NEXT" || direction === "SWIPED" ? "5%" : "-5%",
			opacity: 0,
		}),
		center: { y: 0, opacity: 1 },
		exit: (direction: QueueDecision) => ({
			y: direction === "SWIPED" ? 0 : direction === "NEXT" ? "-5%" : "5%",
			opacity: direction === "SWIPED" ? 1 : 0,
		}),
	};

	return (
		<AnimatePresence mode="wait">
			{currentTrack && (
				<motion.div
					animate="center"
					className="origin-bottom"
					custom={queueDecision}
					exit="exit"
					initial="initial"
					key={currentTrack.uri}
					transition={{ duration: 0.5, ease: "easeInOut", bounce: 0 }}
					variants={variants}
				>
					<TrackCard
						currentTimeMs={currentTimeMs}
						queuePosition={currentIndex}
						track={currentTrack}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
