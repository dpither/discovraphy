import { AnimatePresence, motion } from "motion/react";
import TrackCard from "../../components/TrackCard";
import { type QueueDecision, usePlayerStore } from "../../hooks/usePlayerStore";

export default function TrackQueue() {
	const {
		currentTrack,
		currentIndex,
		queueDecision: queueDirection,
		currentTimeMs,
	} = usePlayerStore();

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
					custom={queueDirection}
					exit="exit"
					initial="initial"
					key={currentTrack.uri}
					transition={{ duration: 0.5, ease: "easeInOut", bounce: 0 }}
					variants={variants}
				>
					<TrackCard
						currentTimeMs={currentTimeMs}
						index={currentIndex}
						track={currentTrack}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
