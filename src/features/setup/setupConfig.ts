import type { SetupData } from "../../hooks/useSetupStore";

export enum SetupStep {
	SelectArtist = "selectArtist",
	BuildQueue = "buildQueue",
	SelectDestination = "selectDestination",
}

export const stepOrder = [
	SetupStep.SelectArtist,
	SetupStep.BuildQueue,
	SetupStep.SelectDestination,
];

export const stepToPath: Record<SetupStep, string> = {
	[SetupStep.SelectArtist]: "select-artist",
	[SetupStep.BuildQueue]: "build-queue",
	[SetupStep.SelectDestination]: "select-destination",
};

export const pathToStep = Object.fromEntries(
	Object.entries(stepToPath).map(([step, path]) => [path, step]),
) as Record<string, SetupStep>;

export const stepValid: Record<SetupStep, (state: SetupData) => boolean> = {
	[SetupStep.SelectArtist]: (state) => state.selectedArtistId !== "",
	[SetupStep.BuildQueue]: (state) => state.selectedAlbumIds.length > 0,
	[SetupStep.SelectDestination]: (state) => state.selectedDestination !== "",
};
