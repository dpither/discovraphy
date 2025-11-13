import { motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import placeholder from "../assets/artist_placeholder.png";
import SpotifyLogo from "../assets/spotify_logo.svg?react";
import {
	type AlbumTrack,
	type SwipeDirection,
	usePlayerStore,
} from "../hooks/usePlayerStore";
import { formatTimeMs } from "../lib/util";
import Slider from "./Slider";

interface TrackCardProps {
	albumTrack: AlbumTrack;
	onSwipe: (direction: SwipeDirection) => void;
}

const X_BOUND = 100;

export default function TrackCard({ albumTrack, onSwipe }: TrackCardProps) {
	const { currentTimeMs, setCurrentTimeMs, seek, registerHandler } =
		usePlayerStore();

	const [scope, animate] = useAnimate();
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-X_BOUND, X_BOUND], [-11.25, 11.25]);
	const opacity = useTransform(x, [-X_BOUND, 0, X_BOUND], [0, 1, 0]);

	useEffect(() => {
		registerHandler(async (direction: SwipeDirection) => {
			const targetX = direction === "LEFT" ? -X_BOUND : X_BOUND;
			await animate(
				scope.current,
				{ x: targetX, scale: 1.05 },
				{ duration: 0.3, ease: "easeInOut", bounce: 0 },
			);

			onSwipe(direction);
		});
	}, [registerHandler, animate, scope.current, onSwipe]);

	return (
		<motion.div
			className="flex origin-bottom select-none flex-col gap-2 rounded-sm border border-black p-4 hover:cursor-grab hover:active:cursor-grabbing lg:rounded-lg dark:border-white"
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			dragMomentum={false}
			onDragEnd={() => {
				if (x.get() >= X_BOUND) onSwipe("RIGHT");
				else if (x.get() <= -X_BOUND) onSwipe("LEFT");
			}}
			ref={scope}
			style={{
				x,
				rotate,
				opacity,
			}}
			whileDrag={{ scale: 1.05 }}
		>
			<SpotifyLogo className="w-18 place-self-center" />
			{/* Track Art */}
			<div className="aspect-square w-64 text-white dark:text-black">
				<img
					alt="Track artwork"
					className="size-full rounded-sm lg:rounded-lg"
					draggable={false}
					src={
						albumTrack.album.images[0]
							? albumTrack.album.images[0].url
							: placeholder
					}
				/>
			</div>
			{/* Info */}
			<div className="flex w-64 flex-col text-left">
				<p className="line-clamp-1 font-semibold text-black dark:text-white">
					{albumTrack.track.name}
				</p>
				<p className="line-clamp-1 text-sm text-sub-text-light dark:text-sub-text-dark">
					{albumTrack.track.artists.map((artist) => artist.name).join(", ")}
				</p>
			</div>
			{/* Progress Bar */}
			<div className="flex w-full flex-col">
				<Slider
					maxValue={albumTrack.track.duration_ms}
					onValueChange={(value) => {
						setCurrentTimeMs(value);
					}}
					onValueChangeFinished={(value) => {
						seek(value);
					}}
					value={currentTimeMs}
				/>
				<div className="flex justify-between text-sub-text-light text-xs dark:text-sub-text-dark">
					<span>{formatTimeMs(currentTimeMs)}</span>
					<span>{formatTimeMs(albumTrack.track.duration_ms)}</span>
				</div>
			</div>
		</motion.div>
	);
}
