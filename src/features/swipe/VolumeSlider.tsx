import { useState } from "react";
import VolumeHighIcon from "../../assets/volume_high_icon.svg?react";
import VolumeLowIcon from "../../assets/volume_low_icon.svg?react";
import VolumeMuteIcon from "../../assets/volume_mute_icon.svg?react";
import Slider from "../../components/Slider";
import { usePlayerStore } from "../../hooks/usePlayerStore";
import { setPlaybackVolume } from "../../lib/spotifyApi";

const MAX_VOLUME = 100;

export default function VolumeSlider() {
	const { deviceId, volume, setVolume } = usePlayerStore();

	function getVolumeIcon() {
		if (volume === 0)
			return (
				<VolumeMuteIcon className="-translate-x-0.5 fill-sub-text-light dark:fill-sub-text-dark" />
			);
		if (volume < 50)
			return (
				<VolumeLowIcon className="fill-sub-text-light dark:fill-sub-text-dark" />
			);
		return (
			<VolumeHighIcon className="translate-x-0.5 fill-sub-text-light dark:fill-sub-text-dark" />
		);
	}

	// Auto fetch the current volume?
	return (
		<div className="flex w-full items-center gap-2">
			<div className="justify-start">{getVolumeIcon()}</div>
			<Slider
				maxValue={MAX_VOLUME}
				onValueChange={(value) => {
					setVolume(value);
				}}
				onValueChangeFinished={(value) => {
					console.log(value);
					setPlaybackVolume(value, deviceId);
				}}
				value={volume}
			/>
		</div>
	);
}
