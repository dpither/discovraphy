import { Link } from "react-router";
import Button from "../components/Button";
import Header from "../layouts/Header";
import SpotifyFooter from "../layouts/SpotifyFooter";

export default function PageNotFound() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<Header />
			<div className="mx-4 my-4 flex flex-col items-center gap-4 text-center text-black dark:text-white">
				<h1 className="font-bold text-2xl md:text-5xl">
					Error 404 - Page not found
				</h1>
				<p className="max-w-md md:max-w-xl md:text-2xl">
					The page you were looking for could not be discovered. Return home to
					get back on track.
				</p>
				<Link to={`/`}>
					<Button
						onClick={() => {
							console.log("Pressed go home");
						}}
						text="Go Home"
					></Button>
				</Link>
			</div>
			<SpotifyFooter />
		</div>
	);
}
