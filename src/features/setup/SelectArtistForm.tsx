import { Artist } from "@spotify/web-api-ts-sdk";
import DiscovraphyIcon from "../../assets/discovraphy_icon.svg?react";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import ArtistCard from "../../components/ArtistCard";
import { useSetupStore } from "./store";
import { getArtists } from "../../lib/spotifyApi";

export default function SelectArtistForm() {
  const isLoading = useSetupStore((state) => state.isLoading);
  const setData = useSetupStore((state) => state.setData);
  const artistQuery = useSetupStore((state) => state.artistQuery);
  const artistResults = useSetupStore((state) => state.artistResults);
  const selectedArtistId = useSetupStore((state) => state.selectedArtistId);

  async function onSearch() {
    if (isLoading || artistQuery.trim() === "") return;
    setData({ selectedArtistId: null, artistResults: [], isLoading: true });
    setData({ artistResults: await getArtists(artistQuery), isLoading: false });
  }

  function onSelectArtist(artist: Artist) {
    if (artist.id === selectedArtistId) {
      setData({ selectedArtistId: null });
    } else {
      setData({ selectedArtistId: artist.id });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Select an Artist
      </h1>
      <div className="flex min-h-0 flex-1 flex-col rounded-sm border border-black lg:rounded-lg dark:border-white">
        <div className="relative p-4">
          <input
            type="search"
            className="bg-opacity-0 placeholder-sub-text-light dark:placeholder-sub-text-dark w-full rounded-sm border border-black p-4 pe-16 text-sm md:text-base lg:rounded-lg dark:border-white dark:text-white"
            placeholder="Which artist intrigues you?"
            value={artistQuery}
            onChange={(e) => setData({ artistQuery: e.currentTarget.value })}
          />
          <div className="absolute inset-y-0 end-4 place-content-center p-2">
            <Button onClick={onSearch}>
              <DiscovraphyIcon className="h-6 w-6 fill-white" />
            </Button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="no-scrollbar grid h-full grid-cols-2 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 2xl:grid-cols-5">
              {artistResults?.map((artist, i) => (
                <ArtistCard
                  key={i}
                  artist={artist}
                  isSelected={artist.id === selectedArtistId}
                  onClick={() => onSelectArtist(artist)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
