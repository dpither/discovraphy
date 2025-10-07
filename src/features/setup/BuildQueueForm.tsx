import { useEffect, useMemo } from "react";
import FilterChip from "../../components/FilterChip";
import Spinner from "../../components/Spinner";
import { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import AlbumCard from "../../components/AlbumCard";
import { useSetupStore } from "./store";
import { getArtistAlbums } from "../../lib/spotifyApi";

export default function BuildQueueForm() {
  const isLoading = useSetupStore((state) => state.isLoading);
  const setData = useSetupStore((state) => state.setData);
  const selectedArtistId = useSetupStore((state) => state.selectedArtistId);
  const albumResults = useSetupStore((state) => state.albumResults);
  const albumFilters = useSetupStore((state) => state.albumFilters);
  const selectedAlbumIds = useSetupStore((state) => state.selectedAlbumIds);
  const numTracks = useSetupStore((state) => state.numTracks);

  const filteredAlbums = useMemo(() => {
    if (albumFilters.length === 0) {
      return albumResults;
    }
    return albumResults.filter((album) =>
      albumFilters.includes(album.album_type),
    );
  }, [albumResults, albumFilters]);

  function onSelectAlbum(album: SimplifiedAlbum) {
    if (selectedAlbumIds.includes(album.id)) {
      setData({
        selectedAlbumIds: selectedAlbumIds.filter((item) => item !== album.id),
        numTracks: numTracks - album.total_tracks,
      });
    } else {
      setData({
        selectedAlbumIds: [...selectedAlbumIds, album.id],
        numTracks: numTracks + album.total_tracks,
      });
    }
  }

  function onToggleFilter(name: string) {
    if (albumFilters.includes(name)) {
      setData({ albumFilters: albumFilters.filter((item) => item !== name) });
    } else {
      setData({ albumFilters: [...albumFilters, name] });
    }
  }

  //TODO: Move fetching up to allow searching right after artist selection confirmation and only on change?
  const getDiscography = async () => {
    if (selectedArtistId === null) return;
    setData({ isLoading: true, numTracks: 0, selectedAlbumIds: [] });
    setData({
      isLoading: false,
      albumResults: await getArtistAlbums(selectedArtistId),
    });
  };

  useEffect(() => {
    getDiscography();
  }, [selectedArtistId]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Build your Queue
      </h1>
      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-black dark:border-white">
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <FilterChip
              text="Albums"
              isSelected={albumFilters.includes("Album")}
              onClick={() => {
                onToggleFilter("Album");
              }}
            />
            <FilterChip
              text="Singles"
              isSelected={albumFilters.includes("Single")}
              onClick={() => {
                onToggleFilter("Single");
              }}
            />
            <FilterChip
              text="EPs"
              isSelected={albumFilters.includes("EP")}
              onClick={() => {
                onToggleFilter("EP");
              }}
            />
          </div>
          <p className="flex text-black dark:text-white">
            {" "}
            {numTracks} Track{numTracks != 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="grid h-full grid-cols-2 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 2xl:grid-cols-5">
              {filteredAlbums?.map((album, i) => (
                <AlbumCard
                  key={i}
                  album={album}
                  queuePosition={selectedAlbumIds.indexOf(album.id)}
                  onClick={() => onSelectAlbum(album)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
