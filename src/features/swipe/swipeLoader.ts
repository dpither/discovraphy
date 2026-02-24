import { redirect } from "react-router";
import { sdk } from "../../lib/spotifyApi";

export async function swipeLoader() {
	const access_token = await sdk.getAccessToken();
	if (!access_token) {
		throw redirect("/");
	}
}
