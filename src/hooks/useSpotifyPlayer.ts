// import { useEffect, useRef } from "react";
// import { getAccessToken } from "../lib/spotifyApi";
// import { usePlayerStore } from "./usePlayerStore";
//
// export function useSpotifyPlayer() {
// 	const {
// 		// setDeviceId,
// 		setPaused,
// 		setVisualTimeMs: setCurrentTimeMs,
// 		stopTimer,
// 		// playCurrentTrack,
// 		// setCurrentPlaybackId,
// 		// cachePlaybackId,
// 		next,
// 	} = usePlayerStore();

// 	const playerRef = useRef<Spotify.Player | null>(null);
// 	const currentPlaybackIdRef = useRef(currentPlaybackId);
// 	const playbackIdCacheRef = useRef(playbackIdCache);

// 	useEffect(() => {
// 		currentPlaybackIdRef.current = currentPlaybackId;
// 	}, [currentPlaybackId]);

// 	useEffect(() => {
// 		playbackIdCacheRef.current = playbackIdCache;
// 	}, [playbackIdCache]);

// 	useEffect(() => {
// 		let script: HTMLScriptElement | null = null;

// 		script = document.createElement("script");
// 		script.src = "https://sdk.scdn.co/spotify-player.js";
// 		script.async = true;
// 		document.body.appendChild(script);

// 		window.onSpotifyWebPlaybackSDKReady = () => {
// 			const player = new window.Spotify.Player({
// 				name: "Discovraphy Web Player",
// 				getOAuthToken: async (cb) => {
// 					const access_token = (await getAccessToken())?.access_token;
// 					if (access_token) {
// 						cb(access_token);
// 					} else {
// 						console.log("Access token undefined");
// 					}
// 				},
// 				// volume: DEFAULT_VOLUME / MAX_VOLUME,
// 			});

// 			playerRef.current = player;
// 			var currentTrackId: string | null = null;

// 			player.addListener("ready", ({ device_id }) => {
// 				console.log("Ready with device id", device_id);
// 				// setDeviceId(device_id);
// 				// playCurrentTrack();
// 			});

// 			player.addListener("not_ready", ({ device_id }) => {
// 				console.log("Device ID has gone offline", device_id);
// 				stopTimer();
// 			});

// 			player.addListener("player_state_changed", (state) => {
// 				if (!state) return;
// 				// console.log(`PLAYER STATE CHANGED`);
// 				console.log(state);
// 				const { paused, position, playback_id } = state;
// 				// IGNORE UPDATES AFTER CACHING PLAYBACK ID
// 				if (playbackIdCacheRef.current.has(playback_id)) return;

// 				setPaused(paused);
// 				setCurrentTimeMs(position);

// 				if (currentPlaybackIdRef.current === "") {
// 					// setCurrentPlaybackId(playback_id);
// 					currentTrackId = state.track_window.current_track.id;
// 				}
// 				// TRACK ENDED
// 				else if (
// 					playback_id !== currentPlaybackIdRef.current &&
// 					state.track_window.current_track.id === currentTrackId
// 				) {
// 					console.log(`${playback_id} ${currentPlaybackIdRef.current}`);
// 					// cachePlaybackId(playback_id);
// 					next();
// 				}
// 			});

// 			player.connect();
// 		};

// 		return () => {
// 			stopTimer();
// 			// setCurrentPlaybackId("");
// 			setCurrentTimeMs(0);
// 			playerRef.current?.removeListener("ready");
// 			playerRef.current?.removeListener("not_ready");
// 			playerRef.current?.removeListener("player_state_changed");
// 			playerRef.current?.disconnect();
// 			playerRef.current = null;
// 			if (script) {
// 				document.body.removeChild(script);
// 			}
// 		};
// 	}, [setCurrentTimeMs, setPaused, stopTimer, next]);

// 	return {
// 		player: playerRef,
// 		next: () => playerRef.current?.nextTrack(),
// 		prev: () => playerRef.current?.previousTrack(),
// 		play: () => playerRef.current?.resume(),
// 		pause: () => playerRef.current?.pause(),
// 		seek: (ms: number) => playerRef.current?.seek(ms),
// 	};
// }

// TODO: REMOVE ENTIRE FILE
