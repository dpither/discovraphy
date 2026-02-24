import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Header from "../layouts/Header";
import { sdk } from "../lib/spotifyApi";

type CallbackStatus = "LOADING" | "ACCESS_DENIED" | "NON_PREMIUM";

// TODO: Handle deprecation of user.product

function StatusContent({ status }: { status: CallbackStatus }) {
	switch (status) {
		case "LOADING":
			return (
				<div className="flex h-full items-center justify-center">
					<Spinner />
				</div>
			);
		case "ACCESS_DENIED":
			return (
				<div className="flex h-full flex-col items-center justify-center gap-4 p-4">
					<h1 className="mx-auto w-80">Permissions Denied</h1>
					<p className="w-80">
						Discovraphy requires access to your user, playback, library and
						playlist data to perform actions on your behalf to streamline your
						music discovery experience.
					</p>
					<Button onClick={sdk.authenticate} text="Retry"></Button>
				</div>
			);
		case "NON_PREMIUM":
			return (
				<div className="flex h-full flex-col items-center justify-center gap-4 p-4">
					<h1 className="mx-auto w-80">Spotify Premium Required</h1>
					<p className="w-80">
						The account attempting to use Discovraphy does not have Spotify
						Premium. Discovraphy requires Spotify Premium to deliver it's
						experience.
					</p>
					<Button onClick={() => {}} text="Go Home"></Button>
				</div>
			);
	}
}

export default function Callback() {
	const navigate = useNavigate();
	const [status, setStatus] = useState<CallbackStatus>("LOADING");

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const error = params.get("error");
		if (error === "access_denied") {
			setStatus("ACCESS_DENIED");
			return;
		}

		// MOVE TO SETUP STORE TO HANDLE INVALID
		const validateUser = async () => {
			const user = await sdk.currentUser.profile();
			if (user.product !== "premium") {
				setStatus("NON_PREMIUM");
				console.log(user);
				return;
			}
			navigate("/setup/select-artist");
		};
		validateUser();
	}, [navigate]);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<StatusContent status={status} />
		</div>
	);
}
