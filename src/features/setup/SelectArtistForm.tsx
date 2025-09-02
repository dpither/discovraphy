import { Artist } from "@spotify/web-api-ts-sdk";
import Icon from "../../assets/Icon";
import tailwindConfig from "../../../tailwind.config";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import ArtistCard from "../../components/ArtistCard";
import { useSetupStore } from "./store";
import { getArtists } from "../../lib/spotifyAPI";

export default function SelectArtistForm() {
  const isLoading = useSetupStore((state) => state.isLoading);
  const setData = useSetupStore((state) => state.setData);
  const artistQuery = useSetupStore((state) => state.artistQuery);
  const artistResults = useSetupStore((state) => state.artistResults);
  const selectedArtistId = useSetupStore((state) => state.selectedArtistId);

  async function onSearch() {
    if (isLoading || artistQuery.trim() === "") return;
    setData({ selectedArtistId: null, artistResults: [], isLoading:true });
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
      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-black dark:border-white">
        <div className="relative p-4">
          <input
            type="search"
            className="w-full rounded-lg border border-black bg-black bg-opacity-0 p-4 pe-16 text-sm placeholder-subTextLight md:text-base dark:border-white dark:text-white dark:placeholder-subTextDark"
            placeholder="Which artist intrigues you?"
            value={artistQuery}
            onChange={(e) => setData({ artistQuery: e.currentTarget.value })}
          />
          <div className="absolute inset-y-0 end-4 place-content-center p-2">
            <Button onClick={onSearch}>
              <Icon fill={tailwindConfig.theme.colors.white} />
            </Button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 2xl:grid-cols-6">
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
