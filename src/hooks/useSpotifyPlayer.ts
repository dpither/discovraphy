import { useEffect, useRef } from "react";
import { DEFAULT_VOLUME, getAccessToken, MAX_VOLUME } from "../lib/spotifyApi";
import { usePlayerStore } from "./usePlayerStore";

export function useSpotifyPlayer() {
	const {
		setDeviceId,
		setPaused,
		setCurrentTimeMs,
		startTimer,
		stopTimer,
		playTrack,
		currentPlaybackId,
		playbackIdCache,
		setCurrentPlaybackId,
		cachePlaybackId,
		next,
	} = usePlayerStore();

	const playerRef = useRef<Spotify.Player | null>(null);
	const currentPlaybackIdRef = useRef(currentPlaybackId);
	const playbackIdCacheRef = useRef(playbackIdCache);

	useEffect(() => {
		currentPlaybackIdRef.current = currentPlaybackId;
	}, [currentPlaybackId]);

	useEffect(() => {
		playbackIdCacheRef.current = playbackIdCache;
	}, [playbackIdCache]);

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
				volume: DEFAULT_VOLUME / MAX_VOLUME,
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
				if (!state) return;
				const { paused, position, playback_id } = state;
				// Ignore updates after navigating away
				if (playbackIdCacheRef.current.has(playback_id)) return;

				// console.log(state);
				// console.log("Player state changed");
				// console.log(currentPlaybackIdRef.current, playbackIdCacheRef.current);
				setPaused(paused);
				setCurrentTimeMs(position);

				if (currentPlaybackIdRef.current === "") {
					setCurrentPlaybackId(playback_id);
				}
				// TRACK ENDED
				else if (playback_id !== currentPlaybackIdRef.current) {
					cachePlaybackId(playback_id);
					// console.log("PLAYER CALLING NEXT");
					next();
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
		setCurrentPlaybackId,
		cachePlaybackId,
		next,
	]);
}
