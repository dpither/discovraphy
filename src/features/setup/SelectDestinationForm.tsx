import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import PlaylistCard from "../../components/PlaylistCard";
import ResultContainer from "../../components/ResultContainer";
import Spinner from "../../components/Spinner";
import { useSetupStore } from "../../hooks/useSetupStore";

// TODO: Add create new playlist as an option

export default function SelectDestinationForm() {
	const { isLoading, ownedPlaylists, selectedDestination, setData } =
		useSetupStore();

	function handleSelectCheckbox() {
		if (selectedDestination === "SAVE") {
			setData({ selectedDestination: "" });
		} else {
			setData({ selectedDestination: "SAVE" });
		}
	}

	function handleSelectPlaylist(playlist: SimplifiedPlaylist) {
		if (selectedDestination === playlist.id) {
			setData({ selectedDestination: "" });
		} else {
			setData({ selectedDestination: playlist.id });
		}
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<h1>Select a Destination</h1>
			<p className="flex items-center gap-2">
				<input
					checked={selectedDestination === "SAVE"}
					className="accent-blue outline-blue outline-offset-2 focus-visible:outline-2"
					name="checkbox"
					onChange={handleSelectCheckbox}
					type="checkbox"
				/>
				<label htmlFor="checkbox">Save to liked songs</label>
			</p>
			<div className="flex min-h-0 flex-1 flex-col rounded-sm border border-black px-4 pt-4 lg:rounded-lg dark:border-white">
				<div className="flex min-h-0 flex-1 items-center justify-center">
					{isLoading && <Spinner />}
					{!isLoading && (
						<ResultContainer>
							{ownedPlaylists?.map((playlist) => (
								<PlaylistCard
									isSelected={selectedDestination === playlist.id}
									key={playlist.id}
									onClick={() => {
										handleSelectPlaylist(playlist);
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
