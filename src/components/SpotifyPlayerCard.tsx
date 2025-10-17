import {
	motion,
	useAnimate,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
} from "motion/react";
import { useCallback, useEffect, useState } from "react";
import placeholder from "../assets/artist_placeholder.png";
import PauseIcon from "../assets/pause_icon.svg?react";
import PlayIcon from "../assets/play_icon.svg?react";
import SkipNextIcon from "../assets/skip_next_icon.svg?react";
import SkipPreviousIcon from "../assets/skip_previous_icon.svg?react";
import SpotifyLogo from "../assets/spotify_logo.svg?react";
import DislikeIcon from "../assets/thumb_down_icon.svg?react";
import LikeIcon from "../assets/thumb_up_icon.svg?react";
import { type AlbumTrack, usePlayerStore } from "../hooks/usePlayerStore";
import Button from "./Button";
import FlatButton from "./FlatButton";
import ProgressBar from "./ProgressBar";

interface SpotifyPlayerCardProps {
	albumTrack: AlbumTrack;
	onNextTrack: () => void;
	onPrevTrack: () => void;
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
}

const X_BOUND = 100;
const SHOW_ICON_THRESHOLD = 5;

export default function SpotifyPlayerCard({
	albumTrack,
	onNextTrack,
	onPrevTrack,
	onSwipeLeft,
	onSwipeRight,
}: SpotifyPlayerCardProps) {
	const {
		currentTimeMs,
		isPaused,
		play,
		pause,
		setCurrentTimeMs,
		seek,
		isFirstTrack,
		isLastTrack,
	} = usePlayerStore();

	const [scope, animate] = useAnimate();
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-X_BOUND, X_BOUND], [-11.25, 11.25]);
	const opacity = useTransform(x, [-X_BOUND, 0, X_BOUND], [0, 1, 0]);
	const [showLikeIcon, setShowLikeIcon] = useState(false);
	const [showDislikeIcon, setShowDislikeIcon] = useState(false);

	useMotionValueEvent(x, "change", (latestValue) => {
		if (latestValue > SHOW_ICON_THRESHOLD) {
			setShowLikeIcon(true);
			setShowDislikeIcon(false);
		} else if (latestValue < -SHOW_ICON_THRESHOLD) {
			setShowDislikeIcon(true);
			setShowLikeIcon(false);
		} else {
			setShowDislikeIcon(false);
			setShowLikeIcon(false);
		}
	});

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
			{/* Like Icons */}
			<motion.div
				animate={{ scale: showLikeIcon ? 1 : 0 }}
				className="absolute top-4 right-4"
				initial={false}
			>
				{<LikeIcon className="size-6 fill-blue" />}
			</motion.div>
			<motion.div
				animate={{ scale: showLikeIcon ? 1 : 0 }}
				className="absolute right-4 bottom-4"
				initial={false}
			>
				{<LikeIcon className="size-6 fill-blue" />}
			</motion.div>

			{/* Dislike Icons */}
			<motion.div
				animate={{ scale: showDislikeIcon ? 1 : 0 }}
				className="absolute top-4 left-4"
				initial={false}
			>
				{<DislikeIcon className="size-6 fill-blue" />}
			</motion.div>

			<motion.div
				animate={{ scale: showDislikeIcon ? 1 : 0 }}
				className="absolute bottom-4 left-4"
				initial={false}
			>
				{<DislikeIcon className="size-6 fill-blue" />}
			</motion.div>

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
					disabled={isFirstTrack()}
					onClick={onPrevTrack}
					onPointerDownCapture={(e) => e.stopPropagation()}
				>
					<SkipPreviousIcon className="fill-sub-text-light hover:fill-black dark:fill-sub-text-dark hover:dark:fill-white" />
				</FlatButton>
				{/* play/pause */}
				{isPaused ? (
					<Button
						onClick={() => {
							play();
						}}
						onPointerDownCapture={(e) => e.stopPropagation()}
					>
						<PlayIcon className="fill-white dark:fill-black" />
					</Button>
				) : (
					<Button
						onClick={() => {
							pause();
						}}
						onPointerDownCapture={(e) => e.stopPropagation()}
					>
						<PauseIcon className="fill-white dark:fill-black" />
					</Button>
				)}
				{/* skip next */}
				<FlatButton
					disabled={isLastTrack()}
					onClick={onNextTrack}
					onPointerDownCapture={(e) => e.stopPropagation()}
				>
					<SkipNextIcon className="fill-sub-text-light hover:fill-black dark:fill-sub-text-dark hover:dark:fill-white" />
				</FlatButton>
			</div>
		</motion.div>
	);
}
