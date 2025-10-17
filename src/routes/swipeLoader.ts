import { redirect } from "react-router";
import { getAccessToken } from "../lib/spotifyApi";

export async function swipeLoader() {
	const access_token = await getAccessToken();
	if (!access_token) {
		throw redirect("/");
	}
}
