import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import {
  Scopes,
  SimplifiedPlaylist,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import PlaylistCard from "../../components/PlaylistCard";

interface SelectDestinationFormData {
  destination: SimplifiedPlaylist | "SAVE" | null;
}

interface SelectDestinationFormProps extends SelectDestinationFormData {
  updateSetupData: (fields: Partial<SelectDestinationFormData>) => void;
}

export default function SelectDestinationForm({
  destination,
  updateSetupData,
}: SelectDestinationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [ownedPlaylists, setOwnedPlaylists] = useState<SimplifiedPlaylist[]>(
    [],
  );

  function onSelectCheckbox() {
    if (destination === "SAVE") {
      updateSetupData({ destination: null });
    } else {
      updateSetupData({ destination: "SAVE" });
    }
  }

  function onSelectPlaylist(playlist: SimplifiedPlaylist) {
    if (destination != "SAVE" && destination?.id === playlist.id) {
      updateSetupData({ destination: null });
    } else {
      updateSetupData({ destination: playlist });
    }
  }

  const getPlaylists = async () => {
    setIsLoading(true);
    const sdk = SpotifyApi.withUserAuthorization(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      import.meta.env.VITE_REDIRECT_TARGET,
      [...Scopes.userDetails, ...Scopes.playlist],
    );
    const playlistRes = await sdk.currentUser.playlists.playlists(50);
    const profileRes = await sdk.currentUser.profile();
    setOwnedPlaylists(
      playlistRes.items.filter((item) => {
        return item.owner.id === profileRes.id;
      }),
    );
    setIsLoading(false);
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Select a Destination
      </h1>
      <div className="flex items-center gap-2 text-black dark:text-white">
        <input
          type="checkbox"
          className="accent-blue"
          checked={destination === "SAVE"}
          onChange={onSelectCheckbox}
        />
        <label>Save to liked songs</label>
      </div>
      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-black dark:border-white">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-4 2xl:grid-cols-6">
              {ownedPlaylists?.map((playlist, i) => (
                <PlaylistCard
                  key={i}
                  playlist={playlist}
                  isSelected={
                    destination != "SAVE" && destination?.id === playlist.id
                  }
                  onClick={() => {
                    onSelectPlaylist(playlist);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
