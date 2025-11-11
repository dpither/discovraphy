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

export enum SetupStep {
	SelectArtist = "selectArtist",
	BuildQueue = "buildQueue",
	SelectDestination = "selectDestination",
}

export const stepOrder = [
	SetupStep.SelectArtist,
	SetupStep.BuildQueue,
	SetupStep.SelectDestination,
];

interface SetupData {
	artistQuery: string;
	selectedArtist: Artist | null;
	albumFilters: string[];
	selectedAlbums: SimplifiedAlbum[];
	numTracks: number;
	selectedDestination: string | null;
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

	currentStep: SetupStep;
	nextStep: () => void;
	prevStep: () => void;
	isFirstStep: () => boolean;
	isLastStep: () => boolean;

	reset: () => void;
}

export const useSetupStore = create<SetupState>()(
	persist(
		(set, get) => ({
			// DATA
			artistQuery: "",
			selectedArtist: null,
			albumFilters: [],
			selectedAlbums: [],
			numTracks: 0,
			selectedDestination: "SAVE",
			setData: (data) => set(data),

			// API RESPONSES
			isLoading: false,
			artistResults: [],
			getArtists: async () => {
				const { artistQuery } = get();
				if (artistQuery.trim() === "") return;

				set({ selectedArtist: null, artistResults: [], isLoading: true });
				try {
					const res = await getArtists(artistQuery);
					set({ artistResults: res, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error searching for artist", error);
				}
			},
			getAlbums: async () => {
				const { selectedArtist } = get();
				// Error out? how are we here with no selected artist
				if (selectedArtist === null) return;
				set({ numTracks: 0, selectedAlbums: [], isLoading: true });
				try {
					const res = await getArtistAlbums(selectedArtist);
					set({ albumResults: res, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					console.error("Error fetch artist albums", error);
				}
			},
			albumResults: [],
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
			ownedPlaylists: [],

			// FORM NAV
			currentStep: SetupStep.SelectArtist,
			nextStep: () => {
				const currentIndex = stepOrder.indexOf(get().currentStep);
				if (currentIndex < stepOrder.length - 1) {
					set({ currentStep: stepOrder[currentIndex + 1] });
				}
			},
			prevStep: () => {
				const currentIndex = stepOrder.indexOf(get().currentStep);
				if (currentIndex > 0) {
					set({ currentStep: stepOrder[currentIndex - 1] });
				}
			},
			isFirstStep: () => stepOrder.indexOf(get().currentStep) === 0,
			isLastStep: () =>
				stepOrder.indexOf(get().currentStep) >= stepOrder.length - 1,

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
