import { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
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
    return album.total_tracks + " songs";
  }

  const isSelected = queuePosition >= 0;

  return (
    <div
      className={`${isSelected ? "border-black dark:border-white" : "border-transparent"} group relative flex select-none flex-col gap-2 rounded border p-2 text-sm text-black transition hover:border-black dark:text-white hover:dark:border-white`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute bottom-3 right-3 z-10 inline-flex size-6 items-center justify-center rounded-full bg-blue text-xs font-bold text-white">
          {queuePosition + 1}
        </div>
      )}
      <img
        className="aspect-square w-full rounded-lg object-cover transition group-hover:scale-105 group-active:scale-95"
        draggable={false}
        src={album.images[0] ? album.images[0].url : placeholder}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-2">{album.name}</p>
        <p className="line-clamp-1 text-xs text-subTextLight dark:text-subTextDark">
          {album.release_date.substring(0, 4)} • {album.album_type} •{" "}
          {getNumSongs()}
        </p>
      </div>
    </div>
  );
}
