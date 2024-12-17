import logo from "../assets/spotify_logo.svg";

export default function SpotifyFooter() {
  return (
    <footer className="my-2 flex justify-center">
      <p className="text-dark text-base dark:text-white">Powered by</p>
      <img className="mx-1 w-20" src={logo} alt="spotify_logo" />
    </footer>
  );
}
