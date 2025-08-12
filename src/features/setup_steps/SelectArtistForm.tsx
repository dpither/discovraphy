import { Artist, Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk";
import Icon from "../../assets/Icon";
import tailwindConfig from "../../../tailwind.config";
import { useState } from "react";
import Button from "../../components/Button";
import Artists from "../../components/Artists";

type SelectArtistData = {
  selectedArtist: Artist | null;
};

type SelectArtistFormProps = SelectArtistData & {
  updateSetupData: (fields: Partial<SelectArtistData>) => void;
};

export default function SelectArtistForm({
  selectedArtist,
  updateSetupData,
}: SelectArtistFormProps) {
  const [searchInput, setSearchInput] = useState("");
  // const [showResultComponent, setShowResultComponent] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function search() {
    if (searchInput.trim() === "") {
      return;
    }
    // setShowResultComponent(true);
    searchArtists();
  }

  function handleSelectArtist(key: number) {
    if (selectedId === key) {
      setSelectedId(-1);
      updateSetupData({ selectedArtist: null });
    } else {
      setSelectedId(key);
      updateSetupData({ selectedArtist: artists[selectedId] });
    }
  }

  const searchArtists = async () => {
    setIsLoading(true);
    console.log("Searching for:" + searchInput);
    const sdk = SpotifyApi.withUserAuthorization(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      import.meta.env.VITE_REDIRECT_TARGET,
      Scopes.userDetails,
    );
    const res = await sdk.search(searchInput, ["artist"]);
    console.log(res.artists.items);
    setArtists(res.artists.items);
    setIsLoading(false);
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Select an Artist
      </h1>
      <div className="relative w-full max-w-2xl">
        <input
          type="search"
          className="w-full rounded-lg border border-black bg-black bg-opacity-0 p-4 pe-16 text-sm md:text-base dark:border-white dark:text-white"
          placeholder="Which artist intrigues you?"
          onChange={(e) => setSearchInput(e.currentTarget.value)}
        />
        <div className="absolute inset-y-0 end-0 place-content-center p-2">
          <Button onClick={search}>
            <Icon fill={tailwindConfig.theme.colors.white} />
          </Button>
        </div>
      </div>
      {/* <div
        className={`flex flex-col gap-4 transition-opacity duration-500 ${showResultComponent ? "opacity-100" : "opacity-0"}`}>
      </div> */}
      <div className="flex flex-1 w-full max-w-2xl rounded-lg border border-black dark:border-white">
        <Artists
          artists={artists}
          isLoading={isLoading}
          selectedId={selectedId}
          onClickArtist={handleSelectArtist}
        />
      </div>
    </div>
  );
}
