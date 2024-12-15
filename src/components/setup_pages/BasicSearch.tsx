import Icon from "../../assets/Icon";
import TrackCard from "../TrackCard";
import dummy from "../../assets/dummy_cover.jpg";
import tailwindConfig from "../../../tailwind.config";
import { useState } from "react";

const dummy_data = [
  { img: dummy, name: "Intro", artist: "ODESZA", album: "A Moment Apart" },
  {
    img: dummy,
    name: "A Moment Apart",
    artist: "ODESZA",
    album: "A Moment Apart",
  },
  {
    img: dummy,
    name: "Higher Ground",
    artist: "ODESZA",
    album: "A Moment Apart",
  },
  { img: dummy, name: "Boy", artist: "ODESZA", album: "A Moment Apart" },
  {
    img: dummy,
    name: "Line Of Sight",
    artist: "ODESZA",
    album: "A Moment Apart",
  },
  { img: dummy, name: "Late Night", artist: "ODESZA", album: "A Moment Apart" },
];

export default function BasicSearch() {
  const [selectedId, setSelectedId] = useState(-1);

  const handleSelectTrack = (key: number) => {
    selectedId === key ? setSelectedId(-1) : setSelectedId(key);
  };

  return (
    <div className="m-4 flex flex-col items-center gap-4">
      <form className="relative w-full max-w-2xl">
        <input
          type="search"
          className="w-full rounded-lg border-2 border-black bg-black bg-opacity-0 p-4 pe-16 text-sm md:text-base dark:border-white dark:text-white"
          placeholder="What song intrigues you?"
          required
        />
        <div className="absolute inset-y-0 end-0 place-content-center p-2">
          <button
            className="rounded-lg bg-blue p-2 hover:bg-blue-h active:brightness-75"
            onClick={() => {}}
          >
            <Icon fill={tailwindConfig.theme.colors.white} />
          </button>
        </div>
      </form>
      <div>
        <p className="text-dark text-sm md:text-lg dark:text-white">
          Show us what your're vibing with, and we'll help you discover
          something similar.
        </p>
      </div>
      <div className="max-h-80 max-w-2xl rounded-lg border-2 border-black dark:border-white">
        <div className="scrollbar grid h-full grid-cols-2 gap-2 overflow-y-scroll p-4 md:grid-cols-4">
          {dummy_data.map((track, idx) => (
            <TrackCard
              key={idx}
              img={track.img}
              name={track.name}
              artist={track.artist}
              album={track.album}
              isSelected={selectedId === idx}
              onClick={() => {
                handleSelectTrack(idx);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
