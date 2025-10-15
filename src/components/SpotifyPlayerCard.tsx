import { motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect } from "react";
import placeholder from "../assets/artist_placeholder.png";
import PauseIcon from "../assets/pause_icon.svg?react";
import PlayIcon from "../assets/play_icon.svg?react";
import SkipNextIcon from "../assets/skip_next_icon.svg?react";
import SkipPreviousIcon from "../assets/skip_previous_icon.svg?react";
import SpotifyLogo from "../assets/spotify_logo.svg?react";
import { type AlbumTrack, usePlayerStore } from "../hooks/usePlayerStore";
import Button from "./Button";
import FlatButton from "./FlatButton";
import ProgressBar from "./ProgressBar";

interface SpotifyPlayerCardProps {
	albumTrack: AlbumTrack;
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
}

export default function SpotifyPlayerCard({
	albumTrack,
	onSwipeLeft,
	onSwipeRight,
}: SpotifyPlayerCardProps) {
	// PROBABLY TAKES IN A TRACK?
	const {
		currentTimeMs,
		isPlaying,
		play,
		pause,
		next,
		prev,
		setCurrentTimeMs,
		seek,
	} = usePlayerStore();
	const [scope, animate] = useAnimate();
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-100, 100], [-11.25, 11.25]);
	const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

	const triggerSwipe = useCallback(
		async (direction: "L" | "R") => {
			const targetX = direction === "L" ? -110 : 110;
			await animate(scope.current, { x: targetX, scale: 0.95 }, { bounce: 0 });

			if (direction === "L") onSwipeLeft();
			else onSwipeRight();
			// TODO: REMOVE
			// await animate(scope.current, { scale: 1 }, { duration: 0 });
			// await animate(scope.current, { x: 0 }, { bounce: 0 });
		},
		[animate, scope.current, onSwipeLeft, onSwipeRight],
	);

	// Keyboard listener eventually probably move up
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
			className="flex origin-bottom select-none flex-col gap-2 rounded-sm border border-black p-4 hover:cursor-grab hover:active:cursor-grabbing lg:rounded-lg dark:border-white"
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			dragMomentum={false}
			ref={scope}
			style={{
				x,
				rotate,
				opacity,
			}}
			whileDrag={{ scale: 0.95 }}
		>
			<SpotifyLogo className="w-18 place-self-center" />
			<img
				alt="Track artwork"
				className="w-64 rounded-sm lg:rounded-lg"
				draggable={false}
				src={
					albumTrack.album.images[0]
						? albumTrack.album.images[0].url
						: placeholder
				}
			/>
			<div className="ml-1 flex flex-col text-left">
				<p className="line-clamp-1 font-semibold text-black dark:text-white">
					{albumTrack.track.name}
				</p>
				<p className="line-clamp-1 text-sm text-sub-text-light dark:text-sub-text-dark">
					{albumTrack.track.artists.map((artist) => artist.name).join(", ")}
				</p>
			</div>
			<div className="flex w-full flex-col">
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
			</div>
			<div className="flex gap-2 place-self-center">
				{/* skip previous */}
				<FlatButton
					onClick={() => {
						prev();
					}}
					onPointerDownCapture={(e) => e.stopPropagation()}
					// disabled={currentTrackIndex === 0}
				>
					<SkipPreviousIcon className="fill-sub-text-light hover:fill-black dark:fill-sub-text-dark hover:dark:fill-white" />
				</FlatButton>
				{/* play/pause */}
				{isPlaying ? (
					<Button
						onClick={() => {
							pause();
						}}
						onPointerDownCapture={(e) => e.stopPropagation()}
					>
						<PauseIcon className="fill-white dark:fill-black" />
					</Button>
				) : (
					<Button
						onClick={() => {
							play();
						}}
						onPointerDownCapture={(e) => e.stopPropagation()}
					>
						<PlayIcon className="fill-white dark:fill-black" />
					</Button>
				)}
				{/* skip next */}
				<FlatButton
					onClick={() => {
						next();
					}}
					onPointerDownCapture={(e) => e.stopPropagation()}
					// disabled={currentTrackIndex >= queue.length - 1}
				>
					<SkipNextIcon className="fill-sub-text-light hover:fill-black dark:fill-sub-text-dark hover:dark:fill-white" />
				</FlatButton>
			</div>
		</motion.div>
	);
}
