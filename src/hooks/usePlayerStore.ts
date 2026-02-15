import type { SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import {
	addItemsToPlaylist,
	getAccessToken,
	removeItemsFromLibrary,
	removePlaylistItems,
	saveItemsToLibrary,
	sdk,
	startQueue,
} from "../lib/spotifyApi";

export const MAX_VOLUME = 100;
export const DEFAULT_VOLUME = 20;

export type QueueTrack = {
	track: SimplifiedTrack;
	status: TrackStatus;
};

export type SwipeDirection = "RIGHT" | "LEFT";
export type QueueDirection = "NEXT" | "PREV";
export type TrackStatus = "LIKED" | "DISLIKED" | "UNDECIDED";

interface PlayerState {
	isLoading: boolean;
	queue: QueueTrack[];
	currentIndex: number;
	deviceId: string;
	queueDirection: QueueDirection;
	isQueueEnd: boolean;

	getTrackQueue: (albumIds: string[]) => void;
	setPaused: (isPaused: boolean) => void;
	setVisualTimeMs: (timeMs: number) => void;
	setVisualVolume: (volume: number) => void;

	// SPOTIFY PLAYER
	player?: Spotify.Player;
	isPaused: boolean;
	currentTimeMs: number;
	currentTrack?: Spotify.Track;
	isFirstTrack: boolean;
	isLastTrack: boolean;
	volume: number;
	initPlayer: () => void;
	playbackId: string;
	play: () => Promise<void>;
	pause: () => Promise<void>;
	next: () => Promise<void>;
	prev: () => Promise<void>;
	seek: (timeMs: number) => Promise<void>;
	setPlaybackVolume: (volume: number) => Promise<void>;

	//TIMER
	_lastTick: number;
	_timer?: number;
	startTimer: () => void;
	stopTimer: () => void;

	// SWIPING
	isSwiping: boolean;
	startSwipe: () => void;
	endSwipe: () => void;
	playSwipe: (direction: SwipeDirection) => void;
	onPlaySwipe: ((direction: SwipeDirection) => void) | null;
	registerPlaySwipeHandler: (
		handler: (direction: SwipeDirection) => void,
	) => void;
	swipe: (direction: SwipeDirection, destination: string) => void;

	disconnectPlayer: () => void;
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
			const res = await Promise.all(
				albumIds.map(async (id) => {
					const tracks = (await sdk.albums.tracks(id, undefined, 50)).items;
					const status: TrackStatus = "UNDECIDED";
					return tracks.map((track) => ({ track, status }));
				}),
			);

			set({ queue: res.flat(), isLoading: false });
		} catch (error) {
			console.error("Getting queue", error);
			set({ isLoading: false });
		}
	},

	setDeviceId: (deviceId: string) => set({ deviceId: deviceId }),

	setPaused: (isPaused: boolean) => set({ isPaused: isPaused }),

	setVisualTimeMs: (timeMs: number) => set({ currentTimeMs: timeMs }),

	setVisualVolume: (volume: number) => set({ volume: volume }),

	// SPOTIFY PLAYER
	// Just save entire state?
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
				player.getVolume().then((volume) => {
					set({ volume: volume * 100 });
				});
				if (get().queue.length <= 0) return;
				get().startTimer();
				startQueue(
					device_id,
					get().queue.map((albumTrack) => albumTrack.track.uri),
				);
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
				const { playback_id, paused, position, track_window } = state;
				const { currentIndex, queue, playbackId } = get();
				const queueIndex = queue.findIndex(
					(item) => item.track.id === track_window.current_track.id,
				);
				// Reached end of queue
				if (
					currentIndex === queue.length - 1 &&
					queueIndex === 0 &&
					playbackId !== "" &&
					playback_id !== playbackId
				) {
					set({ isQueueEnd: true });
				}
				set({
					isPaused: paused,
					playbackId: playback_id,
					currentTimeMs: position,
					currentTrack: track_window.current_track,
					currentIndex: queueIndex,
					isFirstTrack: track_window.previous_tracks.length === 0,
					isLastTrack: track_window.next_tracks.length === 0,
				});
				console.log(
					`${state.playback_id} ${state.track_window.current_track.name} ${state.track_window.current_track.id} ${queueIndex}`,
				);
			});

			player.connect();
			set({ player: player });
		};
	},
	playbackId: "",
	play: async () => {
		const { currentTrack, currentTimeMs } = get();
		if (currentTimeMs === currentTrack?.duration_ms) {
			await get().next();
		} else {
			await get().player?.resume();
		}
	},

	pause: async () => {
		await get().player?.pause();
	},

	next: async () => {
		set({ queueDirection: "NEXT" });
		await get().player?.nextTrack();
	},

	prev: async () => {
		set({ queueDirection: "PREV" });
		await get().player?.previousTrack();
	},

	seek: async (timeMs: number) => {
		await get().player?.seek(timeMs);
	},

	setPlaybackVolume: async (volume: number) => {
		set({ volume: volume });
		await get().player?.setVolume(volume / 100);
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
		const timer = setInterval(tick, 250);
		set({ _timer: timer, _lastTick: Date.now() });
	},

	stopTimer: () => {
		const { _timer } = get();
		if (_timer) clearInterval(_timer);
		set({ _timer: undefined });
	},

	// SWIPING
	isSwiping: false,
	startSwipe: () => set({ isSwiping: true }),
	endSwipe: () => set({ isSwiping: false }),
	playSwipe: (direction: SwipeDirection) => {
		const { onPlaySwipe, isQueueEnd, isSwiping } = get();
		if (isQueueEnd || isSwiping) return;
		if (onPlaySwipe) onPlaySwipe(direction);
	},
	onPlaySwipe: null,
	registerPlaySwipeHandler: (handler) => set({ onPlaySwipe: handler }),
	swipe: async (direction: SwipeDirection, destination: string) => {
		set({ isSwiping: true });
		const { next, currentIndex, queue } = get();
		if (currentIndex < -1) {
			console.log(`CURRENT INDEX -1`);
			return;
		}
		const target = queue[currentIndex];
		// Liked
		try {
			if (direction === "RIGHT") {
				console.log(`SWIPED RIGHT ON: ${target.track.name}`);
				if (target.status !== "LIKED") {
					console.log(`ADDING ${target.track.name} TO ${destination}`);
					// TODO: Implement liking, set only after success
					set({
						queue: queue.map((item, i) =>
							i === currentIndex ? { ...item, status: "LIKED" } : item,
						),
					});
					if (destination === "SAVE") {
						saveItemsToLibrary(target.track.uri);
					} else {
						// TODO: CHECK IF ALREADY IN PLAYLIST REGARDLESS OF PREVIOUS SESSION INTERACTIONS
						addItemsToPlaylist(destination, [target.track.uri]);
					}
				}
			}
			// Disliked
			else {
				console.log(`SWIPED LEFT ON: ${target.track.name}`);
				console.log(`REMOVING ${target.track.name} FROM ${destination}`);
				// TODO: Implement dislike, set only after success?
				set({
					queue: queue.map((item, i) =>
						i === currentIndex ? { ...item, status: "DISLIKED" } : item,
					),
				});
				if (destination === "SAVE") {
					removeItemsFromLibrary(target.track.uri);
				} else {
					removePlaylistItems(destination, [target.track.uri]);
				}
			}
		} catch (err: unknown) {
			// TODO: HANDLE ERRORS AND RETRY ON RATE LIMITED
			console.error(err);
		}
		console.log(get().queue);
		await next();
		set({ isSwiping: false });
	},

	disconnectPlayer: () => {
		const { player, stopTimer } = get();
		stopTimer();
		player?.removeListener("ready");
		player?.removeListener("not_ready");
		player?.removeListener("player_state_changed");
		player?.disconnect();
		if (script) {
			document.body.removeChild(script);
			const iframes = document.getElementsByTagName("iframe");
			for (var iframe of iframes) {
				if (
					iframe.attributes.getNamedItem("alt")?.nodeValue ===
					"Audio Playback Container"
				)
					document.body.removeChild(iframe);
			}
		}
		set({
			isLoading: false,
			currentIndex: -1,
			deviceId: undefined,
			isQueueEnd: false,
			player: undefined,
			isPaused: false,
			currentTimeMs: 0,
			currentTrack: undefined,
			playbackId: "",
			_lastTick: Date.now(),
			_timer: undefined,
			isSwiping: false,
		});
	},
}));
