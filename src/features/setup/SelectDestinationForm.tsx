import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import PlaylistCard from "../../components/PlaylistCard";
import ResultContainer from "../../components/ResultContainer";
import Spinner from "../../components/Spinner";
import { useSetupStore } from "../../hooks/useSetupStore";

// TODO: Add refresh or create new playlist method/checkbox

export default function SelectDestinationForm() {
	const { isLoading, setData, ownedPlaylists, selectedDestination } =
		useSetupStore();

	function onSelectCheckbox() {
		if (selectedDestination === "SAVE") {
			setData({ selectedDestination: null });
		} else {
			setData({ selectedDestination: "SAVE" });
		}
	}

	function onSelectPlaylist(playlist: SimplifiedPlaylist) {
		if (selectedDestination === playlist.id) {
			setData({ selectedDestination: null });
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
					onChange={onSelectCheckbox}
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
