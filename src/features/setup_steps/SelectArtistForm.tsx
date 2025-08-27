import { Artist, Scopes, SpotifyApi } from "@spotify/web-api-ts-sdk";
import Icon from "../../assets/Icon";
import tailwindConfig from "../../../tailwind.config";
import { useState } from "react";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import ArtistCard from "../../components/ArtistCard";

interface SelectArtistData {
  selectedArtist: Artist | null;
}

interface SelectArtistFormProps extends SelectArtistData {
  updateSetupData: (fields: Partial<SelectArtistData>) => void;
}

export default function SelectArtistForm({
  selectedArtist,
  updateSetupData,
}: SelectArtistFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);

  function search() {
    if (searchInput.trim() === "") {
      return;
    }
    setArtists([]);
    updateSetupData({ selectedArtist: null });
    searchArtists();
  }

  function onSelectArtist(artist: Artist) {
    if (artist.id === selectedArtist?.id) {
      updateSetupData({ selectedArtist: null });
      console.log("Unselecting " + artist.name);
    } else {
      updateSetupData({ selectedArtist: artist });
      console.log("Selecting " + artist.name);
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

      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-black dark:border-white">
        <div className="relative p-4">
          <input
            type="search"
            className="w-full rounded-lg border border-black bg-black bg-opacity-0 p-4 pe-16 text-sm placeholder-subTextLight md:text-base dark:border-white dark:text-white dark:placeholder-subTextDark"
            placeholder="Which artist intrigues you?"
            onChange={(e) => setSearchInput(e.currentTarget.value)}
          />
          <div className="absolute inset-y-0 end-4 place-content-center p-2">
            <Button onClick={search}>
              <Icon fill={tailwindConfig.theme.colors.white} />
            </Button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 2xl:grid-cols-6">
              {artists?.map((artist, i) => (
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
