import {
	type AccessToken,
	DefaultResponseValidator,
	DocumentLocationRedirectionStrategy,
	InMemoryCachingStrategy,
	LocalStorageCachingStrategy,
	NoOpErrorHandler,
	Scopes,
	type SdkConfiguration,
	type SimplifiedAlbum,
	SpotifyApi,
	type UserProfile,
} from "@spotify/web-api-ts-sdk";
import { isBrowser } from "motion/react";
import type { QueueTrack, TrackStatus } from "../hooks/usePlayerStore";
import ResponseDeserializer from "./ResponseDeserializer";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// const redirectUri = import.meta.env.VITE_REDIRECT_TARGET;
const redirectUri = `${window.location.origin}/discovraphy/callback`;

const scopes = [
	...Scopes.playlist,
	...Scopes.userLibraryModify,
	...Scopes.userPlayback,
	...Scopes.userDetails,
];
const config: SdkConfiguration = {
	fetch: (req: RequestInfo | URL, init: RequestInit | undefined) =>
		fetch(req, init),
	beforeRequest: (url: string, request: RequestInit) => {
		console.log("SENDING REQUEST:", url, request);
	},
	afterRequest: (_: string, __: RequestInit, ___: Response) => {},
	deserializer: new ResponseDeserializer(),
	responseValidator: new DefaultResponseValidator(),
	errorHandler: new NoOpErrorHandler(),
	redirectionStrategy: new DocumentLocationRedirectionStrategy(),
	cachingStrategy: isBrowser
		? new LocalStorageCachingStrategy()
		: new InMemoryCachingStrategy(),
};

console.log(`Redirect URI: ${redirectUri}`);

export const sdk = SpotifyApi.withUserAuthorization(
	clientId,
	redirectUri,
	scopes,
	config,
);

let currentUser: UserProfile | null = null;

export async function initSpotifyClient() {
	await sdk.authenticate();
	currentUser = await sdk.currentUser.profile();
}

export async function getUser(): Promise<UserProfile> {
	if (currentUser === null) {
		currentUser = await sdk.currentUser.profile();
	}
	return currentUser;
}

export async function getArtistAlbums(
	artistId: string,
): Promise<SimplifiedAlbum[]> {
	const albums = (await sdk.artists.albums(artistId, undefined, undefined, 50))
		.items;
	albums.forEach((album) => {
		if (album.album_type === "single") {
			album.album_type = album.total_tracks <= 3 ? "Single" : "EP";
		} else {
			album.album_type = "Album";
		}
	});
	return albums;
}

export async function getAlbumTrackIds(
	albumIds: string[],
): Promise<QueueTrack[]> {
	const albumTrackArrays = await Promise.all(
		albumIds.map(async (id) => {
			const tracks = (await sdk.albums.tracks(id, undefined, 50)).items;
			const track_status: TrackStatus = "DISLIKED";
			return tracks.map((track) => ({
				track: track,
				status: track_status,
			}));
		}),
	);

	return albumTrackArrays.flat();
}

export async function getAccessToken(): Promise<AccessToken | null> {
	return await sdk.getAccessToken();
}

export async function startQueue(deviceId: string = "", trackUris: string[]) {
	await sdk.player.startResumePlayback(deviceId, undefined, trackUris);
}

function getUrlParams(args: any) {
	const params = new URLSearchParams();
	for (const key of Object.getOwnPropertyNames(args)) {
		if (
			args[key] ||
			args[key] === 0 ||
			(!args[key] && typeof args[key] === "boolean")
		) {
			params.append(key, args[key].toString());
		}
	}
	return [...params].length > 0 ? `?${params.toString()}` : "";
}

export function saveItemsToLibrary(uris: string) {
	const params = getUrlParams({ uris });
	const url = `me/library${params}`;
	return sdk.makeRequest("PUT", url);
}

export function removeItemsFromLibrary(uris: string) {
	const params = getUrlParams({ uris });
	const url = `me/library${params}`;
	return sdk.makeRequest("DELETE", url);
}

export function addItemsToPlaylist(playlist_id: string, uris: string[]) {
	const url = `playlists/${playlist_id}/items`;
	return sdk.makeRequest("POST", url, { uris });
}

export function removePlaylistItems(playlist_id: string, uris: string[]) {
	const url = `playlists/${playlist_id}/items`;
	const items = uris.map((uri) => {
		return { uri };
	});
	console.log(items);
	return sdk.makeRequest("DELETE", url, { items });
}

// async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
// 	// try {
// 	// 	return await fn();
// 	// } catch (err: unknown) {
// 	// 	console.log(err);
// 	// }
// }
