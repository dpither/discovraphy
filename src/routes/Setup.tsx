import { Navigate, Outlet, useNavigate } from "react-router";
import Button from "../components/Button";
import {
	pathToStep,
	SetupStep,
	stepOrder,
	stepToPath,
	stepValid,
} from "../features/setup/setupConfig";
import { useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";

export default function Setup() {
	const navigate = useNavigate();
	const setupStore = useSetupStore();
	const { getAlbums, getPlaylists } = setupStore;

	const currentStep = pathToStep[location.pathname.split("/").slice(-1)[0]];
	const currentStepIndex = stepOrder.indexOf(currentStep);
	const isFirstStep = currentStepIndex === 0;
	const isLastStep = currentStepIndex === stepOrder.length - 1;
	const isStepValid =
		currentStepIndex !== -1 ? stepValid[currentStep](setupStore) : false;

	if (currentStepIndex !== -1) {
		for (let i = 0; i < currentStepIndex; i++) {
			const step = stepOrder[i];
			if (!stepValid[step](setupStore)) {
				return <Navigate replace to={`/setup/${stepToPath[step]}`} />;
			}
		}
	}

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<form
				className="mx-2 my-4 flex min-h-0 flex-1 flex-col gap-4 lg:mx-32"
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<Outlet />
				<div className="flex items-center justify-end gap-4 place-self-center md:place-self-end">
					{isFirstStep ? (
						<div className="min-w-32"></div>
					) : (
						<Button
							onClick={() => {
								if (isFirstStep) return;
								const prevStep = stepOrder[currentStepIndex - 1];
								navigate(`/setup/${stepToPath[prevStep]}`);
							}}
							text="Back"
							type="button"
						/>
					)}
					<p className="flex">
						{currentStepIndex + 1}/{stepOrder.length}
					</p>
					<Button
						disabled={!isStepValid}
						onClick={() => {
							if (!isStepValid) return;

							switch (currentStep) {
								case SetupStep.SelectArtist:
									getAlbums();
									navigate(`/setup/${stepToPath[SetupStep.BuildQueue]}`);
									return;
								case SetupStep.BuildQueue:
									getPlaylists();
									navigate(`/setup/${stepToPath[SetupStep.SelectDestination]}`);
									return;
								case SetupStep.SelectDestination:
									navigate("/swipe");
									return;
								default:
									console.error("Trying to go next from invalid step.");
									return;
							}
						}}
						text={isLastStep ? "Start" : "Next"}
						type="button"
					/>
				</div>
			</form>
		</div>
	);
}
