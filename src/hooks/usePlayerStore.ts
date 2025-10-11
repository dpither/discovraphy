import { SimplifiedAlbum, SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import { next, pause, play, prev, seek } from "../lib/spotifyApi";

// TODO: Volume control
// TODO: Device id

export type AlbumTrack = {
  album: SimplifiedAlbum;
  track: SimplifiedTrack;
};

interface PlayerState {
  queue: AlbumTrack[];
  deviceId: string;
  currentIndex: number;
  currentTrack?: AlbumTrack;
  isPlaying: boolean;
  currentTimeMs: number;

  setQueue: (tracks: AlbumTrack[]) => void;
  setDeviceId: (deviceId: string) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTimeMs: (timeMs: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (timeMs: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  deviceId: "",
  currentIndex: 0,
  currentTrack: undefined,
  isPlaying: true,
  currentTimeMs: 0,

  setQueue: (tracks: AlbumTrack[]) =>
    set({
      queue: tracks,
      currentIndex: 0,
      currentTrack: tracks[0],
      isPlaying: false,
      currentTimeMs: 0,
    }),

  setDeviceId: (deviceId: string) => set({ deviceId: deviceId }),

  setPlaying: (isPlaying: boolean) => set({ isPlaying: isPlaying }),

  setCurrentTimeMs: (timeMs: number) => set({ currentTimeMs: timeMs }),

  play: async () => {
    const { deviceId } = get();

    try {
      await play(deviceId);
      // TODO: REMOVE AND LET PLAYER HANDLE IT?
      set({ isPlaying: true });
    } catch (e) {
      console.error("Error playing track", e);
    }
  },

  pause: async () => {
    const { deviceId } = get();
    try {
      set({ isPlaying: false });
      await pause(deviceId);
      // TODO: REMOVE AND LET PLAYER HANDLE IT?
    } catch (e) {
      console.error("Error pausing track", e);
    }
  },

  next: async () => {
    const { deviceId, currentIndex, queue } = get();
    // if (currentIndex >= queue.length - 1) return;

    // const nextTrack = queue[currentIndex + 1];
    // set({
    //   currentIndex: currentIndex + 1,
    //   currentTrack: nextTrack,
    //   currentTimeMs: 0,
    // });

    try {
      await next(deviceId);
      // TODO: REMOVE AND LET PLAYER HANDLE IT?
      set({ isPlaying: true });
    } catch (e) {
      console.error("Error going next track", e);
    }
  },

  prev: async () => {
    const { deviceId, currentIndex, queue } = get();
    // if (currentIndex === 0) return;

    // const prevTrack = queue[currentIndex - 1];
    // set({
    //   currentIndex: currentIndex - 1,
    //   currentTrack: prevTrack,
    //   currentTimeMs: 0,
    // });

    try {
      await prev(deviceId);
      // TODO: REMOVE AND LET PLAYER HANDLE IT?
      set({ isPlaying: true });
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
}));
