import { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";
import SpotifyIcon from "../assets/spotify_icon.svg?react";

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
      className={`${isSelected ? "border-black dark:border-white" : "border-transparent"} group relative flex flex-col gap-2 rounded-sm border p-2 text-sm text-black transition select-none hover:border-black lg:rounded-lg dark:text-white dark:hover:border-white`}
      onClick={onClick}
    >
      <SpotifyIcon className="w-6" />

      {isSelected && (
        <div className="bg-blue absolute right-3 bottom-3 z-10 inline-flex size-6 items-center justify-center rounded-full text-xs font-bold text-white">
          {queuePosition + 1}
        </div>
      )}
      <img
        className="aspect-square w-full rounded-sm object-cover transition group-hover:scale-105 group-active:scale-95 lg:rounded-lg"
        draggable={false}
        src={album.images[0] ? album.images[0].url : placeholder}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-2">{album.name}</p>
        <p className="text-sub-text-light dark:text-sub-text-dark text-xs">
          {album.release_date.substring(0, 4)} • {album.album_type}
          <span className="hidden md:inline"> • {getNumSongs()}</span>
        </p>
        <p className="text-sub-text-light dark:text-sub-text-dark text-xs md:hidden">
          {getNumSongs()}
        </p>
      </div>
    </div>
  );
}
