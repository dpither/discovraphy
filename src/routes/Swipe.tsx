import { useEffect, useState } from "react";
import SpotifyPlayerCard from "../components/SpotifyPlayerCard";
import Header from "../layouts/Header";
import { getAccessToken } from "../lib/spotifyApi";
import testAlbumTrack from "../lib/testAlbumTrack";

export default function Swipe() {
	const [_player, setPlayer] = useState<Spotify.Player | undefined>(undefined);

	// Spotify player maybe extract
	useEffect(() => {
		if (!window.Spotify) {
			const script = document.createElement("script");
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;
			document.body.appendChild(script);
		}
		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: "Discovraphy Web Player",
				getOAuthToken: (cb) => {
					cb(getAccessToken());
				},
				volume: 0.01,
			});
			setPlayer(player);

			player.addListener("ready", ({ device_id }) => {
				console.log("Ready with Device ID", device_id);
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
			});

			player.connect();
		};
	}, []);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex justify-center pt-10">
				<SpotifyPlayerCard
					albumTrack={testAlbumTrack}
					onSwipeLeft={() => {}}
					onSwipeRight={() => {}}
				/>
			</div>
		</div>
	);
}
