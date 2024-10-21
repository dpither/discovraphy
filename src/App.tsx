import StartButton from "./components/StartButton";
import Header from "./components/Header";
import SpotifyFooter from "./components/SpotifyFooter";
import catJAM from "./assets/catJAM.gif";
import Textra from "react-textra";

const texts = [
  "earworm",
  "chill vibe",
  "club banger",
  "hype song",
  "hidden gem",
];

function App() {
  return (
    <div className="flex h-full flex-col justify-between">
      <Header />
      <section className="mx-4 my-8 flex flex-col items-center gap-8 md:flex-row-reverse md:justify-center">
        <div className="flex h-full w-72 md:w-96 flex-col justify-between gap-8 md:text-left">
          <div className="text-dark flex flex-col text-3xl md:text-5xl font-bold leading-tight dark:text-white">
            <h1>
              Discover your next{" "}
              <span>
                <Textra effect="downTop" stopDuration={2000} data={texts} />
              </span>
            </h1>
          </div>
          <p className="text-dark text-lg md:text-2xl dark:text-white">
            Swipe through song suggestions curated for you.
          </p>
          <div>
            <StartButton />
          </div>
        </div>
        <div className="flex w-72 max-w-96 md:w-2/5">
          <img
            className="w-full rounded-lg object-cover"
            src={catJAM}
            alt="catJAM"
          />
        </div>
      </section>
      <SpotifyFooter />
    </div>
  );
}

export default App;
