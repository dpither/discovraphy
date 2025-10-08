import SpotifyLogo from "../assets/spotify_logo.svg?react";
import PlayIcon from "../assets/play_icon.svg?react";
import SkipPreviousIcon from "../assets/skip_previous_icon.svg?react";
import SkipNextIcon from "../assets/skip_next_icon.svg?react";
import dummy_cover from "../assets/dummy_cover.jpg";
import RangeSlider from "./RangeSlider";
import Button from "./Button";
import FlatButton from "./FlatButton";

export default function SpotifyPlayer() {
  // PROBABLY TAKES IN A TRACK?
  var range_slider_val = 15000;
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-black p-4 select-none lg:rounded-lg dark:border-white">
      <SpotifyLogo className="w-18 place-self-center" />
      <img
        className="w-64 rounded-sm lg:rounded-lg"
        draggable={false}
        src={dummy_cover}
      />
      <div className="ml-1 flex flex-col text-left">
        <p className="line-clamp-1 font-semibold text-black dark:text-white">
          A Moment Apart
        </p>
        <p className="text-sub-text-light dark:text-sub-text-dark line-clamp-1">
          ODESZA
        </p>
      </div>
      <div className="flex w-full flex-col">
        <RangeSlider value={range_slider_val} max={180000} />
      </div>
      <div className="flex gap-2 place-self-center">
        <FlatButton onClick={() => {}}>
          <SkipPreviousIcon />
        </FlatButton>
        <Button onClick={() => {}}>
          <PlayIcon className="fill-white dark:fill-black" />
        </Button>
        <FlatButton onClick={() => {}}>
          <SkipNextIcon className="fill-sub-text-light group-hover:fill-black group-hover:dark:fill-white dark:fill-sub-text-dark"/>
        </FlatButton>
      </div>
    </div>
  );
}
