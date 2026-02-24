import { useEffect } from "react";
import PauseIcon from "../../assets/pause_icon.svg?react";
import PlayIcon from "../../assets/play_icon.svg?react";
import SkipNextIcon from "../../assets/skip_next_icon.svg?react";
import SkipPrevIcon from "../../assets/skip_prev_icon.svg?react";
import DislikeIcon from "../../assets/thumb_down_icon.svg?react";
import LikeIcon from "../../assets/thumb_up_icon.svg?react";
import Button from "../../components/Button";
import FlatButton from "../../components/FlatButton";
import Tooltip from "../../components/Tooltip";
import { usePlayerStore } from "../../hooks/usePlayerStore";

export default function SwipeControls() {
	const {
		isPaused,
		isFirstTrack,
		isQueueEnd,
		isSwiping,
		play,
		pause,
		next,
		prev,
		playSwipe,
		setQueueDecision,
	} = usePlayerStore();

	// TODO: Improve rate limiting
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const { isSwiping, playSwipe } = usePlayerStore.getState();
			if (e.repeat || isSwiping) return;
			if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
				console.log(`SWIPING RIGHT WITH KEYBOARD: ${e.key}`);
				playSwipe("RIGHT");
			}
			if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
				console.log(`SWIPING LEFT WITH KEYBOARD: ${e.key}`);
				playSwipe("LEFT");
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="flex w-full justify-between">
			{/* DISLIKE */}
			<Tooltip disabled={isQueueEnd || isSwiping} position="TOP" text="Dislike">
				<Button
					disabled={isQueueEnd || isSwiping}
					onClick={() => {
						console.log(`SWIPING LEFT WITH BUTTON`);
						playSwipe("LEFT");
					}}
				>
					<DislikeIcon className="fill-white" />
				</Button>
			</Tooltip>
			{/* TRACK CONTROL */}
			<div>
				{/* PREV */}
				<Tooltip disabled={isFirstTrack} position="TOP" text="Previous">
					<FlatButton
						disabled={isFirstTrack}
						onClick={() => {
							setQueueDecision("PREV");
							prev();
						}}
					>
						<SkipPrevIcon className="flat-icon" />
					</FlatButton>
				</Tooltip>
				{/* PLAY/PAUSE */}
				{isPaused ? (
					<Tooltip disabled={isQueueEnd} position="TOP" text="Play">
						<FlatButton
							disabled={isQueueEnd}
							onClick={() => {
								play();
							}}
						>
							<PlayIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				) : (
					<Tooltip disabled={isQueueEnd} position="TOP" text="Pause">
						<FlatButton disabled={isQueueEnd} onClick={pause}>
							<PauseIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				)}
				{/* NEXT */}
				<Tooltip disabled={isQueueEnd} position="TOP" text="Next">
					<FlatButton
						disabled={isQueueEnd}
						onClick={() => {
							setQueueDecision("NEXT");
							next();
						}}
					>
						<SkipNextIcon className="flat-icon" />
					</FlatButton>
				</Tooltip>
			</div>
			{/* LIKE */}
			<Tooltip disabled={isQueueEnd || isSwiping} position="TOP" text="Like">
				<Button
					disabled={isQueueEnd || isSwiping}
					onClick={() => {
						console.log(`SWIPING RIGHT WITH BUTTON`);
						playSwipe("RIGHT");
					}}
				>
					<LikeIcon className="fill-white" />
				</Button>
			</Tooltip>
		</div>
	);
}
