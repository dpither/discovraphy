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
				<div className="relative flex w-full items-center justify-between">
					<div className="absolute z-0 h-1 w-full rounded-full bg-sub-text-light dark:bg-sub-text-dark"></div>
					<div
						className="absolute h-1 w-full rounded-full bg-blue transition-all"
						style={{
							width: `${(currentStepIndex / (stepOrder.length - 1)) * 100}%`,
						}}
					></div>
					{stepOrder.map((step, index) => {
						const isCompleted = index < currentStepIndex;
						const isActive = index === currentStepIndex;
						return (
							<div
								className={`z-10 size-2 rounded-full border transition-all ${isCompleted ? "border-blue bg-blue" : isActive ? "border-black bg-blue dark:border-white" : "border-sub-text-light bg-sub-text-light dark:border-sub-text-dark dark:bg-sub-text-dark"}`}
								key={step}
							></div>
						);
					})}
				</div>
				<div className="flex items-center justify-end gap-4 place-self-center">
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
