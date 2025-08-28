import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";

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
      return "No songs"
    }

    if(playlist.tracks.total === 1) {
      return "1 song";
    }
    return playlist.tracks.total + " songs";
  }
  return (
    <div
      className={`${isSelected ? "border border-black dark:border-white" : "border-transparent"} group relative flex select-none flex-col gap-2 rounded border p-2 text-sm text-black transition hover:border-black dark:text-white hover:dark:border-white`}
      onClick={onClick}
    >
      <img
        className="aspect-square w-full rounded-lg object-cover transition group-hover:scale-105 group-active:scale-95"
        draggable={false}
        src={playlist.images[0] ? playlist.images[0].url : placeholder}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-2">{playlist.name}</p>
        <p className="text-xs text-subTextLight dark:text-subTextDark">
          {playlist.public ? "Public" : "Private"} • {getNumSongs()}
        </p>
      </div>
    </div>
  );
}
