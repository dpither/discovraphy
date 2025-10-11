import { Artist, SimplifiedAlbum, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SetupData {
  isLoading: boolean;
  artistQuery: string;
  artistResults: Artist[];
  selectedArtist: Artist | null;
  albumResults: SimplifiedAlbum[];
  albumFilters: string[];
  selectedAlbums: SimplifiedAlbum[];
  numTracks: number;
  ownedPlaylists: SimplifiedPlaylist[];
  destination: string | null;
};

interface SetupState extends SetupData {
  setData: (data: Partial<SetupData>) => void;
}

export const useSetupStore = create<SetupState>()(
  persist(
    (set) => ({
      isLoading: false,
      artistQuery: "",
      artistResults: [],
      selectedArtist: null,
      albumResults: [],
      albumFilters: [],
      selectedAlbums: [],
      numTracks: 0,
      ownedPlaylists: [],
      destination: "SAVE",
      setData: (data) => set(data),
    }),
    {
      name: "setup-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);