import { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";

interface AlbumCardProps {
  album: SimplifiedAlbum;
  isSelected: boolean;
  onClick: () => void;
}

export default function AlbumCard({
  album,
  isSelected,
  onClick,
}: AlbumCardProps) {
  return (
    <div
      className={`${isSelected ? "border-black dark:border-white" : "border-transparent"} group flex select-none flex-col gap-2 rounded border p-2 text-sm text-black transition hover:border-black dark:text-white hover:dark:border-white`}
      onClick={onClick}
    >
      <img
        className="aspect-square w-full rounded-lg object-cover transition group-hover:scale-105 group-active:scale-95"
        draggable={false}
        src={album.images[0] ? album.images[0].url : placeholder}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-1">{album.name}</p>
        <p className="line-clamp-1 text-xs capitalize text-subTextLight dark:text-subTextDark">
          {album.release_date.substring(0, 4)} • {album.album_type}
        </p>
      </div>
    </div>
  );
}
