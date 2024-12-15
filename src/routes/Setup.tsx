import Header from "../components/Header";
import BasicSearch from "../components/setup_pages/BasicSearch";
import SpotifyFooter from "../components/SpotifyFooter";
// import Stepper from "../components/Stepper";

export default function Setup() {
  return (
    <div className="flex h-full flex-col justify-between">
      <Header />
      <BasicSearch />
      {/* <Stepper></Stepper> */}
      <SpotifyFooter />
    </div>
  );
}
