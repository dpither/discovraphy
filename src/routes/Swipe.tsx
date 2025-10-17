import TrackQueue from "../features/swipe/TrackQueue";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";
import Header from "../layouts/Header";

export default function Swipe() {
	useSpotifyPlayer();

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex h-full items-center justify-center">
				<TrackQueue />
			</div>
		</div>
	);
}
