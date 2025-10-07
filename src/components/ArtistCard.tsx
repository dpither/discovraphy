import { Artist } from "@spotify/web-api-ts-sdk";
import placeholder from "../assets/artist_placeholder.png";
import spotify_logo from "../assets/spotify_logo.svg";

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
      className={`${isSelected ? "border-black dark:border-white" : "border-transparent"} group flex select-none flex-col gap-2 rounded border p-2 text-sm text-black transition hover:border-black dark:text-white hover:dark:border-white`}
      onClick={onClick}
    >
      <img className="w-20" src={spotify_logo} alt="spotify_logo" />
      <img
        className="aspect-square w-full rounded-full object-cover transition group-hover:scale-105 group-active:scale-95"
        src={artist.images[0] ? artist.images[0].url : placeholder}
        draggable={false}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-2">{artist.name}</p>
        <p className="line-clamp-1 text-xs text-subTextLight dark:text-subTextDark">
          Followers: {artist.followers.total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
