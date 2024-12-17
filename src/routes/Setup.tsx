import Header from "../components/Header";
import ArtistSearch from "../components/setup_pages/ArtistSearch";
import SpotifyFooter from "../components/SpotifyFooter";
// import Stepper from "../components/Stepper";

export default function Setup() {
  return (
    <div className="flex flex-col justify-between">
      <Header />
      <div className="flex justify-center">
        <ArtistSearch />
      </div>

      {/* <Stepper></Stepper> */}
      <SpotifyFooter />
    </div>
  );
}
