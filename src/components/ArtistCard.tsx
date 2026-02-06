import type { Artist } from "@spotify/web-api-ts-sdk";
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
	return (
		<button
			className={`${isSelected ? "border-black dark:border-white" : "border-transparent hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex cursor-pointer select-none flex-col gap-2 rounded-sm border p-2 outline-blue outline-offset-2 transition focus-visible:outline-2 lg:rounded-lg`}
			onClick={onClick}
			type="button"
		>
			<div className="aspect-square w-full text-white dark:text-black">
				<img
					alt="Artist portrait"
					className="size-full rounded-full object-cover transition"
					draggable={false}
					src={artist.images[0] ? artist.images[0].url : placeholder}
				/>
			</div>
			<div className="flex flex-col text-left">
				<p className="line-clamp-2 break-all">{artist.name}</p>
				<p className="sub-text line-clamp-1 text-xs">
					Followers: {artist.followers.total.toLocaleString()}
				</p>
			</div>
		</button>
	);
}
