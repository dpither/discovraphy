import type { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import { useMemo } from "react";
import AlbumCard from "../../components/AlbumCard";
import FilterChip from "../../components/FilterChip";
import ResultContainer from "../../components/ResultContainer";
import Spinner from "../../components/Spinner";
import { useSetupStore } from "../../hooks/useSetupStore";

export default function BuildQueueForm() {
	const {
		setData,
		albumFilters,
		selectedAlbums,
		numTracks,
		isLoading,
		albumResults,
	} = useSetupStore();

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

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<h1 className="font-semibold text-3xl text-black dark:text-white">
				Build your Queue
			</h1>
			<div className="flex min-h-0 flex-1 flex-col rounded-sm border border-black lg:rounded-lg dark:border-white px-4 pt-4 gap-4">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
						{numTracks} track{numTracks !== 1 ? "s" : ""} selected
					</p>
				</div>
				<div className="flex min-h-0 flex-1 items-center justify-center">
					{isLoading && <Spinner />}
					{!isLoading && (
						<ResultContainer>
							{filteredAlbums?.map((album) => (
								<AlbumCard
									album={album}
									key={album.id}
									onClick={() => onSelectAlbum(album)}
									queuePosition={selectedAlbums.indexOf(album)}
								/>
							))}
						</ResultContainer>
					)}
				</div>
			</div>
		</div>
	);
}
