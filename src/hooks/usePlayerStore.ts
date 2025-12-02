import type { SimplifiedAlbum, SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import {
	DEFAULT_VOLUME,
	getAlbumTracks,
	pause,
	play,
	seek,
	setPlaybackVolume,
} from "../lib/spotifyApi";

const PLAYBACK_ID_CACHE_SIZE = 32;

export type AlbumTrack = {
	album: SimplifiedAlbum;
	track: SimplifiedTrack;
};

export type SwipeDirection = "RIGHT" | "LEFT";
export type QueueDirection = "NEXT" | "PREV";

interface PlayerState {
	isLoading: boolean;
	queue: AlbumTrack[];
	deviceId: string;
	currentIndex: number;
	isPaused: boolean;
	currentTimeMs: number;
	volume: number;
	playbackIdCache: Set<string>;
	currentPlaybackId: string;
	queueDirection: QueueDirection;

	_lastTick: number;
	_timer?: number;

	getQueue: (albums: SimplifiedAlbum[]) => void;
	setDeviceId: (deviceId: string) => void;
	setPaused: (isPaused: boolean) => void;
	setCurrentTimeMs: (timeMs: number) => void;
	setVolume: (volume: number) => void;
	playTrack: () => void;
	play: () => void;
	pause: () => void;
	next: () => void;
	prev: () => void;
	seek: (timeMs: number) => void;
	setPlaybackVolume: (volume: number) => void;
	setCurrentPlaybackId: (id: string) => void;
	cachePlaybackId: (id: string) => void;
	swipe: (direction: SwipeDirection) => void;

	isFirstTrack: () => boolean;
	isLastTrack: () => boolean;
	isQueueEnd: () => boolean;
	startTimer: () => void;
	stopTimer: () => void;
}

interface SwipeControllerState {
	triggerSwipe: (direction: SwipeDirection) => void;
	onSwipe: ((direction: SwipeDirection) => void) | null;
	registerHandler: (handler: (direction: SwipeDirection) => void) => void;
}

export const usePlayerStore = create<PlayerState & SwipeControllerState>(
	(set, get) => ({
		// Player State
		isLoading: false,
		queue: [],
		deviceId: "",
		currentIndex: 0,
		isPaused: true,
		currentTimeMs: 0,
		volume: DEFAULT_VOLUME,
		queueDirection: "NEXT",
		playbackIdCache: new Set<string>(),
		currentPlaybackId: "",
		_lastTick: Date.now(),

		getQueue: async (albums: SimplifiedAlbum[]) => {
			set({ currentIndex: 0, isLoading: true });
			try {
				const res = await getAlbumTracks(albums);
				set({ queue: res, isLoading: false });
			} catch (error) {
				console.error("Error playing track", error);
				set({ isLoading: false });
			}
		},

		setDeviceId: (deviceId: string) => set({ deviceId: deviceId }),

		setPaused: (isPaused: boolean) => set({ isPaused: isPaused }),

		setCurrentTimeMs: (timeMs: number) => set({ currentTimeMs: timeMs }),

		setVolume: (volume: number) => set({ volume: volume }),

		playTrack: async () => {
			const { deviceId, queue, currentIndex, startTimer } = get();
			const track = queue[currentIndex].track;
			try {
				await play(deviceId, track.uri);
				set({ _lastTick: Date.now() });
				startTimer();
			} catch (error) {
				console.error("Error playing track", error);
			}
		},

		play: async () => {
			const { deviceId } = get();

			try {
				await play(deviceId);
				set({ _lastTick: Date.now(), isPaused: false });
			} catch (error) {
				console.error("Error playing track", error);
			}
		},

		pause: async () => {
			const { deviceId } = get();

			try {
				await pause(deviceId);
				set({ isPaused: true });
			} catch (error) {
				console.error("Error pausing track", error);
			}
		},

		next: async () => {
			// console.log("CALLING NEXT");
			const {
				queue,
				currentIndex,
				deviceId,
				currentPlaybackId,
				cachePlaybackId,
				stopTimer,
				pause,
			} = get();
			if (currentIndex >= queue.length) return;
			cachePlaybackId(currentPlaybackId);
			try {
				if (currentIndex + 1 >= queue.length) {
					pause();
					stopTimer();
				} else {
					const nextTrack = queue[currentIndex + 1].track;
					await play(deviceId, nextTrack.uri);
				}
				set({
					queueDirection: "NEXT",
					currentIndex: currentIndex + 1,
					currentTimeMs: 0,
					currentPlaybackId: "",
				});
			} catch (error) {
				console.error("Error going next track", error);
			}
		},

		prev: async () => {
			// console.log("CALLING PREV");
			const {
				queue,
				currentIndex,
				deviceId,
				currentPlaybackId,
				cachePlaybackId,
			} = get();
			if (currentIndex === 0) return;

			if (currentPlaybackId) cachePlaybackId(currentPlaybackId);

			try {
				const prevTrack = queue[currentIndex - 1].track;
				await play(deviceId, prevTrack.uri);
				set({
					queueDirection: "PREV",
					currentIndex: currentIndex - 1,
					currentTimeMs: 0,
					currentPlaybackId: "",
				});
			} catch (error) {
				console.error("Error going prev track", error);
			}
		},

		seek: async (timeMs: number) => {
			const { deviceId } = get();
			set({ currentTimeMs: timeMs });
			try {
				await seek(deviceId, timeMs);
			} catch (error) {
				console.error("Error seeking track", error);
			}
		},

		setPlaybackVolume: async (volume: number) => {
			const { deviceId } = get();
			set({ volume: volume });
			try {
				await setPlaybackVolume(volume, deviceId);
			} catch (error) {
				console.error("Error setting playback volume", error);
			}
		},

		setCurrentPlaybackId: (id: string) => set({ currentPlaybackId: id }),

		cachePlaybackId: (id: string) => {
			const { playbackIdCache } = get();
			playbackIdCache.add(id);

			if (playbackIdCache.size > PLAYBACK_ID_CACHE_SIZE) {
				const first = playbackIdCache.values().next().value;
				if (first) playbackIdCache.delete(first);
			}
		},

		swipe: async (direction: SwipeDirection) => {
			const { next } = get();
			console.log(`Swiping ${direction}`);

			// Liked
			if (direction === "RIGHT") {
			}
			// Disliked
			else {
			}
			next();
		},

		isFirstTrack: () => get().currentIndex === 0,

		isLastTrack: () => get().currentIndex === get().queue.length - 1,

		isQueueEnd: () => get().currentIndex >= get().queue.length,

		startTimer: () => {
			const { _timer } = get();

			if (_timer) return;

			const tick = () => {
				const { isPaused, currentTimeMs, _lastTick, queue, currentIndex } =
					get();
				const now = Date.now();
				const delta = now - _lastTick;
				const track = queue[currentIndex].track;

				if (!isPaused) {
					const nextTime = Math.min(currentTimeMs + delta, track.duration_ms);
					set({ currentTimeMs: nextTime, _lastTick: now });
					// if (nextTime === track.duration_ms) {
					// 	console.log("TRACK ENDED");
					// }
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

		// Swipe Controller State
		triggerSwipe: (direction: SwipeDirection) => {
			const { onSwipe, isQueueEnd } = get();
			if (isQueueEnd()) return;
			if (onSwipe) onSwipe(direction);
		},
		onSwipe: null,
		registerHandler: (handler) => set({ onSwipe: handler }),
	}),
);
