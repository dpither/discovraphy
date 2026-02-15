import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

import type { DummyTrack, DummyTrackHandle } from "./DummyTrackCard";
import DummyTrackCard from "./DummyTrackCard";

const AUTO_SWIPE_DELAY = 3000;

interface DummyCardQueueProps {
	cards: DummyTrack[];
	index: number;
	setIndex: (i: number) => void;
}

export default function DummyCardQueue({
	cards,
	index,
	setIndex,
}: DummyCardQueueProps) {
	const cardRef = useRef<DummyTrackHandle>(null);
	const swipeTimer = useRef<number>(null);

	const startSwipeTimer = () => {
		if (swipeTimer.current) {
			clearTimeout(swipeTimer.current);
		}

		swipeTimer.current = setTimeout(() => {
			if (Math.random() > 0.5) {
				cardRef.current?.playSwipe("LEFT");
			} else {
				cardRef.current?.playSwipe("RIGHT");
			}
		}, AUTO_SWIPE_DELAY);
	};

	const stopSwipeTimer = () => {
		if (swipeTimer.current) {
			clearTimeout(swipeTimer.current);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <start/stop is constant, and cardIndex used to restart the timer for each card>
	useEffect(() => {
		startSwipeTimer();
		return () => {
			stopSwipeTimer();
		};
	}, [index]);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				initial={{ y: "5%", opacity: 0 }}
				key={index}
				transition={{ duration: 0.5, ease: "easeInOut", bounce: 0 }}
			>
				<DummyTrackCard
					onDragEnd={startSwipeTimer}
					onDragStart={stopSwipeTimer}
					onSwipe={() => {
						setIndex((index + 1) % cards.length);
					}}
					position={`${index + 1}/${cards.length}`}
					ref={cardRef}
					track={cards[index]}
				/>
			</motion.div>
		</AnimatePresence>
	);
}
