import { Artist } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";
import SpotifyIcon from "../assets/spotify_icon.svg?react";

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
    <div
      className={`${isSelected ? "border-black dark:border-white" : "border-transparent"} group ${isSelected ? "" : "hover:border-sub-text-light dark:hover:border-sub-text-dark"} relative flex flex-col gap-2 rounded-sm border p-2 text-sm text-black transition select-none lg:rounded-lg dark:text-white`}
      onClick={onClick}
    >
      <SpotifyIcon className="w-6" />
      <img
        className="aspect-square w-full rounded-full object-cover transition"
        src={artist.images[0] ? artist.images[0].url : placeholder}
        draggable={false}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-2">{artist.name}</p>
        <p className="text-sub-text-light dark:text-sub-text-dark line-clamp-1 text-xs">
          Followers: {artist.followers.total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
