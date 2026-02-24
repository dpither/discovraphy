import type { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import placeholder from "../assets/art_placeholder.svg";

interface AlbumCardProps {
	album: SimplifiedAlbum;
	queuePosition: number;
	onClick: () => void;
}

export default function AlbumCard({
	album,
	queuePosition,
	onClick,
}: AlbumCardProps) {
	const [loaded, setLoaded] = useState(false);
	const isSelected = queuePosition >= 0;

	return (
		<button
			className={`${isSelected ? "border-black dark:border-white" : "border-transparent hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex h-fit cursor-pointer select-none flex-col gap-2 rounded-sm border p-2 outline-blue outline-offset-2 transition focus-visible:outline-2 lg:rounded-lg`}
			onClick={onClick}
			type="button"
		>
			{isSelected && (
				<div className="absolute right-3 bottom-3 z-10 inline-flex size-6 items-center justify-center rounded-full bg-blue font-bold text-white text-xs">
					{queuePosition + 1}
				</div>
			)}
			<img
				alt="Album artwork"
				className={`aspect-square size-full rounded-sm object-cover transition lg:rounded-lg ${loaded ? "opacity-100" : "opacity-0"}`}
				draggable={false}
				onLoad={() => {
					setLoaded(true);
				}}
				src={album.images[0] ? album.images[0].url : placeholder}
			/>
			<div className="flex flex-col text-left">
				<span className="line-clamp-2">
					<a
						href={album.external_urls.spotify}
						onClick={(e) => e.stopPropagation()}
						target="_blank"
					>
						{album.name}
					</a>
				</span>
				<p className="sub-text text-xs">
					{album.release_date.substring(0, 4)} • {album.album_type}
					<span className="hidden md:inline">
						{" "}
						• {`${album.total_tracks} song${album.total_tracks > 1 ? "s" : ""}`}
					</span>
				</p>
				<p className="sub-text text-xs md:hidden">{`${album.total_tracks} song${album.total_tracks > 1 ? "s" : ""}`}</p>
			</div>
		</button>
	);
}
