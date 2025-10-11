import SpotifyLogo from "../assets/spotify_logo.svg?react";
import PlayIcon from "../assets/play_icon.svg?react";
import PauseIcon from "../assets/pause_icon.svg?react";
import SkipPreviousIcon from "../assets/skip_previous_icon.svg?react";
import SkipNextIcon from "../assets/skip_next_icon.svg?react";
import dummy_cover from "../assets/dummy_cover.jpg";
import Button from "./Button";
import FlatButton from "./FlatButton";
import ProgressBar from "./ProgressBar";
import { useState } from "react";
import { motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import { usePlayerStore } from "../hooks/usePlayerStore";

interface SpotifyPlayerCardProps {
  player: Spotify.Player | undefined;
}

export default function SpotifyPlayerCard({ player }: SpotifyPlayerCardProps) {
  // PROBABLY TAKES IN A TRACK?
  const {
    queue,
    currentIndex: currentTrackIndex,
    currentTrack,
    currentTimeMs,
    isPlaying,
    play,
    pause,
    next,
    prev,
    setCurrentTimeMs,
    seek,
  } = usePlayerStore();
  const [scope, animate] = useAnimate();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-11.25, 11.25]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  return (
    <motion.div
      ref={scope}
      className="flex origin-bottom flex-col gap-2 rounded-sm border border-black p-4 select-none hover:cursor-grab hover:active:cursor-grabbing lg:rounded-lg dark:border-white"
      style={{
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
    >
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
        <p className="text-sub-text-light dark:text-sub-text-dark line-clamp-1 text-sm">
          ODESZA
        </p>
      </div>
      <div className="flex w-full flex-col">
        <ProgressBar
          durationMs={180000}
          currentTimeMs={currentTimeMs}
          handleSeek={(timeMs: number) => {
            setCurrentTimeMs(timeMs);
          }}
          handleSeekConfirm={(timeMs: number) => {
            seek(timeMs)
          }}
        />
      </div>
      <div className="flex gap-2 place-self-center">
        {/* skip previous */}
        <FlatButton
          onPointerDownCapture={(e) => e.stopPropagation()}
          onClick={() => {
            prev()
          }}
          // disabled={currentTrackIndex === 0}
        >
          <SkipPreviousIcon className="fill-sub-text-light dark:fill-sub-text-dark hover:fill-black hover:dark:fill-white" />
        </FlatButton>
        {/* play/pause */}
        {isPlaying ? (
          <Button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={() => {
              pause();
            }}
          >
            <PauseIcon className="fill-white dark:fill-black" />
          </Button>
        ) : (
          <Button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={() => {
              play();
            }}
          >
            <PlayIcon className="fill-white dark:fill-black" />
          </Button>
        )}
        {/* skip next */}
        <FlatButton
          onPointerDownCapture={(e) => e.stopPropagation()}
          onClick={() => {
            next()
          }}
          // disabled={currentTrackIndex >= queue.length - 1}
        >
          <SkipNextIcon className="fill-sub-text-light dark:fill-sub-text-dark hover:fill-black hover:dark:fill-white" />
        </FlatButton>
      </div>
    </motion.div>
  );
}
