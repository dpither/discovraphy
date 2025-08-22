import { useEffect, useState } from "react";
import FilterChip from "../../components/FilterChip";
import Spinner from "../../components/Spinner";
import {
  Artist,
  Scopes,
  SimplifiedAlbum,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import AlbumCard from "../../components/AlbumCard";

interface BuildQueueFormProps {
  artist: Artist | null;
}

export default function BuildQueueForm({ artist }: BuildQueueFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState<SimplifiedAlbum[]>([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<Set<number>>(
    new Set(),
  );

  function handleSelectAlbum(key: number) {
    setSelectedAlbumIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const getDiscography = async () => {
    if (artist === null) {
      console.log("No artist provided");
      return;
    }
    setIsLoading(true);
    const sdk = SpotifyApi.withUserAuthorization(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      import.meta.env.VITE_REDIRECT_TARGET,
      Scopes.userDetails,
    );

    const res = await sdk.artists.albums(artist.id);
    console.log(res.items);
    setAlbums(res.items);
    setIsLoading(false);
  };
  useEffect(() => {
    getDiscography();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Build your Queue
      </h1>
      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-black dark:border-white">
        <div className="flex gap-2 p-4">
          <FilterChip text="Albums" isSelected={false} />
          <FilterChip text="Singles" isSelected={false} />
        </div>
        <div className="flex min-h-0 flex-1">
          {isLoading && (
            <div className="flex size-full items-center justify-center">
              <Spinner />
            </div>
          )}
          <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 2xl:grid-cols-6">
            {albums?.map((album, i) => (
              <AlbumCard
                key={i}
                album={album}
                isSelected={selectedAlbumIds.has(i)}
                onClick={() => {
                  handleSelectAlbum(i);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
