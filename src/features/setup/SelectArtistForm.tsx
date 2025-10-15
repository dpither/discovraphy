import type { Artist } from "@spotify/web-api-ts-sdk";
import DiscovraphyIcon from "../../assets/discovraphy_icon.svg?react";
import ArtistCard from "../../components/ArtistCard";
import FlatButton from "../../components/FlatButton";
import Spinner from "../../components/Spinner";
import { useSetupStore } from "../../hooks/useSetupStore";
import { getArtists } from "../../lib/spotifyApi";

export default function SelectArtistForm() {
	const isLoading = useSetupStore((state) => state.isLoading);
	const setData = useSetupStore((state) => state.setData);
	const artistQuery = useSetupStore((state) => state.artistQuery);
	const artistResults = useSetupStore((state) => state.artistResults);
	const selectedArtist = useSetupStore((state) => state.selectedArtist);

	async function onSearch() {
		if (isLoading || artistQuery.trim() === "") return;
		setData({ selectedArtist: null, artistResults: [], isLoading: true });
		setData({ artistResults: await getArtists(artistQuery), isLoading: false });
	}

	function onSelectArtist(artist: Artist) {
		if (artist.id === selectedArtist?.id) {
			setData({ selectedArtist: null });
		} else {
			setData({ selectedArtist: artist });
		}
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<h1 className="font-semibold text-3xl text-black dark:text-white">
				Select an Artist
			</h1>
			<div className="flex min-h-0 flex-1 flex-col rounded-sm border border-black lg:rounded-lg dark:border-white">
				<div className="relative p-4">
					<input
						className="w-full rounded-sm border border-black bg-opacity-0 p-2 pe-10 text-sm placeholder-sub-text-light md:text-base lg:rounded-lg dark:border-white dark:text-white dark:placeholder-sub-text-dark"
						onChange={(e) => setData({ artistQuery: e.currentTarget.value })}
						placeholder="Which artist intrigues you?"
						type="search"
						value={artistQuery}
					/>
					<div className="absolute inset-y-0 end-4 place-content-center">
						<FlatButton onClick={onSearch}>
							<DiscovraphyIcon className="fill-sub-text-light hover:fill-black dark:fill-sub-text-dark hover:dark:fill-white" />
						</FlatButton>
					</div>
				</div>
				<div className="flex min-h-0 flex-1 items-center justify-center">
					{isLoading && <Spinner />}
					{!isLoading && (
						<div className="no-scrollbar grid h-full grid-cols-2 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 2xl:grid-cols-5">
							{artistResults?.map((artist) => (
								<ArtistCard
									artist={artist}
									isSelected={artist.id === selectedArtist?.id}
									key={artist.id}
									onClick={() => onSelectArtist(artist)}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
