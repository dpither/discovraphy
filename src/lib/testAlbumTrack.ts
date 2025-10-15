import type { SimplifiedAlbum, SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import type { AlbumTrack } from "../hooks/usePlayerStore";

const testAlbum: SimplifiedAlbum = {
	album_type: "Album",
	total_tracks: 19,
	available_markets: [],
	external_urls: {
		spotify: "https://open.spotify.com/album/5hky8BIrwn5ACkRPfXQqh0",
	},
	href: "https://api.spotify.com/v1/albums/5hky8BIrwn5ACkRPfXQqh0",
	id: "5hky8BIrwn5ACkRPfXQqh0",
	images: [
		{
			url: "https://i.scdn.co/image/ab67616d0000b273abda08e13c584672bf85d11f",
			height: 640,
			width: 640,
		},
		{
			url: "https://i.scdn.co/image/ab67616d00001e02abda08e13c584672bf85d11f",
			height: 300,
			width: 300,
		},
		{
			url: "https://i.scdn.co/image/ab67616d00004851abda08e13c584672bf85d11f",
			height: 64,
			width: 64,
		},
	],
	name: "In Return (10 Year Anniversary Edition)",
	release_date: "2024-09-09",
	release_date_precision: "day",
	type: "album",
	uri: "spotify:album:5hky8BIrwn5ACkRPfXQqh0",
	artists: [
		{
			external_urls: {
				spotify: "https://open.spotify.com/artist/21mKp7DqtSNHhCAU2ugvUw",
			},
			href: "https://api.spotify.com/v1/artists/21mKp7DqtSNHhCAU2ugvUw",
			id: "21mKp7DqtSNHhCAU2ugvUw",
			name: "ODESZA",
			type: "artist",
			uri: "spotify:artist:21mKp7DqtSNHhCAU2ugvUw",
		},
	],
	album_group: "album",
	copyrights: [],
	external_ids: {
		upc: "",
		isrc: "",
		ean: "",
	},
	genres: [],
	label: "",
	popularity: 0,
};
const testTrack: SimplifiedTrack = {
	artists: [
		{
			external_urls: {
				spotify: "https://open.spotify.com/artist/21mKp7DqtSNHhCAU2ugvUw",
			},
			href: "https://api.spotify.com/v1/artists/21mKp7DqtSNHhCAU2ugvUw",
			id: "21mKp7DqtSNHhCAU2ugvUw",
			name: "ODESZA",
			type: "artist",
			uri: "spotify:artist:21mKp7DqtSNHhCAU2ugvUw",
		},
		{
			external_urls: {
				spotify: "https://open.spotify.com/artist/21mKp7DqtSNHhCAU2ugvUw",
			},
			href: "https://api.spotify.com/v1/artists/21mKp7DqtSNHhCAU2ugvUw",
			id: "21mKp7DqtSNHhCAU2ugvUw",
			name: "ODESZA Again",
			type: "artist",
			uri: "spotify:artist:21mKp7DqtSNHhCAU2ugvUw",
		},
	],
	available_markets: ["CA"],
	disc_number: 1,
	duration_ms: 160941,
	explicit: false,
	external_urls: {
		spotify: "https://open.spotify.com/track/11sDI4phRPmdPFgPHFAB29",
	},
	href: "https://api.spotify.com/v1/tracks/11sDI4phRPmdPFgPHFAB29",
	id: "11sDI4phRPmdPFgPHFAB29",
	name: "Always This Late",
	preview_url: null,
	track_number: 1,
	type: "track",
	uri: "spotify:track:11sDI4phRPmdPFgPHFAB29",
	is_local: false,
	episode: false,
	track: false,
};

const testAlbumTrack: AlbumTrack = {
	album: testAlbum,
	track: testTrack,
};

export default testAlbumTrack;
