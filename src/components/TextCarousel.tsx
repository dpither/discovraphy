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
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ y: "10%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "10%", opacity: 0 }}
        transition={{ duration: transitionDuration }}
        style={{
          position: "absolute",
          whiteSpace: "pre",
        }}
      >
        {" " + texts[index]}
      </motion.span>
    </AnimatePresence>
  );
}
