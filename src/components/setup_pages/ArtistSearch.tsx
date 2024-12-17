import Icon from "../../assets/Icon";
import tailwindConfig from "../../../tailwind.config";
import { useState } from "react";
import Button from "../Button";
import { Artist, SpotifyApi } from "@spotify/web-api-ts-sdk";
import ArtistCard from "../ArtistCard";

export default function ArtistSearch() {
  const [selectedId, setSelectedId] = useState(-1);
  const [searchInput, setSearchInput] = useState("");
  const [artists, setArtists] = useState<Artist[]>();

  function handleSelectArtist(key: number) {
    selectedId === key ? setSelectedId(-1) : setSelectedId(key);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search();
  }

  function handleSearchChange(event: React.FormEvent<HTMLInputElement>) {
    setSearchInput(event.currentTarget.value);
  }

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const scopes = ["user-read-private", "user-read-email"];

  const sdk = SpotifyApi.withUserAuthorization(
    clientId,
    "http://localhost:3000/discovraphy/setup",
    scopes,
  );

  async function search() {
    if (searchInput.trim() == "") {
      return;
    }
    console.log("Searching for:" + searchInput);
    const res = await sdk.search(searchInput, ["artist"]);
    console.log(res.artists.items);
    setArtists(res.artists.items);
  }

  return (
    <div className="m-4 flex w-full max-w-2xl flex-col gap-4">
      <form className="relative w-full max-w-2xl" onSubmit={handleSubmit}>
        <input
          type="search"
          className="w-full rounded-lg border-2 border-black bg-black bg-opacity-0 p-4 pe-16 text-sm md:text-base dark:border-white dark:text-white"
          placeholder="Which artist intrigues you?"
          onChange={handleSearchChange}
          required
        />
        <div className="absolute inset-y-0 end-0 place-content-center p-2">
          <Button>
            <Icon fill={tailwindConfig.theme.colors.white} />
          </Button>
        </div>
      </form>
      <div>
        <p className="px-2 text-sm text-black md:text-lg dark:text-white">
          Select the artist you want to hear more of.
        </p>
      </div>
      <div className="flex max-h-80 w-full max-w-2xl rounded-lg border-2 border-black dark:border-white">
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
      </div>
    </div>
  );
}
