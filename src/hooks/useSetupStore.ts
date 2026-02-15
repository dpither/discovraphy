import type {
	Artist,
	SimplifiedAlbum,
	SimplifiedPlaylist,
	UserProfile,
} from "@spotify/web-api-ts-sdk";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { sdk } from "../lib/spotifyApi";

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
	getCurrentUser: () => void;
	currentUser?: UserProfile;
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

			// API REQUESTS
			isLoading: false,
			artistResults: [],
			getArtists: async () => {
				const { artistQuery } = get();
				if (artistQuery.trim() === "") return;

				set({ selectedArtistId: "", artistResults: [], isLoading: true });
				try {
					const res = await sdk.search(artistQuery, ["artist"], undefined, 50);
					set({ artistResults: res.artists.items, isLoading: false });
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
					const res = await sdk.artists.albums(
						selectedArtistId,
						undefined,
						undefined,
						50,
					);
					const albums = res.items;
					albums.forEach((album) => {
						if (album.album_type === "single") {
							album.album_type = album.total_tracks <= 3 ? "Single" : "EP";
						} else {
							album.album_type = "Album";
						}
					});
					set({ albumResults: albums, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error fetch artist albums", error);
				}
			},
			ownedPlaylists: [],
			getPlaylists: async () => {
				set({ isLoading: true });
				try {
					const res = await sdk.currentUser.playlists.playlists(50);
					const currentUser = await sdk.currentUser.profile();
					const playlists = res.items.filter((playlist) => {
						return playlist.owner.id === currentUser.id;
					});
					console.log(playlists);
					set({ ownedPlaylists: playlists, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error fetching playlists", error);
				}
			},
			getCurrentUser: async () => {
				set({ isLoading: true });
				try {
					const res = await sdk.currentUser.profile();
					set({ currentUser: res, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error getting current user", error);
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
