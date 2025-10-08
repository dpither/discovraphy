import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";
import SpotifyIcon from "../assets/spotify_icon.svg?react";

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
    return playlist.tracks.total + " songs";
  }
  return (
    <div
      className={`${isSelected ? "border border-black dark:border-white" : "border-transparent"} group relative flex flex-col gap-2 rounded-sm border p-2 text-sm text-black transition select-none hover:border-black lg:rounded-lg dark:text-white dark:hover:border-white`}
      onClick={onClick}
    >
      <SpotifyIcon className="w-6" />

      <img
        className="aspect-square w-full rounded-sm object-cover transition group-hover:scale-105 group-active:scale-95 lg:rounded-lg"
        draggable={false}
        src={playlist.images[0] ? playlist.images[0].url : placeholder}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-2">{playlist.name}</p>
        <p className="text-sub-text-light dark:text-sub-text-dark text-xs">
          {playlist.public ? "Public" : "Private"} • {getNumSongs()}
        </p>
      </div>
    </div>
  );
}
