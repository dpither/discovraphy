import type { Artist } from "@spotify/web-api-ts-sdk";
import DiscovraphyIcon from "../../assets/discovraphy_icon.svg?react";
import ArtistCard from "../../components/ArtistCard";
import FlatButton from "../../components/FlatButton";
import ResultContainer from "../../components/ResultContainer";
import Spinner from "../../components/Spinner";
import Tooltip from "../../components/Tooltip";
import { useSetupStore } from "../../hooks/useSetupStore";

export default function SelectArtistForm() {
	const {
		setData,
		artistQuery,
		selectedArtistId,
		isLoading,
		artistResults,
		getArtists,
	} = useSetupStore();

	function onSelectArtist(artist: Artist) {
		if (artist.id === selectedArtistId) {
			setData({ selectedArtistId: "" });
		} else {
			setData({ selectedArtistId: artist.id });
		}
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<h1>Select an Artist</h1>
			<div className="flex min-h-0 flex-1 flex-col gap-2 rounded-sm border border-black px-2 pt-2 lg:rounded-lg dark:border-white">
				<p className="relative">
					<input
						className="h-10 w-full rounded-sm border border-black bg-opacity-0 p-2 pe-10 placeholder-sub-text-light outline-blue outline-offset-2 focus-visible:outline-2 md:text-base lg:rounded-lg dark:border-white dark:placeholder-sub-text-dark"
						onChange={(e) => setData({ artistQuery: e.currentTarget.value })}
						placeholder="Which artist intrigues you?"
						type="search"
						value={artistQuery}
					/>
					<div className="absolute inset-y-0 end-0 place-content-center">
						<Tooltip text="Search">
							<FlatButton onClick={getArtists}>
								<DiscovraphyIcon className="flat-icon" />
							</FlatButton>
						</Tooltip>
					</div>
				</p>
				<div className="flex min-h-0 flex-1 items-center justify-center">
					{isLoading && <Spinner />}
					{!isLoading && artistResults.length > 0 && (
						<ResultContainer>
							{artistResults?.map((artist) => (
								<ArtistCard
									artist={artist}
									isSelected={artist.id === selectedArtistId}
									key={artist.id}
									onClick={() => onSelectArtist(artist)}
								/>
							))}
						</ResultContainer>
					)}
				</div>
			</div>
		</div>
	);
}
