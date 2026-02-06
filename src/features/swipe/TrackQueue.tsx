import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";
import Button from "../../components/Button";
import TrackCard from "../../components/TrackCard";
import {
	type QueueDirection,
	usePlayerStore,
} from "../../hooks/usePlayerStore";

export default function TrackQueue() {
	const { currentTrack, queueDirection, isQueueEnd } = usePlayerStore();

	const variants = {
		initial: (direction: QueueDirection) => ({
			y: direction === "NEXT" ? "5%" : "-5%",
			opacity: 0,
		}),
		center: { y: 0, scale: 1, opacity: 1 },
	};

	return (
		<AnimatePresence custom={queueDirection} mode="wait">
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
					{!isQueueEnd && <TrackCard track={currentTrack} />}
					{isQueueEnd && (
						<div className="flex rounded-sm border-1 border-black p-4 lg:rounded-lg dark:border-white">
							<div className="flex w-64 flex-col gap-2 text-left">
								<h2>Expedition Complete</h2>
								<p>You discovered 67 tracks</p>
								<p>d</p>
								<div className="text-center">
									<Link to={`/setup`}>
										<Button text="Keep Exploring"></Button>
									</Link>
								</div>
							</div>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
