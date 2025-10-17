import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { useCallback, useEffect } from "react";
import PlaylistCard from "../../components/PlaylistCard";
import ResultContainer from "../../components/ResultContainer";
import Spinner from "../../components/Spinner";
import { useSetupStore } from "../../hooks/useSetupStore";
import { getAlbumTracks, getOwnedPlaylists } from "../../lib/spotifyApi";

export default function SelectDestinationForm() {
	const isLoading = useSetupStore((state) => state.isLoading);
	const setData = useSetupStore((state) => state.setData);
	const ownedPlaylists = useSetupStore((state) => state.ownedPlaylists);
	const destination = useSetupStore((state) => state.destination);
	const selectedAlbums = useSetupStore((state) => state.selectedAlbums);

	function onSelectCheckbox() {
		if (destination === "SAVE") {
			setData({ destination: null });
		} else {
			setData({ destination: "SAVE" });
		}
	}

	function onSelectPlaylist(playlist: SimplifiedPlaylist) {
		if (destination === playlist.id) {
			setData({ destination: null });
		} else {
			setData({ destination: playlist.id });
		}
	}

	// Abstract away maybe prefetch?
	const getPlaylists = useCallback(async () => {
		setData({ isLoading: true });
		setData({
			isLoading: false,
			ownedPlaylists: await getOwnedPlaylists(),
		});
	}, [setData]);

	const getTracks = useCallback(async () => {
		const temp = await getAlbumTracks(selectedAlbums);
		console.log(temp[0]);
	}, [selectedAlbums]);

	useEffect(() => {
		getTracks();
		if (ownedPlaylists.length > 0) {
			return;
		}
		getPlaylists();
	}, [getPlaylists, getTracks, ownedPlaylists.length]);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<h1 className="font-semibold text-3xl text-black dark:text-white">
				Select a Destination
			</h1>
			<div className="flex items-center gap-2 text-black dark:text-white">
				<input
					checked={destination === "SAVE"}
					className="accent-blue outline-blue outline-offset-2 focus-visible:outline-2"
					name="checkbox"
					onChange={onSelectCheckbox}
					type="checkbox"
				/>
				<label htmlFor="checkbox">Save to liked songs</label>
			</div>
			<div className="flex min-h-0 flex-1 flex-col rounded-sm border border-black lg:rounded-lg dark:border-white">
				<div className="flex min-h-0 flex-1 items-center justify-center">
					{isLoading && <Spinner />}
					{!isLoading && (
						<ResultContainer>
							{ownedPlaylists?.map((playlist) => (
								<PlaylistCard
									isSelected={destination === playlist.id}
									key={playlist.id}
									onClick={() => {
										onSelectPlaylist(playlist);
									}}
									playlist={playlist}
								/>
							))}
						</ResultContainer>
					)}
				</div>
			</div>
		</div>
	);
}
