import type { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";

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
	function getNumSongs() {
		if (album.total_tracks === 1) {
			return "1 song";
		}
		return `${album.total_tracks} songs`;
	}

	const isSelected = queuePosition >= 0;

	return (
		<button
			className={`${isSelected ? "border-black dark:border-white" : "border-transparent hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex cursor-pointer select-none flex-col gap-2 rounded-sm border p-2 outline-blue outline-offset-2 transition focus-visible:outline-2 lg:rounded-lg`}
			onClick={onClick}
			type="button"
		>
			{isSelected && (
				<div className="absolute right-3 bottom-3 z-10 inline-flex size-6 items-center justify-center rounded-full bg-blue font-bold text-white text-xs">
					{queuePosition + 1}
				</div>
			)}
			<div className="aspect-square w-full text-white dark:text-black">
				<img
					alt="Album artwork"
					className="size-full rounded-sm object-cover lg:rounded-lg"
					draggable={false}
					src={album.images[0] ? album.images[0].url : placeholder}
				/>
			</div>
			<div className="flex flex-col text-left">
				<p className="line-clamp-2">{album.name}</p>
				<p className="sub-text text-xs">
					{album.release_date.substring(0, 4)} • {album.album_type}
					<span className="hidden md:inline"> • {getNumSongs()}</span>
				</p>
				<p className="sub-text text-xs md:hidden">{getNumSongs()}</p>
			</div>
		</button>
	);
}
