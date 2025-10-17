import type { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import { useCallback, useEffect, useMemo } from "react";
import AlbumCard from "../../components/AlbumCard";
import FilterChip from "../../components/FilterChip";
import Spinner from "../../components/Spinner";
import { useSetupStore } from "../../hooks/useSetupStore";
import { getArtistAlbums } from "../../lib/spotifyApi";

export default function BuildQueueForm() {
	const isLoading = useSetupStore((state) => state.isLoading);
	const setData = useSetupStore((state) => state.setData);
	const selectedArtist = useSetupStore((state) => state.selectedArtist);
	const albumResults = useSetupStore((state) => state.albumResults);
	const albumFilters = useSetupStore((state) => state.albumFilters);
	const selectedAlbums = useSetupStore((state) => state.selectedAlbums);
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
		if (selectedAlbums.includes(album)) {
			setData({
				selectedAlbums: selectedAlbums.filter((item) => item.id !== album.id),
				numTracks: numTracks - album.total_tracks,
			});
		} else {
			setData({
				selectedAlbums: [...selectedAlbums, album],
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
	const getDiscography = useCallback(async () => {
		if (selectedArtist === null) return;
		setData({ isLoading: true, numTracks: 0, selectedAlbums: [] });
		setData({
			isLoading: false,
			albumResults: await getArtistAlbums(selectedArtist),
		});
	}, [selectedArtist, setData]);

	useEffect(() => {
		getDiscography();
	}, [getDiscography]);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<h1 className="font-semibold text-3xl text-black dark:text-white">
				Build your Queue
			</h1>
			<div className="flex min-h-0 flex-1 flex-col rounded-sm border border-black lg:rounded-lg dark:border-white">
				<div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex gap-2">
						<FilterChip
							isSelected={albumFilters.includes("Album")}
							onClick={() => {
								onToggleFilter("Album");
							}}
							text="Albums"
						/>
						<FilterChip
							isSelected={albumFilters.includes("Single")}
							onClick={() => {
								onToggleFilter("Single");
							}}
							text="Singles"
						/>
						<FilterChip
							isSelected={albumFilters.includes("EP")}
							onClick={() => {
								onToggleFilter("EP");
							}}
							text="EPs"
						/>
					</div>
					<p className="flex text-black dark:text-white">
						{" "}
						{numTracks} Track{numTracks !== 1 ? "s" : ""} selected
					</p>
				</div>
				<div className="flex min-h-0 flex-1 items-center justify-center">
					{isLoading && <Spinner />}
					{!isLoading && (
						<div className="no-scrollbar grid size-full grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-4 2xl:grid-cols-5">
							{filteredAlbums?.map((album) => (
								<AlbumCard
									album={album}
									key={album.id}
									onClick={() => onSelectAlbum(album)}
									queuePosition={selectedAlbums.indexOf(album)}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
