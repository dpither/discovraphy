import { useState } from "react";
import { useNavigate } from "react-router";
import catJAM from "../assets/catJAM.webp";
import crabPls from "../assets/crabPls.webp";
import pugPls from "../assets/pugPls.webp";
import ratJAM from "../assets/ratJAM.webp";
import vibe from "../assets/VIBE.webp";
import Button from "../components/Button";
import DummyCardQueue from "../features/home/DummyCardQueue";
import type { DummyTrack } from "../features/home/DummyTrackCard";
import TextCarousel from "../features/home/TextCarousel";
import { useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";
import SpotifyFooter from "../layouts/SpotifyFooter";
import { getAccessToken, initSpotifyClient } from "../lib/spotifyApi";

const CARDS: DummyTrack[] = [
	{
		name: "Earworm",
		artists: "Cool Cat",
		image: catJAM,
		currentTimeMs: 90000,
		durationMs: 180000,
	},
	{
		name: "Chill Vibe",
		artists: "Bouncy Bunny",
		image: vibe,
		currentTimeMs: 196000,
		durationMs: 242000,
	},
	{
		name: "Club Banger",
		artists: "Crazy Crab",
		image: crabPls,
		currentTimeMs: 83000,
		durationMs: 201000,
	},
	{
		name: "Hype Song",
		artists: "Rowdy Rat",
		image: ratJAM,
		currentTimeMs: 32000,
		durationMs: 168000,
	},
	{
		name: "Hidden Gem",
		artists: "Playful Pug",
		image: pugPls,
		currentTimeMs: 100200,
		durationMs: 220200,
	},
];

const TEXTS = CARDS.map((track) => {
	return track.name.toLowerCase();
});

export default function Home() {
	const navigate = useNavigate();
	const [index, setIndex] = useState(0);

	const { reset } = useSetupStore();

	async function authenticate() {
		reset();
		if ((await getAccessToken()) == null) {
			await initSpotifyClient();
		} else {
			navigate("/setup");
		}
	}

	return (
		<div className="flex h-screen flex-col justify-between">
			<Header />
			<div className="flex h-full flex-col items-center gap-4 px-4 md:h-auto md:flex-row-reverse md:justify-center">
				<div className="flex h-auto w-72 flex-col justify-between gap-4 md:h-full md:w-96 md:text-left">
					<div className="flex select-none flex-col">
						<h1 className="text-4xl md:text-5xl">
							Discover your
							<br />
							next <TextCarousel index={index} texts={TEXTS} />
						</h1>
					</div>
					<p className="md:text-xl">
						Swipe through an artist's discography <br /> and discover something
						new.
					</p>
					<div>
						<Button onClick={authenticate} text="Get Started" />
					</div>
				</div>
				<div className="flex h-full w-72 select-none items-center justify-center md:w-96">
					<DummyCardQueue cards={CARDS} index={index} setIndex={setIndex} />
				</div>
			</div>
			<SpotifyFooter />
		</div>
	);
}
