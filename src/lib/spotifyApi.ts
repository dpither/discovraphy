import {
  Artist,
  DefaultResponseValidator,
  DocumentLocationRedirectionStrategy,
  InMemoryCachingStrategy,
  LocalStorageCachingStrategy,
  NoOpErrorHandler,
  Scopes,
  SdkConfiguration,
  SimplifiedAlbum,
  SimplifiedPlaylist,
  SpotifyApi,
  UserProfile,
} from "@spotify/web-api-ts-sdk";
import { AlbumTrack } from "../hooks/usePlayerStore";
import { isBrowser } from "motion/react";
import CustomResponseDeserializer from "./CustomResponseDeserializer";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_TARGET;
const scopes = [
  ...Scopes.playlist,
  ...Scopes.userLibraryRead,
  ...Scopes.userPlayback,
  ...Scopes.userDetails,
];
const config: SdkConfiguration = {
    fetch: (req: RequestInfo | URL, init: RequestInit | undefined) => fetch(req, init),
    beforeRequest: (_: string, __: RequestInit) => { },
    afterRequest: (_: string, __: RequestInit, ___: Response) => { },
    deserializer: new CustomResponseDeserializer(),
    responseValidator: new DefaultResponseValidator(),
    errorHandler: new NoOpErrorHandler(),
    redirectionStrategy: new DocumentLocationRedirectionStrategy(),
    cachingStrategy: isBrowser
        ? new LocalStorageCachingStrategy()
        : new InMemoryCachingStrategy()
};

export const sdk = SpotifyApi.withUserAuthorization(
  clientId,
  redirectUri,
  scopes,
  config
);
export let currentUser: UserProfile | null = null;

export async function initSpotifyClient() {
  currentUser = await sdk.currentUser.profile();
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
    currentUser = await sdk.currentUser.profile();
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
      console.log("BING");
      const tracks = (await sdk.albums.tracks(album.id, undefined, 50)).items;
      return tracks.map((track) => ({ album, track }));
    }),
  );

  return albumTrackArrays.flat();
}

export function getAccessToken(): string {
  const data = localStorage.getItem(
    "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token",
  );
  let accessToken = "";

  if (data) {
    const tokenObject = JSON.parse(data);
    accessToken = tokenObject.access_token;
  }

  return accessToken;
}

export async function start(deviceId: string = "", trackUris: string[]) {
  await sdk.player.startResumePlayback(deviceId, undefined, trackUris)
}

export async function play(deviceId: string = "") {
  await sdk.player.startResumePlayback(deviceId, undefined, undefined);
}

export async function pause(deviceId: string = "") {
  await sdk.player.pausePlayback(deviceId);
}

export async function next(deviceId: string = "") {
  await sdk.player.skipToNext(deviceId)
}

export async function prev(deviceId: string = "") {
  await sdk.player.skipToPrevious(deviceId)
}

export async function seek(device_id: string = "", timeMs: number) {
  await sdk.player.seekToPosition(timeMs, device_id);
}
