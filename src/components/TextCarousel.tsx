import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface TextCarouselProps {
	texts: string[];
	stopDuration: number;
	transitionDuration: number;
}

export default function TextCarousel({
	texts,
	stopDuration,
	transitionDuration,
}: TextCarouselProps) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % texts.length);
		}, stopDuration);
		return () => clearInterval(interval);
	}, [stopDuration, texts.length]);

	return (
		<AnimatePresence mode="wait">
			<motion.span
				animate={{ y: "0%", opacity: 1 }}
				exit={{ y: "10%", opacity: 0 }}
				initial={{ y: "10%", opacity: 0 }}
				key={index}
				style={{
					display: "inline-block",
				}}
				transition={{ duration: transitionDuration }}
			>
				{`${texts[index]}`}
			</motion.span>
		</AnimatePresence>
	);
}
