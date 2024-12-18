import { Artist, Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk";
import ArtistCard from "./ArtistCard";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";

interface ArtistsProps {
  query: string;
}

export default function Artists({ query }: ArtistsProps) {
  if (query.trim() === "") {
    return;
  }

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      setIsLoading(true);
      console.log("Searching for:" + query);
      const sdk = SpotifyApi.withUserAuthorization(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.userDetails,
      );
      const res = await sdk.search(query, ["artist"]);
      console.log(res.artists.items);
      setArtists(res.artists.items);
      setIsLoading(false);
    };
    search();
  }, [query]);

  function handleSelectArtist(key: number) {
    selectedId === key ? setSelectedId(-1) : setSelectedId(key);
  }

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="no-scrollbar grid grid-cols-2 gap-2 overflow-y-scroll p-4 md:grid-cols-4">
      {artists?.map((artist, i) => (
        <ArtistCard
          artist={artist}
          isSelected={selectedId === i}
          onClick={() => {
            handleSelectArtist(i);
          }}
        />
      ))}
    </div>
  );
}
