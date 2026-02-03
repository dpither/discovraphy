import type { SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import {
	getAccessToken,
	getAlbumTrackIds,
	startQueue,
} from "../lib/spotifyApi";

export const MAX_VOLUME = 100;
export const DEFAULT_VOLUME = 5;

export type QueueTrack = {
	track: SimplifiedTrack;
	status: TrackStatus;
};

export type SwipeDirection = "RIGHT" | "LEFT";
export type QueueDirection = "NEXT" | "PREV";
export type TrackStatus = "DISLIKED" | "LIKED";

interface PlayerState {
	isLoading: boolean;
	queue: QueueTrack[];
	currentIndex: number;
	deviceId: string;
	queueDirection: QueueDirection;
	isQueueEnd: boolean; //HOW TO FIGURE OUT? CAN USE COMB OF CHECKING CURRENT INDEX ON INDEX CHANGE (WHEN WE WRAP)

	getTrackQueue: (albumIds: string[]) => void;
	setPaused: (isPaused: boolean) => void;
	setVisualTimeMs: (timeMs: number) => void;
	setVisualVolume: (volume: number) => void;
	swipe: (direction: SwipeDirection) => void;

	// SPOTIFY PLAYER
	player?: Spotify.Player;
	isPaused: boolean;
	currentTimeMs: number;
	currentTrack?: Spotify.Track;
	isFirstTrack: boolean;
	isLastTrack: boolean;
	volume: number;
	initPlayer: () => void;
	play: () => void;
	pause: () => void;
	next: () => void;
	prev: () => void;
	seek: (timeMs: number) => void;
	setPlaybackVolume: (volume: number) => void;

	//TIMER
	_lastTick: number;
	_timer?: number;
	startTimer: () => void;
	stopTimer: () => void;

	// SWIPING
	triggerSwipe: (direction: SwipeDirection) => void;
	onSwipe: ((direction: SwipeDirection) => void) | null;
	registerHandler: (handler: (direction: SwipeDirection) => void) => void;

	reset: () => void;
}

let script: HTMLScriptElement | null = null;

export const usePlayerStore = create<PlayerState>((set, get) => ({
	// Player State
	isLoading: false,
	queue: [],
	deviceId: "",
	currentIndex: -1,
	queueDirection: "NEXT",
	playbackIdCache: new Set<string>(), //REMOVE?
	currentPlaybackId: "",
	isQueueEnd: false,

	getTrackQueue: async (albumIds: string[]) => {
		set({ isLoading: true });
		try {
			const res = await getAlbumTrackIds(albumIds);
			set({ queue: res, isLoading: false });
		} catch (error) {
			console.error("Getting queue", error);
			set({ isLoading: false });
		}
	},

	setDeviceId: (deviceId: string) => set({ deviceId: deviceId }),

	setPaused: (isPaused: boolean) => set({ isPaused: isPaused }),

	setVisualTimeMs: (timeMs: number) => set({ currentTimeMs: timeMs }),

	setVisualVolume: (volume: number) => set({ volume: volume }),

	swipe: (direction: SwipeDirection) => {
		const { next, currentIndex, queue } = get();
		if (currentIndex < -1) {
			console.log(`CURRENT INDEX -1`);
			return;
		}
		const target = queue[currentIndex];
		// Liked
		if (direction === "RIGHT") {
			console.log(`SWIPED RIGHT ON: ${target.track.name}`);
			if (target.status !== "LIKED") {
				console.log(`ATTEMPTING TO LIKE: ${target.track.name}`);
				// TODO: Implement liking
				set({
					queue: queue.map((item, i) =>
						i === currentIndex ? { ...item, status: "LIKED" } : item,
					),
				});
			}
		}
		// Disliked
		else {
			console.log(`SWIPED LEFT ON: ${target.track.name}`);
			if (target.status !== "DISLIKED") {
				console.log(`ATTEMPTING TO DISLIKE: ${target.track.name}`);
				// TODO: Implement dislike
				set({
					queue: queue.map((item, i) =>
						i === currentIndex ? { ...item, status: "DISLIKED" } : item,
					),
				});
			}
		}
		console.log(get().queue);
		next();
	},

	// SPOTIFY PLAYER
	player: undefined,
	currentTrack: undefined,
	isFirstTrack: true,
	isLastTrack: false,
	currentTimeMs: 0,
	volume: DEFAULT_VOLUME,
	isPaused: true,
	initPlayer: () => {
		if (get().player) return;
		script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;
		document.body.appendChild(script);

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

			player.addListener("ready", ({ device_id }) => {
				console.log("Ready with device id", device_id);
				set({ deviceId: device_id });
				get().startTimer();
				startQueue(
					device_id,
					get().queue.map((albumTrack) => albumTrack.track.uri),
				);
				player.getVolume().then((volume) => {
					set({ volume: volume * 100 });
				});
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
				set({ player: undefined });
				get().stopTimer();
			});

			player.on("playback_error", ({ message }) => {
				console.error("Failed to perform playback", message);
			});

			player.addListener("autoplay_failed", () => {
				console.log("Autoplay is not allowed by the browser autoplay rules");
			});

			player.addListener("player_state_changed", (state) => {
				if (!state) return;
				const { paused, position, track_window } = state;
				const queueIndex = get().queue.findIndex(
					(item) => item.track.id === track_window.current_track.id,
				);
				set({
					isPaused: paused,
					currentTimeMs: position,
					currentTrack: track_window.current_track,
					currentIndex: queueIndex,
					isFirstTrack: track_window.previous_tracks.length === 0,
					isLastTrack: track_window.next_tracks.length === 0,
				});
				console.log(state.playback_id, state);
				// if (get().isLastTrack) console.log(state);

				if (paused === true && position === 0) {
					// set({ isQueueEnd: true });
					console.log("END??");
				}
			});

			player.connect();
			set({ player: player });
		};
	},

	play: () => {
		const { currentTrack, currentTimeMs } = get();
		if (currentTimeMs === currentTrack?.duration_ms) {
			get().next();
		} else {
			get().player?.resume();
		}
	},

	pause: () => {
		get().player?.pause();
	},

	next: () => {
		set({ queueDirection: "NEXT" });
		get().player?.nextTrack();
	},

	prev: () => {
		set({ queueDirection: "PREV" });
		get().player?.previousTrack();
	},

	seek: (timeMs: number) => {
		get().player?.seek(timeMs);
	},

	setPlaybackVolume: async (volume: number) => {
		set({ volume: volume });
		get().player?.setVolume(volume / 100);
	},

	// TIMER
	_lastTick: Date.now(),
	startTimer: () => {
		const { _timer } = get();

		if (_timer) return;

		const tick = () => {
			const { isPaused, currentTimeMs, _lastTick, currentTrack } = get();
			const now = Date.now();
			const delta = now - _lastTick;
			if (!isPaused) {
				const nextTime = Math.min(
					currentTimeMs + delta,
					currentTrack ? currentTrack.duration_ms : 0,
				);
				set({ currentTimeMs: nextTime, _lastTick: now });
			} else {
				set({ _lastTick: now });
			}
		};
		// Update every 250ms
		const timer = window.setInterval(tick, 250);
		set({ _timer: timer, _lastTick: Date.now() });
	},

	stopTimer: () => {
		const { _timer } = get();
		if (_timer) clearInterval(_timer);
		set({ _timer: undefined });
	},

	// SWIPING
	triggerSwipe: (direction: SwipeDirection) => {
		const { onSwipe, isQueueEnd } = get();
		if (isQueueEnd) return;
		if (onSwipe) onSwipe(direction);
	},
	onSwipe: null,
	registerHandler: (handler) => set({ onSwipe: handler }),

	reset: () => {
		const { player, stopTimer } = get();
		stopTimer();
		player?.removeListener("ready");
		player?.removeListener("not_ready");
		player?.removeListener("player_state_changed");
		player?.disconnect();
		set(usePlayerStore.getInitialState());
	},
}));
