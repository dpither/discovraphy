import type { SimplifiedAlbum, SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import { getAlbumTracks, pause, play, seek } from "../lib/spotifyApi";

// MOVE TO CONSTANTS FILE? since need in player too?
const DEFAULT_VOLUME = 5;

export type AlbumTrack = {
	album: SimplifiedAlbum;
	track: SimplifiedTrack;
};

interface PlayerState {
	isLoading: boolean;
	queue: AlbumTrack[];
	deviceId: string;
	currentIndex: number;
	isPaused: boolean;
	currentTimeMs: number;
	volume: number;

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

	isFirstTrack: () => boolean;
	isLastTrack: () => boolean;
	startTimer: () => void;
	stopTimer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
	isLoading: false,
	queue: [],
	deviceId: "",
	currentIndex: 0,
	isPaused: true,
	currentTimeMs: 0,
	volume: DEFAULT_VOLUME,

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
		const { deviceId, queue, currentIndex } = get();
		const track = queue[currentIndex].track;

		try {
			await play(deviceId, track.uri);
			set({ _lastTick: Date.now() });
		} catch (error) {
			console.error("Error playing track", error);
		}
	},

	play: async () => {
		const { deviceId } = get();

		try {
			await play(deviceId);
			set({ _lastTick: Date.now() });
		} catch (error) {
			console.error("Error playing track", error);
		}
	},

	pause: async () => {
		const { deviceId } = get();

		try {
			await pause(deviceId);
		} catch (error) {
			console.error("Error pausing track", error);
		}
	},

	next: async () => {
		const { queue, currentIndex, playTrack } = get();
		if (currentIndex >= queue.length - 1) return;

		try {
			set({
				currentIndex: currentIndex + 1,
				currentTimeMs: 0,
			});
			playTrack();
		} catch (error) {
			console.error("Error going next track", error);
		}
	},

	prev: async () => {
		const { currentIndex, playTrack } = get();
		if (currentIndex === 0) return;

		try {
			set({
				currentIndex: currentIndex - 1,
				currentTimeMs: 0,
			});
			playTrack();
		} catch (error) {
			console.error("Error going prev track", error);
		}
	},

	seek: async (timeMs: number) => {
		const { deviceId } = get();
		try {
			await seek(deviceId, timeMs);
			// TODO: REMOVE AND LET PLAYER HANDLE IT?
			set({ currentTimeMs: timeMs });
		} catch (error) {
			console.error("Error seeking track", error);
		}
	},

	isFirstTrack: () => get().currentIndex === 0,

	isLastTrack: () => get().currentIndex >= get().queue.length - 1,

	startTimer: () => {
		const { _timer } = get();

		if (_timer) return;

		const tick = () => {
			const { isPaused, currentTimeMs, _lastTick } = get();
			const now = Date.now();
			const delta = now - _lastTick;

			// if (!isPaused && currentTrack?.track.duration_ms) {
			if (!isPaused) {
				// const nexTime = Math.min(
				// 	currentTimeMs + delta,
				// 	currentTrack.track.duration_ms,
				// );
				const nexTime = Math.min(currentTimeMs + delta, 160941);
				set({ currentTimeMs: nexTime, _lastTick: now });
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
}));
