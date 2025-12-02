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
		play,
		pause,
		next,
		prev,
		isFirstTrack,
		isQueueEnd,
		triggerSwipe,
	} = usePlayerStore();
	return (
		<div className="flex w-full justify-between">
			{/* DISLIKE */}
			<Tooltip disabled={isQueueEnd()} position="TOP" text="Dislike">
				<Button
					disabled={isQueueEnd()}
					onClick={() => {
						triggerSwipe("LEFT");
					}}
				>
					<DislikeIcon className="fill-white" />
				</Button>
			</Tooltip>
			{/* TRACK CONTROL */}
			<div>
				{/* PREV */}
				<Tooltip disabled={isFirstTrack()} position="TOP" text="Previous">
					<FlatButton disabled={isFirstTrack()} onClick={prev}>
						<SkipPrevIcon className="flat-icon" />
					</FlatButton>
				</Tooltip>
				{/* PLAY/PAUSE */}
				{isPaused ? (
					<Tooltip disabled={isQueueEnd()} position="TOP" text="Play">
						<FlatButton disabled={isQueueEnd()} onClick={play}>
							<PlayIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				) : (
					<Tooltip disabled={isQueueEnd()} position="TOP" text="Pause">
						<FlatButton disabled={isQueueEnd()} onClick={pause}>
							<PauseIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				)}
				{/* NEXT */}
				<Tooltip disabled={isQueueEnd()} position="TOP" text="Next">
					<FlatButton disabled={isQueueEnd()} onClick={next}>
						<SkipNextIcon className="flat-icon" />
					</FlatButton>
				</Tooltip>
			</div>
			{/* LIKE */}
			<Tooltip disabled={isQueueEnd()} position="TOP" text="Like">
				<Button
					disabled={isQueueEnd()}
					onClick={() => {
						triggerSwipe("RIGHT");
					}}
				>
					<LikeIcon className="fill-white" />
				</Button>
			</Tooltip>
		</div>
	);
}
