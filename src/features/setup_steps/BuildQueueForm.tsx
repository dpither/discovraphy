import { useEffect, useMemo, useState } from "react";
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

  const [filters, setFilters] = useState<Set<string>>(new Set());

  const filteredAlbums = useMemo(() => {
    if (filters.size === 0) {
      return albums
    }
    return albums.filter(album => {
      return filters.has(album.album_type)
    })
  }, [albums, filters]);

  function onSelectAlbum(key: number) {
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

  function onToggleFilter(name: string) {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    })
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

    const res = await sdk.artists.albums(artist.id, undefined, undefined, 50);
    res.items.forEach((album) => {
      if (album.album_type === "single") {
        album.album_type = album.total_tracks <= 3 ? "Single" : "EP";
      } else {
        album.album_type = "Album";
      }
    });
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
          <FilterChip text="Albums" isSelected={filters.has("Album")} onClick={()=>{onToggleFilter("Album")}} />
          <FilterChip text="Singles" isSelected={filters.has("Single")} onClick={()=>{onToggleFilter("Single")}} />
          <FilterChip text="EPs" isSelected={filters.has("EP")} onClick={()=>{onToggleFilter("EP")}} />
        </div>
        <div className="flex min-h-0 flex-1">
          {isLoading && (
            <div className="flex size-full items-center justify-center">
              <Spinner />
            </div>
          )}
          <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 2xl:grid-cols-6">
            {filteredAlbums?.map((album, i) => (
              <AlbumCard
                key={i}
                album={album}
                isSelected={selectedAlbumIds.has(i)}
                onClick={() => {
                  onSelectAlbum(i);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
