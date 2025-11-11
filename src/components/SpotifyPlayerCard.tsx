import { motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import placeholder from "../assets/artist_placeholder.png";
import SpotifyLogo from "../assets/spotify_logo.svg?react";
import { type AlbumTrack, usePlayerStore } from "../hooks/usePlayerStore";
import ProgressBar from "./ProgressBar";

interface SpotifyPlayerCardProps {
	albumTrack: AlbumTrack;
	onNextTrack: () => void;
	onPrevTrack: () => void;
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
}

const X_BOUND = 100;

export default function SpotifyPlayerCard({
	albumTrack,
	onSwipeLeft,
	onSwipeRight,
}: SpotifyPlayerCardProps) {
	const { currentTimeMs, setCurrentTimeMs, seek } = usePlayerStore();

	const [scope, animate] = useAnimate();
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-X_BOUND, X_BOUND], [-11.25, 11.25]);
	const opacity = useTransform(x, [-X_BOUND, 0, X_BOUND], [0, 1, 0]);

	const triggerSwipe = useCallback(
		async (direction: "L" | "R") => {
			const targetX = direction === "L" ? -X_BOUND : X_BOUND;
			await animate(
				scope.current,
				{ x: targetX, scale: 1.05 },
				{ duration: 0.3, ease: "easeInOut", bounce: 0 },
			);

			if (direction === "L") onSwipeLeft();
			else onSwipeRight();
		},
		[animate, scope.current, onSwipeLeft, onSwipeRight],
	);

	// Keyboard listener
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.repeat) return;
			if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
				// Swipe right
				triggerSwipe("R");
				console.log("Swiped right with keyboard");
			}
			if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
				// Swipe left
				triggerSwipe("L");
				console.log("Swiped left with keyboard");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [triggerSwipe]);

	return (
		<motion.div
			className="relative flex origin-bottom select-none flex-col gap-2 rounded-sm border border-black p-4 hover:cursor-grab hover:active:cursor-grabbing lg:rounded-lg dark:border-white"
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			dragMomentum={false}
			onDragEnd={() => {
				if (x.get() >= X_BOUND) onSwipeRight();
				else if (x.get() <= -X_BOUND) onSwipeLeft();
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

			<div className="flex flex-col text-left">
				<p className="line-clamp-1 font-semibold text-black dark:text-white">
					{albumTrack.track.name}
				</p>
				<p className="line-clamp-1 text-sm text-sub-text-light dark:text-sub-text-dark">
					{albumTrack.track.artists.map((artist) => artist.name).join(", ")}
				</p>
			</div>
			{/* CHANGE TO SLIDER? */}
			<ProgressBar
				currentTimeMs={currentTimeMs}
				durationMs={albumTrack.track.duration_ms}
				handleSeek={(timeMs: number) => {
					setCurrentTimeMs(timeMs);
				}}
				handleSeekConfirm={(timeMs: number) => {
					seek(timeMs);
				}}
			/>
		</motion.div>
	);
}
