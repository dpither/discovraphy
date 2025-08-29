import { Artist, SimplifiedAlbum, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SetupData {
  isLoading: boolean;
  artistQuery: string;
  artistResults: Artist[];
  selectedArtistId: string | null;
  albumResults: SimplifiedAlbum[];
  albumFilters: string[];
  selectedAlbumIds: string[];
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
      selectedArtistId: null,
      albumResults: [],
      albumFilters: [],
      selectedAlbumIds: [],
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