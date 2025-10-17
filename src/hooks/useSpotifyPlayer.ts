import { useEffect } from "react";
import { getAccessToken } from "../lib/spotifyApi";
import { usePlayerStore } from "./usePlayerStore";

export function useSpotifyPlayer() {
	const {
		setDeviceId,
		setPaused: setPlaying,
		setCurrentTimeMs,
		startTimer,
		stopTimer,
	} = usePlayerStore();

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
				getOAuthToken: async (cb) => {
					const access_token = (await getAccessToken())?.access_token;
					if (access_token) {
						cb(access_token);
					} else {
						console.log("Access token undefined");
					}
				},
				volume: 0.01,
			});

			player.addListener("ready", ({ device_id }) => {
				console.log("Ready with device id", device_id);
				setDeviceId(device_id);
				startTimer();
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
				stopTimer();
			});

			player.addListener("player_state_changed", (state) => {
				setPlaying(state.paused);
				setCurrentTimeMs(state.position);
			});

			player.connect();
		};
	}, [setCurrentTimeMs, setDeviceId, setPlaying, startTimer, stopTimer]);
}
