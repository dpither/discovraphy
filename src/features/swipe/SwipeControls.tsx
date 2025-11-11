import PauseIcon from "../../assets/pause_icon.svg?react";
import PlayIcon from "../../assets/play_icon.svg?react";
import SkipNextIcon from "../../assets/skip_next_icon.svg?react";
import SkipPrevIcon from "../../assets/skip_prev_icon.svg?react";
import DislikeIcon from "../../assets/thumb_down_icon.svg?react";
import LikeIcon from "../../assets/thumb_up_icon.svg?react";
import Button from "../../components/Button";
import FlatButton from "../../components/FlatButton";
import { usePlayerStore } from "../../hooks/usePlayerStore";

export default function SwipeControls() {
	const { isPaused, play, pause, next, prev, isFirstTrack, isLastTrack } =
		usePlayerStore();
	return (
		<div className="flex w-full justify-between">
			<Button onClick={() => {}}>
				<DislikeIcon className="fill-white" />
			</Button>
			{/* Track Control */}
			<div>
				<FlatButton disabled={isFirstTrack()} onClick={prev}>
					<SkipPrevIcon className="flat-icon" />
				</FlatButton>
				{isPaused ? (
					<FlatButton onClick={play}>
						<PlayIcon className="flat-icon" />
					</FlatButton>
				) : (
					<FlatButton onClick={pause}>
						<PauseIcon className="flat-icon" />
					</FlatButton>
				)}
				<FlatButton disabled={isLastTrack()} onClick={next}>
					<SkipNextIcon className="flat-icon" />
				</FlatButton>
			</div>
			<Button onClick={() => {}}>
				<LikeIcon className="fill-white" />
			</Button>
		</div>
	);
}
