import { useEffect } from "react";
import Spinner from "../components/Spinner";
import HelpModal from "../features/swipe/HelpModal";
import SwipeControls from "../features/swipe/SwipeControls";
import TrackQueue from "../features/swipe/TrackQueue";
import VolumeSlider from "../features/swipe/VolumeSlider";
import { usePlayerStore } from "../hooks/usePlayerStore";
import { useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";

export default function Swipe() {
	const { selectedAlbumIds } = useSetupStore();
	const { isLoading, getTrackQueue, initPlayer, isQueueEnd } = usePlayerStore();

	useEffect(() => {
		initPlayer();
		getTrackQueue(selectedAlbumIds);
		return () => {
			usePlayerStore.getState().reset();
		};
	}, [selectedAlbumIds, getTrackQueue, initPlayer]);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex h-full items-center justify-center">
				{isLoading && <Spinner />}
				{!isLoading && (
					<div className="flex flex-col gap-4">
						<TrackQueue />
					</div>
				)}
			</div>
			{!isQueueEnd && (
				<div className="flex w-full justify-center pb-2.5">
					<div className="flex w-full max-w-72 flex-col gap-2 px-4">
						{<SwipeControls />}
						<div className="flex gap-2">
							<VolumeSlider />
							<HelpModal />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
