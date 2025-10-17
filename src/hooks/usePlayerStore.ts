import type { SimplifiedAlbum, SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import { pause, play, seek } from "../lib/spotifyApi";

// TODO: Volume control

export type AlbumTrack = {
	album: SimplifiedAlbum;
	track: SimplifiedTrack;
};

interface PlayerState {
	queue: AlbumTrack[];
	deviceId: string;
	currentIndex: number;
	currentTrack?: AlbumTrack;
	isPaused: boolean;
	currentTimeMs: number;

	_lastTick: number;
	_timer?: number;

	setQueue: (tracks: AlbumTrack[]) => void;
	setDeviceId: (deviceId: string) => void;
	setPaused: (playing: boolean) => void;
	setCurrentTimeMs: (timeMs: number) => void;
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
	queue: [],
	deviceId: "",
	currentIndex: 0,
	isPaused: true,
	currentTimeMs: 0,

	_lastTick: Date.now(),

	setQueue: (tracks: AlbumTrack[]) =>
		set({
			queue: tracks,
			currentIndex: 0,
			currentTrack: tracks[0],
			currentTimeMs: 0,
		}),

	setDeviceId: (deviceId: string) => set({ deviceId: deviceId }),

	setPaused: (isPaused: boolean) => set({ isPaused: isPaused }),

	setCurrentTimeMs: (timeMs: number) => set({ currentTimeMs: timeMs }),

	play: async () => {
		const { deviceId } = get();

		try {
			await play(deviceId);
			set({ _lastTick: Date.now() });
		} catch (e) {
			console.error("Error playing track", e);
		}
	},

	pause: async () => {
		const { deviceId } = get();
		try {
			await pause(deviceId);
		} catch (e) {
			console.error("Error pausing track", e);
		}
	},

	next: async () => {
		const { deviceId, queue, currentIndex } = get();
		if (currentIndex >= queue.length - 1) return;

		try {
			// await next(deviceId);
			const nextTrack = queue[currentIndex + 1];
			set({
				currentIndex: currentIndex + 1,
				currentTrack: nextTrack,
				currentTimeMs: 0,
			});
		} catch (e) {
			console.error("Error going next track", e);
		}
	},

	prev: async () => {
		const { deviceId, queue, currentIndex } = get();
		if (currentIndex === 0) return;

		try {
			// await prev(deviceId);
			const prevTrack = queue[currentIndex - 1];
			set({
				currentIndex: currentIndex - 1,
				currentTrack: prevTrack,
				currentTimeMs: 0,
			});
		} catch (e) {
			console.error("Error going prev track", e);
		}
	},

	seek: async (timeMs: number) => {
		const { deviceId } = get();
		try {
			await seek(deviceId, timeMs);
			// TODO: REMOVE AND LET PLAYER HANDLE IT?
			set({ currentTimeMs: timeMs });
		} catch (e) {
			console.error("Error seeking track", e);
		}
	},

	isFirstTrack: () => get().currentIndex === 0,

	isLastTrack: () => get().currentIndex >= get().queue.length - 1,

	startTimer: () => {
		const { _timer } = get();

		if (_timer) return;

		const tick = () => {
			const { isPaused, currentTimeMs, _lastTick, currentTrack } = get();
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
