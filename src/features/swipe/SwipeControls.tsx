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
		isLastTrack,
		triggerSwipe,
	} = usePlayerStore();
	return (
		<div className="flex w-full justify-between">
			<Tooltip position="TOP" text="Dislike">
				<Button
					onClick={() => {
						triggerSwipe("LEFT");
					}}
				>
					<DislikeIcon className="fill-white" />
				</Button>
			</Tooltip>

			{/* Track Control */}
			<div>
				{!isFirstTrack() ? (
					<Tooltip position="TOP" text="Previous">
						<FlatButton disabled={isFirstTrack()} onClick={prev}>
							<SkipPrevIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				) : (
					<FlatButton disabled={isFirstTrack()} onClick={prev}>
						<SkipPrevIcon className="flat-icon" />
					</FlatButton>
				)}
				{isPaused ? (
					<Tooltip position="TOP" text="Play">
						<FlatButton onClick={play}>
							<PlayIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				) : (
					<Tooltip position="TOP" text="Pause">
						<FlatButton onClick={pause}>
							<PauseIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				)}
				{!isLastTrack() ? (
					<Tooltip position="TOP" text="Next">
						<FlatButton disabled={isLastTrack()} onClick={next}>
							<SkipNextIcon className="flat-icon" />
						</FlatButton>
					</Tooltip>
				) : (
					<FlatButton disabled={isLastTrack()} onClick={next}>
						<SkipNextIcon className="flat-icon" />
					</FlatButton>
				)}
			</div>
			<Tooltip position="TOP" text="Like">
				<Button
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
