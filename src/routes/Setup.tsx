import Header from "../layouts/Header";
import SelectArtistForm from "../features/setup_steps/SelectArtistForm";
import { useSetupForm } from "../hooks/useSetupForm";
import Button from "../components/Button";
import { FormEvent, useState } from "react";
import { Artist, Playlist, Tracks } from "@spotify/web-api-ts-sdk";

type SetupData = {
  selectedArtist: Artist | null;
  selectedTracks: Tracks[];
  destination: Playlist | "SAVE" | null;
};

const INITIAL_SETUP_DATA: SetupData = {
  selectedArtist: null,
  selectedTracks: [],
  destination: null,
};

export default function Setup() {
  const [setupData, setSetupData] = useState(INITIAL_SETUP_DATA);

  function updateSetupData(fields: Partial<SetupData>) {
    setSetupData((prevData) => {
      return { ...prevData, ...fields };
    });
  }

  const {
    steps,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    next,
    back,
  } = useSetupForm([
    <SelectArtistForm
      selectedArtist={setupData.selectedArtist}
      updateSetupData={updateSetupData}
    />,
    <SelectArtistForm
      selectedArtist={setupData.selectedArtist}
      updateSetupData={updateSetupData}
    />,
    <SelectArtistForm
      selectedArtist={setupData.selectedArtist}
      updateSetupData={updateSetupData}
    />,
  ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <form className="flex flex-col min-h-0 flex-1 my-4 mx-4 gap-4 lg:mx-32" onSubmit={onSubmit}>
        {currentStep}
        <div className="flex justify-end gap-4 items-center">
          {isFirstStep ? (
            <div></div>
          ) : (
            <Button text="Back" onClick={back} type="button" />
          )}
          <p className="flex text-sm text-black md:text-lg dark:text-white">{currentStepIndex + 1}/{steps.length}</p>
          <Button
            text={isLastStep ? "Start" : "Next"}
            type="button"
            disabled={false}
            onClick={next}
          />
        </div>
      </form>
    </div>
  );
}
