import { Artist, Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk";
import Icon from "../../assets/Icon";
import tailwindConfig from "../../../tailwind.config";
import { useState } from "react";
import Button from "../../components/Button";
import Artists from "../../components/Artists";

type SelectArtistData = {
  selectedArtist: Artist | null;
};

interface SelectArtistFormProps {
  updateSetupData: (fields: Partial<SelectArtistData>) => void;
}

export default function SelectArtistForm({
  updateSetupData,
}: SelectArtistFormProps) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function search() {
    if (searchInput.trim() === "") {
      return;
    }
    searchArtists();
  }

  function onSelectArtist(key: number) {
    if (key === selectedId) {
      setSelectedId(-1);
      updateSetupData({ selectedArtist: null });
      console.log("Unselecting.")
    } else {
      setSelectedId(key);
      updateSetupData({ selectedArtist: artists[key] });
      console.log("Selected:" + artists[key].name)
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
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Select an Artist
      </h1>
      <div className="relative">
        <input
          type="search"
          className="w-full rounded-lg border border-black bg-black bg-opacity-0 p-4 pe-16 text-sm placeholder-subTextLight md:text-base dark:border-white dark:text-white dark:placeholder-subTextDark"
          placeholder="Which artist intrigues you?"
          onChange={(e) => setSearchInput(e.currentTarget.value)}
        />
        <div className="absolute inset-y-0 end-0 place-content-center p-2">
          <Button onClick={search}>
            <Icon fill={tailwindConfig.theme.colors.white} />
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 rounded-lg border border-black dark:border-white">
        <Artists
          artists={artists}
          isLoading={isLoading}
          selectedId={selectedId}
          onClick={onSelectArtist}
        />
      </div>
    </div>
  );
}
