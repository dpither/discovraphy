import { type FormEvent, type JSX, useMemo } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import BuildQueueForm from "../features/setup/BuildQueueForm";
import SelectArtistForm from "../features/setup/SelectArtistForm";
import SelectDestinationForm from "../features/setup/SelectDestinationForm";
import { SetupStep, stepOrder, useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";

export default function Setup() {
	const navigate = useNavigate();

	const {
		selectedArtistId,
		selectedDestination,
		selectedAlbumIds,
		currentStep,
		getAlbums,
		getPlaylists,
		nextStep,
		prevStep,
		isFirstStep,
		isLastStep,
	} = useSetupStore();

	const stepForms: Record<SetupStep, JSX.Element> = {
		[SetupStep.SelectArtist]: <SelectArtistForm />,
		[SetupStep.BuildQueue]: <BuildQueueForm />,
		[SetupStep.SelectDestination]: <SelectDestinationForm />,
	};

	const isStepValid = useMemo(() => {
		switch (currentStep) {
			case SetupStep.SelectArtist:
				return selectedArtistId !== "";
			case SetupStep.BuildQueue:
				return selectedAlbumIds.length > 0;
			case SetupStep.SelectDestination:
				return selectedDestination !== null;
			default:
				console.error("Triggered step validation for invalid step");
				return false;
		}
	}, [currentStep, selectedArtistId, selectedDestination, selectedAlbumIds]);

	function onSubmit(e: FormEvent) {
		e.preventDefault();
	}

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<form
				className="mx-2 my-4 flex min-h-0 flex-1 flex-col gap-4 lg:mx-32"
				onSubmit={onSubmit}
			>
				{stepForms[currentStep]}
				<div className="flex items-center justify-end gap-4 place-self-center md:place-self-end">
					{isFirstStep() ? (
						<div className="min-w-32"></div>
					) : (
						<Button onClick={prevStep} text="Back" type="button" />
					)}
					<p className="flex">
						{stepOrder.indexOf(currentStep) + 1}/{Object.keys(stepForms).length}
					</p>
					<Button
						disabled={!isStepValid}
						onClick={() => {
							switch (currentStep) {
								case SetupStep.SelectArtist:
									// Fetch albums
									getAlbums();
									nextStep();
									return;
								case SetupStep.BuildQueue:
									// Fetch playlists
									getPlaylists();
									// We build queue when swipe is rendered atm, figure out prefetching later, maybe needs to be store in persistent storage?
									// getTrackQueue(selectedAlbumIds);
									nextStep();
									break;
								case SetupStep.SelectDestination:
									// Start queue
									navigate("/swipe");
									break;
								default:
									console.error("Trying to go next from invalid step.");
									return;
							}
						}}
						text={isLastStep() ? "Start" : "Next"}
						type="button"
					/>
				</div>
			</form>
		</div>
	);
}
