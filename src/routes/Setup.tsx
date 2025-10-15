import { type FormEvent, useMemo } from "react";
import Button from "../components/Button";
import BuildQueueForm from "../features/setup/BuildQueueForm";
import SelectArtistForm from "../features/setup/SelectArtistForm";
import SelectDestinationForm from "../features/setup/SelectDestinationForm";
import { useSetupForm } from "../hooks/useSetupForm";
import { useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";

export default function Setup() {
	const selectedArtistId = useSetupStore((state) => state.selectedArtist);
	const destination = useSetupStore((state) => state.destination);

	const steps = [SelectArtistForm, BuildQueueForm, SelectDestinationForm];

	const { currentStepIndex, CurrentStep, isFirstStep, isLastStep, next, back } =
		useSetupForm(steps);

	const isStepValid = useMemo(() => {
		switch (currentStepIndex) {
			case 0:
				return selectedArtistId !== null;
			case 1:
				return true;
			case 2:
				return destination !== null;
			default:
				console.error("Triggered step validation for invalid step");
				return false;
		}
	}, [currentStepIndex, selectedArtistId, destination]);

	function onSubmit(e: FormEvent) {
		e.preventDefault();
	}

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<form
				className="mx-4 my-4 flex min-h-0 flex-1 flex-col gap-4 lg:mx-32"
				onSubmit={onSubmit}
			>
				<CurrentStep />
				<div className="flex items-center justify-end gap-4">
					{isFirstStep ? (
						<div></div>
					) : (
						<Button onClick={back} text="Back" type="button" />
					)}
					<p className="flex text-black text-sm md:text-lg dark:text-white">
						{currentStepIndex + 1}/{steps.length}
					</p>
					<Button
						disabled={!isStepValid}
						onClick={next}
						text={isLastStep ? "Start" : "Next"}
						type="button"
					/>
				</div>
			</form>
		</div>
	);
}
