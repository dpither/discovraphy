import { Outlet } from "react-router";
import Header from "../layouts/Header";

export default function Swipe() {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Outlet />
		</div>
	);
}
