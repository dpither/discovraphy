import { Link } from "react-router";
import Button from "../components/Button";
import Header from "../components/Header";
import SpotifyFooter from "../components/SpotifyFooter";

export default function Error() {
  return (
    <div className="flex flex-col justify-between h-screen">
      <Header />
      <div className="mx-4 my-4 flex flex-col items-center gap-4 text-black dark:text-white">
        <h1 className="text-3xl font-bold md:text-5xl">
          Error 404 - Page not found
        </h1>
        <p className="max-w-md text-lg md:text-2xl md:max-w-xl">
          We could not discover the page you were looking for. Get back on track
          by returning home.
        </p>
        <Link to={`../`}>
          <Button
            text="Go Home"
            onClick={() => {
              console.log("Pressed go home");
            }}
          ></Button>
        </Link>
      </div>
      <SpotifyFooter />
    </div>
  );
}
