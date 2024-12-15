import Button from "../components/Button";
import Header from "../components/Header";
import SpotifyFooter from "../components/SpotifyFooter";
import catJAM from "../assets/catJAM.gif";
import Textra from "react-textra";
import { Link } from "react-router";

const texts = [
  "earworm",
  "chill vibe",
  "club banger",
  "hype song",
  "hidden gem",
];

export default function Home() {
  return (
    <div className="flex h-full flex-col justify-between">
      <Header />
      <section className="m-4 flex flex-col items-center gap-4 md:flex-row-reverse md:justify-center">
        <div className="flex h-full w-72 flex-col justify-between gap-4 md:w-96 md:text-left">
          <div className="text-dark flex flex-col text-3xl font-bold leading-tight md:text-5xl dark:text-white">
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
            <Link to="/setup">
            <Button
              title="Get Started"
              func={() => {
                console.log("Pressed get started");
              }}
            />
            </Link>
          </div>
        </div>
        <div className="flex w-72 max-w-96 md:w-2/5">
          <img
            className="w-full aspect-square rounded-lg object-cover text-black dark:text-white"
            src={catJAM}
          />
        </div>
      </section>
      <SpotifyFooter />
    </div>
  );
}
