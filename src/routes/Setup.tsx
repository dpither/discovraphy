import Header from "../layouts/Header";
import SelectArtistForm from "../features/setup_steps/SelectArtistForm";
import { useSetupForm } from "../hooks/useSetupForm";
import Button from "../components/Button";
import { FormEvent, useMemo, useState } from "react";
import { Artist, SimplifiedPlaylist, Tracks } from "@spotify/web-api-ts-sdk";
import BuildQueueForm from "../features/setup_steps/BuildQueueForm";
import SelectDestinationForm from "../features/setup_steps/SelectDestinationForm";

type SetupData = {
  selectedArtist: Artist | null;
  selectedTracks: Tracks[];
  destination: SimplifiedPlaylist | "SAVE" | null;
};

const INITIAL_SETUP_DATA: SetupData = {
  selectedArtist: null,
  selectedTracks: [],
  destination: "SAVE",
};

export default function Setup() {
  const [setupData, setSetupData] = useState(INITIAL_SETUP_DATA);

  function updateSetupData(fields: Partial<SetupData>) {
    setSetupData((prevData) => {
      return { ...prevData, ...fields };
    });
  }

  const steps = [
    <SelectArtistForm
      selectedArtist={setupData.selectedArtist}
      updateSetupData={updateSetupData}
    />,
    <BuildQueueForm artist={setupData.selectedArtist} />,
    <SelectDestinationForm
      destination={setupData.destination}
      updateSetupData={updateSetupData}
    />,
  ];

  const { currentStepIndex, currentStep, isFirstStep, isLastStep, next, back } =
    useSetupForm(steps);

  const isStepValid = useMemo(() => {
    switch (currentStepIndex) {
      case 0:
        return setupData.selectedArtist !== null;
      case 1:
        return true;
      case 2:
        return setupData.destination !== null;
      default:
        console.error("Triggered step validation for invalid step");
        return false;
    }
  }, [currentStepIndex, setupData]);

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
        {currentStep}
        <div className="flex items-center justify-end gap-4">
          {isFirstStep ? (
            <div></div>
          ) : (
            <Button text="Back" onClick={back} type="button" />
          )}
          <p className="flex text-sm text-black md:text-lg dark:text-white">
            {currentStepIndex + 1}/{steps.length}
          </p>
          <Button
            text={isLastStep ? "Start" : "Next"}
            type="button"
            disabled={!isStepValid}
            onClick={next}
          />
        </div>
      </form>
    </div>
  );
}
