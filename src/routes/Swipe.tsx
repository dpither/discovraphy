import SpotifyPlayer from "../components/SpotifyPlayer";
import Header from "../layouts/Header";

export default function Swipe() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex justify-center pt-10">
        <SpotifyPlayer />
      </div>
    </div>
  );
}
