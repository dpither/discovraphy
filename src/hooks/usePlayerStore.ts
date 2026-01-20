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
	status: TrackStatus;
};

export type SwipeDirection = "RIGHT" | "LEFT";
export type QueueDirection = "NEXT" | "PREV";
export type TrackStatus = "DISLIKED" | "LIKED";

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
	playCurrentTrack: () => void;
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
	// REMOVE?
	isLastTrack: () => boolean;
	isQueueEnd: () => boolean;
	startTimer: () => void;
	stopTimer: () => void;

	pendingPlay: number;
	playInflight: boolean;
	enqueuePlay: (index: number) => void;
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

		playCurrentTrack: () => {
			const { enqueuePlay, currentIndex } = get();
			enqueuePlay(currentIndex);
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

		next: () => {
			const {
				queue,
				currentIndex,
				currentPlaybackId,
				cachePlaybackId,
				stopTimer,
				playCurrentTrack,
				pause,
			} = get();
			console.log(`CALLING NEXT FROM: ${queue[currentIndex].track.name}`);
			if (currentIndex >= queue.length) return;
			cachePlaybackId(currentPlaybackId);

			set({
				queueDirection: "NEXT",
				currentIndex: currentIndex + 1,
				currentTimeMs: 0,
				currentPlaybackId: "",
				isPaused: true,
			});

			stopTimer();
			if (currentIndex + 1 < queue.length) {
				playCurrentTrack();
			} else {
				pause();
			}
		},

		prev: () => {
			const {
				queue,
				currentIndex,
				currentPlaybackId,
				cachePlaybackId,
				playCurrentTrack,
			} = get();
			console.log(`CALLING PREV FROM ${queue[currentIndex].track.name}`);
			if (currentIndex === 0) return;
			if (currentPlaybackId) cachePlaybackId(currentPlaybackId);

			set({
				queueDirection: "PREV",
				currentIndex: currentIndex - 1,
				currentTimeMs: 0,
				currentPlaybackId: "",
				isPaused: true,
			});

			playCurrentTrack();
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

		swipe: (direction: SwipeDirection) => {
			const { next, currentIndex, queue } = get();

			const currentAlbumTrack = queue[currentIndex];
			// Liked
			if (direction === "RIGHT") {
				console.log(`SWIPED RIGHT ON: ${currentAlbumTrack.track.name}`);
				if (currentAlbumTrack.status !== "LIKED") {
					console.log(`ATTEMPTING TO LIKE ${currentAlbumTrack.track.name}`);
					// TODO: Implement liking
					queue[currentIndex].status = "LIKED";
				}
			}
			// Disliked
			else {
				console.log(`SWIPED LEFT ON: ${currentAlbumTrack.track.name}`);
				if (currentAlbumTrack.status !== "DISLIKED") {
					console.log(`ATTEMPTING TO DISLIKE ${currentAlbumTrack.track.name}`);
					// TODO: Implement dislike
					queue[currentIndex].status = "DISLIKED";
				}
			}
			console.log(queue);
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

		// Request Queue
		playInflight: false,
		pendingPlay: -1,
		enqueuePlay: (index: number) => {
			set({ pendingPlay: index });

			const process = async () => {
				if (get().playInflight) return;
				set({ playInflight: true });

				while (get().pendingPlay !== -1) {
					const { pendingPlay, queue, deviceId, startTimer } = get();
					const track = queue[pendingPlay].track;
					set({ pendingPlay: -1 });
					try {
						console.log(`SENDING PLAY REQUEST: ${track.name}`);
						await play(deviceId, track.uri);
						console.log(`BACK FROM REQUEST: ${track.name}`);
						set({ _lastTick: Date.now() });
						startTimer();
					} catch (error) {
						console.error("Error playing track", error);
					}
				}
				set({ playInflight: false });
			};
			process();
		},
	}),
);
