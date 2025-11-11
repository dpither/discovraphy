import { useEffect, useRef } from "react";
import { getAccessToken } from "../lib/spotifyApi";
import { usePlayerStore } from "./usePlayerStore";

export function useSpotifyPlayer() {
	const {
		setDeviceId,
		setPaused,
		setCurrentTimeMs,
		startTimer,
		stopTimer,
		playTrack,
	} = usePlayerStore();

	const playerRef = useRef<Spotify.Player | null>(null);

	useEffect(() => {
		let script: HTMLScriptElement | null = null;

		if (!window.Spotify) {
			script = document.createElement("script");
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

			playerRef.current = player;

			player.addListener("ready", ({ device_id }) => {
				console.log("Ready with device id", device_id);
				setDeviceId(device_id);
				startTimer();
				playTrack();
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
				stopTimer();
			});

			player.addListener("player_state_changed", (state) => {
				// console.log("Player state changed");
				// console.log(state);
				if (state) {
					setPaused(state.paused);
					setCurrentTimeMs(state.position);
				}
			});

			player.connect();
		};
		return () => {
			playerRef.current?.disconnect();
			playerRef.current = null;
			if (script) {
				document.body.removeChild(script);
			}
		};
	}, [
		setCurrentTimeMs,
		setDeviceId,
		setPaused,
		startTimer,
		stopTimer,
		playTrack,
	]);
}
