import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import placeholder from "../assets/playlist_placeholder.svg";

interface PlaylistCardProps {
	playlist: SimplifiedPlaylist;
	isSelected: boolean;
	onClick: () => void;
}

export default function PlaylistCard({
	playlist,
	isSelected,
	onClick,
}: PlaylistCardProps) {
	const [loaded, setLoaded] = useState(false);
	return (
		<button
			className={`${isSelected ? "border-black dark:border-white" : "border-transparent hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex h-fit cursor-pointer select-none flex-col gap-2 rounded-sm border p-2 outline-blue outline-offset-2 transition focus-visible:outline-2 lg:rounded-lg`}
			onClick={onClick}
			type="button"
		>
			<img
				alt="Playlist artwork"
				className={`aspect-square size-full rounded-sm object-cover transition lg:rounded-lg ${loaded ? "opacity-100" : "opacity-0"}`}
				draggable={false}
				onLoad={() => {
					setLoaded(true);
				}}
				src={playlist.images ? playlist.images[0].url : placeholder}
			/>
			<div className="flex flex-col text-left">
				<span className="line-clamp-2">
					<a
						href={playlist.external_urls.spotify}
						onClick={(e) => e.stopPropagation()}
						target="_blank"
					>
						{playlist.name}
					</a>
				</span>
				<p className="sub-text text-xs">
					{playlist.public ? "Public" : "Private"} •{" "}
					{`${playlist.tracks ? playlist.tracks.total : "0"} song${playlist.tracks && playlist.tracks.total > 1 ? "s" : ""}`}
				</p>
			</div>
		</button>
	);
}
