import { useState } from "react";
import VolumeHighIcon from "../../assets/volume_high_icon.svg?react";
import VolumeLowIcon from "../../assets/volume_low_icon.svg?react";
import VolumeMuteIcon from "../../assets/volume_mute_icon.svg?react";
import FlatButton from "../../components/FlatButton";
import Slider from "../../components/Slider";
import Tooltip from "../../components/Tooltip";
import {
	DEFAULT_VOLUME,
	MAX_VOLUME,
	usePlayerStore,
} from "../../hooks/usePlayerStore";

export default function VolumeSlider() {
	const { volume, setVisualVolume, setPlaybackVolume, isQueueEnd } =
		usePlayerStore();
	const [prevVolume, setPrevVolume] = useState(DEFAULT_VOLUME);

	function getVolumeIcon() {
		if (volume === 0) return <VolumeMuteIcon className="flat-icon" />;
		if (volume < 50)
			return <VolumeLowIcon className="flat-icon -translate-x-0.5" />;
		return <VolumeHighIcon className="flat-icon" />;
	}

	// Auto fetch the current volume?
	return (
		<div className="flex w-full items-center gap-2">
			<Tooltip position="TOP" text={volume !== 0 ? "Mute" : "Unmute"}>
				<FlatButton
					onClick={() => {
						if (volume !== 0) {
							setPlaybackVolume(0);
						} else {
							setPlaybackVolume(prevVolume);
						}
					}}
				>
					{getVolumeIcon()}
				</FlatButton>
			</Tooltip>
			<Slider
				maxValue={MAX_VOLUME}
				onValueChange={(value) => {
					setVisualVolume(value);
				}}
				onValueChangeFinished={(value) => {
					setPrevVolume(Math.max(value, 1));
					setPlaybackVolume(value);
				}}
				value={volume}
			/>
		</div>
	);
}
