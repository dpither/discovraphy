import { Artist } from "@spotify/web-api-ts-sdk";
import DiscovraphyIcon from "../../assets/discovraphy_icon.svg?react";
import Spinner from "../../components/Spinner";
import ArtistCard from "../../components/ArtistCard";
import { useSetupStore } from "../../hooks/useSetupStore";
import { getArtists } from "../../lib/spotifyApi";
import FlatButton from "../../components/FlatButton";

export default function SelectArtistForm() {
  const isLoading = useSetupStore((state) => state.isLoading);
  const setData = useSetupStore((state) => state.setData);
  const artistQuery = useSetupStore((state) => state.artistQuery);
  const artistResults = useSetupStore((state) => state.artistResults);
  const selectedArtist = useSetupStore((state) => state.selectedArtist);

  async function onSearch() {
    if (isLoading || artistQuery.trim() === "") return;
    setData({ selectedArtist: null, artistResults: [], isLoading: true });
    setData({ artistResults: await getArtists(artistQuery), isLoading: false });
  }

  function onSelectArtist(artist: Artist) {
    if (artist.id === selectedArtist?.id) {
      setData({ selectedArtist: null });
    } else {
      setData({ selectedArtist: artist });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="text-3xl font-semibold text-black dark:text-white">
        Select an Artist
      </h1>
      <div className="flex min-h-0 flex-1 flex-col rounded-sm border border-black lg:rounded-lg dark:border-white">
        <div className="relative p-4">
          <input
            type="search"
            className="bg-opacity-0 placeholder-sub-text-light dark:placeholder-sub-text-dark w-full rounded-sm border border-black p-2 pe-10 text-sm md:text-base lg:rounded-lg dark:border-white dark:text-white"
            placeholder="Which artist intrigues you?"
            value={artistQuery}
            onChange={(e) => setData({ artistQuery: e.currentTarget.value })}
          />
          <div className="absolute inset-y-0 end-4 place-content-center">
            <FlatButton onClick={onSearch}>
              <DiscovraphyIcon className="fill-sub-text-light dark:fill-sub-text-dark hover:fill-black hover:dark:fill-white" />
            </FlatButton>
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
                  isSelected={artist.id === selectedArtist?.id}
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
