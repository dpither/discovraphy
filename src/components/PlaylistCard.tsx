import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
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
	function getNumSongs() {
		if (playlist.tracks === null) {
			return "No songs";
		}

		if (playlist.tracks.total === 1) {
			return "1 song";
		}
		return `${playlist.tracks.total} songs`;
	}
	return (
		<button
			className={`${isSelected ? "border-black dark:border-white" : "border-transparent hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex cursor-pointer select-none flex-col gap-2 rounded-sm border p-2 outline-blue outline-offset-2 transition focus-visible:outline-2 lg:rounded-lg`}
			onClick={onClick}
			type="button"
		>
			<div className="aspect-square w-full text-white dark:text-black">
				<img
					alt="Playlist artwork"
					className="size-full rounded-sm object-cover lg:rounded-lg"
					draggable={false}
					src={playlist.images ? playlist.images[0].url : placeholder}
				/>
			</div>
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
					{playlist.public ? "Public" : "Private"} • {getNumSongs()}
				</p>
			</div>
		</button>
	);
}
