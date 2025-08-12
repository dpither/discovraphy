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
      <div className="flex flex-1 flex-col items-center">
        <form className="flex flex-1 w-full max-w-2xl flex-col" onSubmit={onSubmit}>
          {/* <p className="absolute bottom-2 right-1/2 text-sm text-black md:text-lg dark:text-white">
            {currentStepIndex + 1}/{steps.length}
          </p> */}
          <div className="flex flex-1">{currentStep}</div>
          <div className="mt-4 flex justify-center">
            {isFirstStep ? (
              <div></div>
            ) : (
              <Button text="Back" onClick={back} type="button" />
            )}
            <Button
              text={isLastStep ? "Start" : "Next"}
              type="button"
              disabled={false}
              onClick={next}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
