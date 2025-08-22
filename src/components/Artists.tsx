import { Artist } from "@spotify/web-api-ts-sdk";
import ArtistCard from "./ArtistCard";
import Spinner from "./Spinner";

interface ArtistsProps {
  artists: Artist[];
  isLoading: boolean;
  selectedId: number;
  onClickArtist: (id: number) => void;
}

export default function Artists({
  artists,
  isLoading,
  selectedId,
  onClickArtist,
}: ArtistsProps) {
  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-4 2xl:grid-cols-6">
      {artists?.map((artist, i) => (
        <ArtistCard
          key={i}
          artist={artist}
          isSelected={selectedId === i}
          onClick={() => {
            onClickArtist(i);
          }}
        />
      ))}
    </div>
  );
}
