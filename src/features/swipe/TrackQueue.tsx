import { AnimatePresence, motion } from "motion/react";
import TrackCard from "../../components/TrackCard";
import {
	type QueueDirection,
	usePlayerStore,
} from "../../hooks/usePlayerStore";

export default function TrackQueue() {
	const { currentTrack, queueDirection } = usePlayerStore();

	const variants = {
		initial: (direction: QueueDirection) => ({
			y: direction === "NEXT" ? "5%" : "-5%",
			opacity: 0,
		}),
		center: { y: 0, opacity: 1 },
	};

	return (
		<AnimatePresence mode="wait">
			{currentTrack && (
				<motion.div
					animate="center"
					className="origin-bottom"
					custom={queueDirection}
					initial="initial"
					key={currentTrack.uri}
					transition={{ duration: 0.5, ease: "easeInOut", bounce: 0 }}
					variants={variants}
				>
					<TrackCard track={currentTrack} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
