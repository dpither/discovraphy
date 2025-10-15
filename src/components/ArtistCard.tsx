import type { Artist } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";
import SpotifyIcon from "../assets/spotify_icon.svg?react";

interface ArtistCardProps {
	artist: Artist;
	isSelected: boolean;
	onClick: () => void;
}

export default function ArtistCard({
	artist,
	isSelected,
	onClick,
}: ArtistCardProps) {
	return (
		<button
			className={`${isSelected ? "border-black dark:border-white" : "border-transparent"} ${isSelected ? "" : "hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex select-none flex-col gap-2 rounded-sm border p-2 text-black text-sm transition lg:rounded-lg dark:text-white`}
			onClick={onClick}
			type="button"
		>
			<SpotifyIcon className="w-6" />
			<img
				alt="Artist portrait"
				className="aspect-square w-full rounded-full object-cover transition"
				draggable={false}
				src={artist.images[0] ? artist.images[0].url : placeholder}
			/>
			<div className="ml-1 flex flex-col text-left">
				<p className="line-clamp-2">{artist.name}</p>
				<p className="line-clamp-1 text-sub-text-light text-xs dark:text-sub-text-dark">
					Followers: {artist.followers.total.toLocaleString()}
				</p>
			</div>
		</button>
	);
}
