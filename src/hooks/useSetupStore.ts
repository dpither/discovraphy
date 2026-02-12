import type {
	Artist,
	SimplifiedAlbum,
	SimplifiedPlaylist,
} from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
	getArtistAlbums,
	getArtists,
	getOwnedPlaylists,
} from "../lib/spotifyApi";

export interface SetupData {
	artistQuery: string;
	selectedArtistId: string;
	albumFilters: string[];
	selectedAlbumIds: string[];
	numTracks: number;
	selectedDestination: string;
}

interface SetupState extends SetupData {
	setData: (data: Partial<SetupData>) => void;
	isLoading: boolean;
	getArtists: () => void;
	artistResults: Artist[];
	getAlbums: () => void;
	albumResults: SimplifiedAlbum[];
	getPlaylists: () => void;
	ownedPlaylists: SimplifiedPlaylist[];

	reset: () => void;
}

export const useSetupStore = create<SetupState>()(
	persist(
		(set, get) => ({
			// DATA
			artistQuery: "",
			selectedArtistId: "",
			albumFilters: [],
			selectedAlbumIds: [],
			numTracks: 0,
			selectedDestination: "SAVE",
			setData: (data) => set(data),

			// API RESPONSES
			isLoading: false,
			artistResults: [],
			getArtists: async () => {
				const { artistQuery } = get();
				if (artistQuery.trim() === "") return;

				set({ selectedArtistId: "", artistResults: [], isLoading: true });
				try {
					const res = await getArtists(artistQuery);
					set({ artistResults: res, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error searching for artist", error);
				}
			},
			albumResults: [],
			getAlbums: async () => {
				const { selectedArtistId } = get();
				// Error out? how are we here with no selected artist
				if (selectedArtistId === "") return;
				set({ numTracks: 0, selectedAlbumIds: [], isLoading: true });
				try {
					const res = await getArtistAlbums(selectedArtistId);
					set({ albumResults: res, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error fetch artist albums", error);
				}
			},
			ownedPlaylists: [],
			getPlaylists: async () => {
				set({ isLoading: true });
				try {
					const res = await getOwnedPlaylists();
					set({ ownedPlaylists: res, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error fetching playlists", error);
				}
			},

			reset: () => {
				set(useSetupStore.getInitialState);
			},
		}),
		{
			name: "setup-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
