import { Artist } from "@spotify/web-api-ts-sdk";
import ArtistCard from "./ArtistCard";
import Spinner from "./Spinner";

interface ArtistsProps {
  artists: Artist[]
  isLoading: boolean
  selectedId: number
  onClickArtist: (id: number) => void;
}

export default function Artists({ artists, isLoading, selectedId, onClickArtist }: ArtistsProps) {
  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto grid grid-cols-2 gap-2 p-4 sm:grid-cols-4 2xl:grid-cols-6">
      {artists?.map((artist, i) => (
        <ArtistCard
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
