import SpotifyLogo from "../assets/spotify_logo.svg?react"

export default function SpotifyFooter() {
  return (
    <footer className="my-2 flex justify-center">
      <p className="text-dark text-base dark:text-white">Powered by</p>
      <SpotifyLogo className="mx-1 w-18"/>
    </footer>
  );
}
