import { useNavigate } from "react-router";
import catJAM from "../assets/catJAM.webp";
import Button from "../components/Button";
import TextCarousel from "../components/TextCarousel";
import { useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";
import SpotifyFooter from "../layouts/SpotifyFooter";
import { getAccessToken, initSpotifyClient } from "../lib/spotifyApi";

const TEXTS = [
	"earworm",
	"chill vibe",
	"club banger",
	"hype song",
	"hidden gem",
];

export default function Home() {
	const navigate = useNavigate();

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
			<div className="flex flex-col items-center gap-4 md:flex-row-reverse md:justify-center">
				<div className="flex h-full w-72 flex-col justify-between gap-4 md:w-96 md:text-left">
					<div className="flex select-none flex-col">
						<h1 className="text-4xl md:text-5xl">
							Discover your next{" "}
							<TextCarousel
								stopDuration={3000}
								texts={TEXTS}
								transitionDuration={0.5}
							/>
						</h1>
					</div>
					<p className="md:text-xl">
						Swipe through an artist's discography and discover something new.
					</p>
					<div>
						<Button onClick={authenticate} text="Get Started" />
					</div>
				</div>
				<div className="flex w-72 max-w-96 select-none md:w-2/5">
					<img
						alt="catJAM"
						className="aspect-square w-full rounded-sm object-cover text-white lg:rounded-lg dark:text-black"
						draggable={false}
						src={catJAM}
					/>
				</div>
			</div>
			<SpotifyFooter />
		</div>
	);
}
