import { motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect } from "react";
import placeholder from "../assets/artist_placeholder.png";
import SpotifyLogo from "../assets/spotify_logo.svg?react";
import { type SwipeDirection, usePlayerStore } from "../hooks/usePlayerStore";
import { formatTimeMs } from "../lib/util";
import Slider from "./Slider";

interface TrackCardProps {
	track: Spotify.Track;
}

const X_BOUND = 125;

export default function TrackCard({ track }: TrackCardProps) {
	const {
		currentIndex,
		queue,
		currentTimeMs,
		setVisualTimeMs,
		seek,
		startTimer,
		stopTimer,
		swipe,
		registerPlaySwipeHandler,
	} = usePlayerStore();

	const [scope, animate] = useAnimate();
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-X_BOUND, X_BOUND], [-11.25, 11.25]);
	const opacity = useTransform(x, [-X_BOUND, 0, X_BOUND], [0, 1, 0]);

	const handlePlaySwipe = useCallback(
		async (direction: SwipeDirection) => {
			const targetX = direction === "LEFT" ? -X_BOUND : X_BOUND;
			swipe(direction);
			if (scope.current) {
				await animate(
					scope.current,
					{ x: targetX, scale: 1.05 },
					{ duration: 0.3, ease: "easeInOut", bounce: 0 },
				);
			}
		},
		[animate, scope, swipe],
	);

	useEffect(() => {
		registerPlaySwipeHandler(handlePlaySwipe);
	}, [registerPlaySwipeHandler, handlePlaySwipe]);

	return (
		<motion.div
			className="flex origin-bottom select-none flex-col gap-2 rounded-sm border border-black p-4 hover:cursor-grab hover:active:cursor-grabbing lg:rounded-lg dark:border-white"
			drag="x"
			dragElastic={0}
			dragMomentum={false}
			onDragEnd={(_event, info) => {
				const offset = info.offset.x;
				// const velocity = info.velocity.x; TUNE LATER MAYBE?

				if (offset >= X_BOUND) {
					console.log(`SWIPING RIGHT WITH GESTURE`);
					swipe("RIGHT");
				} else if (offset <= -X_BOUND) {
					console.log(`SWIPING LEFT WITH GESTURE`);
					swipe("LEFT");
				} else {
					animate(
						scope.current,
						{ x: 0 },
						{ duration: 0.3, ease: "easeInOut", bounce: 0 },
					);
				}
			}}
			ref={scope}
			style={{
				x,
				rotate,
				opacity,
			}}
			whileDrag={{ scale: 1.05 }}
		>
			{/* Header */}
			<div className="flex justify-between">
				<SpotifyLogo className="w-18" />
				<p className="sub-text text-xs">{`${currentIndex + 1}/${queue.length}`}</p>
			</div>
			{/* Track Art */}
			<div className="aspect-square w-64 text-white dark:text-black">
				<img
					alt="Track artwork"
					className="size-full rounded-sm lg:rounded-lg"
					draggable={false}
					src={track.album.images[0] ? track.album.images[0].url : placeholder}
				/>
			</div>
			{/* Info */}
			<div className="flex w-64 flex-col text-left">
				<p className="line-clamp-1 font-semibold">{track.name}</p>
				<p className="sub-text line-clamp-1 text-sm">
					{track.artists.map((artist) => artist.name).join(", ")}
				</p>
			</div>
			{/* Progress Bar */}
			<div className="flex w-full flex-col">
				<Slider
					maxValue={track.duration_ms}
					onValueChange={(value) => {
						stopTimer();
						setVisualTimeMs(value);
					}}
					onValueChangeFinished={(value) => {
						startTimer();
						seek(value);
					}}
					value={currentTimeMs}
				/>
				<div className="flex justify-between">
					<p className="sub-text text-xs">{formatTimeMs(currentTimeMs)}</p>
					<p className="sub-text text-xs">{formatTimeMs(track.duration_ms)}</p>
				</div>
			</div>
		</motion.div>
	);
}
