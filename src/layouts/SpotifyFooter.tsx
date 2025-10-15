import SpotifyLogo from "../assets/spotify_logo.svg?react";

export default function SpotifyFooter() {
	return (
		<footer className="my-2 flex items-center justify-center">
			<p className="text-base text-dark dark:text-white">Powered by</p>
			<SpotifyLogo className="ms-1 h-6" />
		</footer>
	);
}
