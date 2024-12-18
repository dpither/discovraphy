import Icon from "../../assets/Icon";
import tailwindConfig from "../../../tailwind.config";
import { useState } from "react";
import Button from "../Button";
import Artists from "../Artists";

export default function ArtistSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(searchInput)
  }

  function handleSearchChange(event: React.FormEvent<HTMLInputElement>) {
    setSearchInput(event.currentTarget.value);
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
      <div className="flex h-screen max-h-80 w-full max-w-2xl rounded-lg border-2 border-black dark:border-white">
        <Artists query={query} />
      </div>
    </div>
  );
}
