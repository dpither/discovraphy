import type { Artist } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import placeholder from "../assets/artist_placeholder.svg";

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
	const [loaded, setLoaded] = useState(false);
	return (
		<button
			className={`${isSelected ? "border-black dark:border-white" : "border-transparent hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex h-fit cursor-pointer select-none flex-col gap-2 rounded-sm border p-2 outline-blue outline-offset-2 transition-colors focus-visible:outline-2 lg:rounded-lg`}
			onClick={onClick}
			type="button"
		>
			<img
				alt="Artist portrait"
				className={`aspect-square size-full rounded-sm object-cover transition lg:rounded-lg ${loaded ? "opacity-100" : "opacity-0"}`}
				draggable={false}
				onLoad={() => {
					setLoaded(true);
				}}
				src={artist.images[0] ? artist.images[0].url : placeholder}
			/>
			<div className="flex text-left">
				<span className="line-clamp-2">
					<a
						href={artist.external_urls.spotify}
						onClick={(e) => e.stopPropagation()}
						target="_blank"
					>
						{artist.name}
					</a>
				</span>
			</div>
		</button>
	);
}
