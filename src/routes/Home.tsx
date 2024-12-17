import Button from "../components/Button";
import Header from "../components/Header";
import SpotifyFooter from "../components/SpotifyFooter";
import catJAM from "../assets/catJAM.gif";
import Textra from "react-textra";
import { Link, useNavigate } from "react-router";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default function Home() {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const scopes = ["user-read-private", "user-read-email"];

  const sdk = SpotifyApi.withUserAuthorization(
    clientId,
    "http://localhost:3000/discovraphy/setup",
    scopes,
  );

  const texts = [
    "earworm",
    "chill vibe",
    "club banger",
    "hype song",
    "hidden gem",
  ];

  async function authenticate() {
    if (await sdk.getAccessToken() == null) {
      await sdk.authenticate();
    } else {
      navigate("/setup");
    }
  }

  return (
    <div className="flex h-screen flex-col justify-between">
      <Header />
      <section className="m-4 flex flex-col items-center gap-4 md:flex-row-reverse md:justify-center">
        <div className="flex h-full w-72 flex-col justify-between gap-4 md:w-96 md:text-left">
          <div className="text-black flex flex-col text-3xl font-bold leading-tight md:text-5xl dark:text-white">
            <h1>
              Discover your next{" "}
              <span>
                <Textra effect="downTop" stopDuration={2000} data={texts} />
              </span>
            </h1>
          </div>
          <p className="text-black text-sm md:text-lg dark:text-white">
            Swipe through your favourite artist's discography to discover something new.
          </p>
          <div>
            <Button text="Get Started" onClick={authenticate} />
          </div>
        </div>
        <div className="flex w-72 max-w-96 md:w-2/5">
          <img
            className="aspect-square w-full rounded-lg object-cover"
            src={catJAM}
          />
        </div>
      </section>
      <SpotifyFooter />
    </div>
  );
}
