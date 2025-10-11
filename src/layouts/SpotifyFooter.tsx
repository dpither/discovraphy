import SpotifyLogo from "../assets/spotify_logo.svg?react"

export default function SpotifyFooter() {
  return (
    <footer className="my-2 flex justify-center items-center">
      <p className="text-dark text-base dark:text-white">Powered by</p>
      <SpotifyLogo className="h-6 ms-1"/>
    </footer>
  );
}
