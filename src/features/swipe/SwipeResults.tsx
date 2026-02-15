import { motion } from "motion/react";
import { Link } from "react-router";
import Button from "../../components/Button";
import { usePlayerStore } from "../../hooks/usePlayerStore";

export default function SwipeResults() {
	const { queue } = usePlayerStore();
	return (
		<div className="flex h-full items-center justify-center">
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="flex rounded-sm border-1 border-black p-4 lg:rounded-lg dark:border-white"
				initial={{ y: "5%", opacity: 0 }}
				transition={{ duration: 0.5, ease: "easeInOut", bounce: 0 }}
			>
				<div className="flex w-64 flex-col gap-2 text-left">
					<h2>Expedition Complete</h2>
					<p>
						You explored {queue.length} track{queue.length > 1 ? "s" : ""}.
					</p>
					<p>
						Liked: {queue.filter((track) => track.status === "LIKED").length}
					</p>
					<p>
						Disliked:{" "}
						{queue.filter((track) => track.status === "DISLIKED").length}
					</p>
					<div className="text-center">
						<Link to={`/setup`}>
							<Button text="Keep Exploring"></Button>
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
