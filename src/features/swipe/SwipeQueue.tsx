import { useEffect } from "react";
import { useNavigate } from "react-router";
import Spinner from "../../components/Spinner";
import { usePlayerStore } from "../../hooks/usePlayerStore";
import { useSetupStore } from "../../hooks/useSetupStore";
import HelpModal from "./HelpModal";
import SwipeControls from "./SwipeControls";
import TrackQueue from "./TrackQueue";
import VolumeSlider from "./VolumeSlider";

export default function SwipeQueue() {
	const navigate = useNavigate();
	const { selectedAlbumIds } = useSetupStore();
	const { isLoading, getTrackQueue, initPlayer, isQueueEnd, disconnectPlayer } =
		usePlayerStore();

	useEffect(() => {
		initPlayer();
		getTrackQueue(selectedAlbumIds);
		return () => {
			disconnectPlayer();
		};
	}, [selectedAlbumIds, getTrackQueue, initPlayer, disconnectPlayer]);
	if (isQueueEnd) {
		navigate(`/swipe/results`);
	}
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-full items-center justify-center">
				{isLoading && <Spinner />}
				{!isLoading && <TrackQueue />}
			</div>
			<div className="flex w-full justify-center pb-2.5">
				<div className="flex w-full max-w-72 flex-col gap-2 px-4">
					<SwipeControls />
					<div className="flex gap-2">
						<VolumeSlider />
						<HelpModal />
					</div>
				</div>
			</div>
		</div>
	);
}
