import { AnimatePresence, motion } from "motion/react";

interface TextCarouselProps {
	texts: string[];
	index: number;
}

export default function TextCarousel({ texts, index }: TextCarouselProps) {
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
				transition={{ duration: 0.25, ease: "easeInOut" }}
			>
				{`${texts[index]}`}
			</motion.span>
		</AnimatePresence>
	);
}
