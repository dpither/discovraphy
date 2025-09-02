import { Scopes, SpotifyApi, UserProfile } from "@spotify/web-api-ts-sdk";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_TARGET;
const scopes = [...Scopes.playlist, ...Scopes.userLibraryRead, ...Scopes.userPlayback, ...Scopes.userDetails];
export const sdk = SpotifyApi.withUserAuthorization(clientId, redirectUri, scopes)
export let currentUser: UserProfile | null = null

export async function initSpotifyClient() {
  await sdk.authenticate();
  sdk.currentUser.profile().then((res) => currentUser = res)
}

export async function getArtists(artistQuery: string) {
  return (await sdk.search(artistQuery, ["artist"])).artists.items;
}

export async function getArtistAlbums(artistId: string) {
  const albums = (await sdk.artists.albums(artistId, undefined, undefined, 50)).items;
  albums.forEach((album) => {
    if (album.album_type === "single") {
      album.album_type = album.total_tracks <= 3 ? "Single" : "EP";
    } else {
      album.album_type = "Album";
    }
  });
  return albums
}

export async function getOwnedPlaylists() {
  if (currentUser === null) {
    currentUser = await sdk.currentUser.profile()
  }
  const playlists = (await sdk.currentUser.playlists.playlists(50)).items;
  return playlists.filter((playlist) => { return playlist.owner.id === currentUser?.id })
}