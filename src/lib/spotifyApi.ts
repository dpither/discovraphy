import {
	type AccessToken,
	type Artist,
	DefaultResponseValidator,
	DocumentLocationRedirectionStrategy,
	InMemoryCachingStrategy,
	LocalStorageCachingStrategy,
	NoOpErrorHandler,
	Scopes,
	type SdkConfiguration,
	type SimplifiedAlbum,
	type SimplifiedPlaylist,
	SpotifyApi,
	type UserProfile,
} from "@spotify/web-api-ts-sdk";
import { isBrowser } from "motion/react";
import type { AlbumTrack, TrackStatus } from "../hooks/usePlayerStore";
import CustomResponseDeserializer from "./CustomResponseDeserializer";

export const MAX_VOLUME = 100;
export const DEFAULT_VOLUME = 5;

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// const redirectUri = import.meta.env.VITE_REDIRECT_TARGET;
const redirectUri = `${window.location.origin}/discovraphy/callback`;

const scopes = [
	...Scopes.playlist,
	...Scopes.userLibraryRead,
	...Scopes.userPlayback,
	...Scopes.userDetails,
];
const config: SdkConfiguration = {
	fetch: (req: RequestInfo | URL, init: RequestInit | undefined) =>
		fetch(req, init),
	beforeRequest: (_: string, __: RequestInit) => {},
	afterRequest: (_: string, __: RequestInit, ___: Response) => {},
	deserializer: new CustomResponseDeserializer(),
	responseValidator: new DefaultResponseValidator(),
	errorHandler: new NoOpErrorHandler(),
	redirectionStrategy: new DocumentLocationRedirectionStrategy(),
	cachingStrategy: isBrowser
		? new LocalStorageCachingStrategy()
		: new InMemoryCachingStrategy(),
};

console.log(redirectUri);

const sdk = SpotifyApi.withUserAuthorization(
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

export async function getArtists(artistQuery: string): Promise<Artist[]> {
	return (await sdk.search(artistQuery, ["artist"], undefined, 50)).artists
		.items;
}

export async function getArtistAlbums(
	artist: Artist,
): Promise<SimplifiedAlbum[]> {
	const albums = (await sdk.artists.albums(artist.id, undefined, undefined, 50))
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

export async function getOwnedPlaylists(): Promise<SimplifiedPlaylist[]> {
	if (currentUser === null) {
		await getUser();
	}
	const playlists = (await sdk.currentUser.playlists.playlists(50)).items;
	return playlists.filter((playlist) => {
		return playlist.owner.id === currentUser?.id;
	});
}

export async function getAlbumTracks(
	albums: SimplifiedAlbum[],
): Promise<AlbumTrack[]> {
	const albumTrackArrays = await Promise.all(
		albums.map(async (album) => {
			const tracks = (await sdk.albums.tracks(album.id, undefined, 50)).items;
			const track_status: TrackStatus = "DISLIKED";
			return tracks.map((track) => ({
				album: album,
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

export async function play(deviceId: string = "", trackUri: string = "") {
	if (trackUri) {
		await sdk.player.startResumePlayback(deviceId, undefined, [trackUri]);
	} else {
		await sdk.player.startResumePlayback(deviceId, undefined, undefined);
	}
}

export async function pause(deviceId: string = "") {
	await sdk.player.pausePlayback(deviceId);
}

export async function seek(device_id: string = "", timeMs: number) {
	await sdk.player.seekToPosition(timeMs, device_id);
}

export async function saveTrack(trackId: string) {
	await sdk.currentUser.tracks.saveTracks([trackId]);
}

export async function unsaveTrack(trackId: string) {
	await sdk.currentUser.tracks.removeSavedTracks([trackId]);
}

export async function addTrackToPlaylist(playlistId: string, trackUri: string) {
	await sdk.playlists.addItemsToPlaylist(playlistId, [trackUri]);
}

export async function removeTrackFromPlaylist(
	playlistId: string,
	trackUri: string,
) {
	const request = {
		tracks: [{ uri: trackUri }],
	};
	await sdk.playlists.removeItemsFromPlaylist(playlistId, request);
}

export async function setPlaybackVolume(volume: number, deviceId: string = "") {
	sdk.player.setPlaybackVolume(volume, deviceId);
}
