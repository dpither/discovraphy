import { Link } from "react-router";
import Button from "../components/Button";
import Header from "../layouts/Header";
import SpotifyFooter from "../layouts/SpotifyFooter";

export default function PageNotFound() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<Header />
			<div className="mx-4 my-4 flex flex-col items-center gap-4 text-black dark:text-white">
				<h1 className="font-bold text-3xl md:text-5xl">
					Error 404 - Page not found
				</h1>
				<p className="max-w-md text-lg md:max-w-xl md:text-2xl">
					We could not discover the page you were looking for. Get back on track
					by returning home.
				</p>
				<Link to={`../`}>
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
