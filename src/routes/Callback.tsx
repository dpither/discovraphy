import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";
import { sdk } from "../lib/spotifyApi";

type CallbackStatus =
	| "LOADING"
	| "ACCESS_DENIED"
	| "NOT_PREMIUM"
	| "NOT_AUTHENTICATED";

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
				<div className="flex h-full flex-col items-center justify-center gap-2 p-4">
					<h1>Permissions Denied</h1>
					<p className="max-w-96">
						Discovraphy requires access to your user, playback, library and
						playlist data to perform actions on your behalf to streamline your
						music discovery experience.
					</p>
					<Button
						onClick={() => {
							sdk.authenticate();
						}}
						text="Retry"
					></Button>
				</div>
			);
		case "NOT_PREMIUM":
			return (
				<div className="flex h-full flex-col items-center justify-center gap-2 p-4">
					<h1>Spotify Premium Required</h1>
					<p className="max-w-96">
						This account does not have Spotify Premium. Discovraphy requires
						Spotify Premium to deliver it's experience.
					</p>
					<Link to={`/`}>
						<Button text="Go Home"></Button>
					</Link>
				</div>
			);

		case "NOT_AUTHENTICATED":
			return (
				<div className="flex h-full flex-col items-center justify-center gap-2 p-4">
					<h1>User Not Authenticated</h1>
					<p className="max-w-96">
						This account is not authenticated with Discovraphy. Discovraphy uses
						the Spotify API in development mode, which allows a maximum of 5
						users to authenticate with Discovraphy. Check out the Github for
						more information.
					</p>
					<div className="flex gap-4">
						<Link to={`/`}>
							<Button text="Go Home"></Button>
						</Link>
						<a
							href="https://github.com/dpither/discovraphy"
							rel="noopener"
							target="_blank"
						>
							<Button onClick={() => {}} text="Github"></Button>
						</a>
					</div>
				</div>
			);
	}
}

export default function Callback() {
	const navigate = useNavigate();
	const { setData } = useSetupStore();
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
			try {
				const user = await sdk.currentUser.profile();
				console.log(user);
				if (user.product !== "premium") {
					setStatus("NOT_PREMIUM");
					return;
				}
				setData({ userAuthenticated: true });
				navigate("/setup/select-artist");
			} catch (error) {
				if (error instanceof Error) {
					const i = error.message.indexOf(":");
					if (i > -1) {
						const body = error.message.substring(i + 2);
						if (
							body ===
							"Check settings on developer.spotify.com/dashboard, the user may not be registered."
						) {
							setStatus("NOT_AUTHENTICATED");
						}
					}
				}
			}
		};
		validateUser();
	}, [navigate, setData]);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<StatusContent status={status} />
		</div>
	);
}
