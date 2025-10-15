import { useNavigate } from "react-router";
import catJAM from "../assets/catJAM.webp";
import Button from "../components/Button";
import TextCarousel from "../components/TextCarousel";
import Header from "../layouts/Header";
import SpotifyFooter from "../layouts/SpotifyFooter";
import { initSpotifyClient, sdk } from "../lib/spotifyApi";

export default function Home() {
	const navigate = useNavigate();

	const texts = [
		"earworm",
		"chill vibe",
		"club banger",
		"hype song",
		"hidden gem",
	];

	async function authenticate() {
		if ((await sdk.getAccessToken()) == null) {
			await initSpotifyClient();
		} else {
			navigate("/setup");
		}
	}

	return (
		<div className="flex h-screen flex-col justify-between">
			<Header />
			<div className="m-4 flex flex-col items-center gap-4 md:flex-row-reverse md:justify-center">
				<div className="flex h-full w-72 flex-col justify-between gap-4 md:w-96 md:text-left">
					<div className="flex select-none flex-col font-semibold text-3xl text-black leading-tight md:text-5xl dark:text-white">
						<h1>
							Discover your next{" "}
							<TextCarousel
								stopDuration={3000}
								texts={texts}
								transitionDuration={0.5}
							/>
						</h1>
					</div>
					<p className="text-black text-sm md:text-lg dark:text-white">
						Swipe through your favourite artist's discography to discover
						something new.
					</p>
					<div>
						<Button onClick={authenticate} text="Get Started" />
					</div>
				</div>
				<div className="flex w-72 max-w-96 select-none md:w-2/5">
					<img
						alt="catJAM"
						className="aspect-square w-full rounded-sm object-cover lg:rounded-lg"
						draggable={false}
						src={catJAM}
					/>
				</div>
			</div>
			<SpotifyFooter />
		</div>
	);
}
