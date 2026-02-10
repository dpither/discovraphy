import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import BuildQueueForm from "./features/setup/BuildQueueForm";
import SelectArtistForm from "./features/setup/SelectArtistForm";
import SelectDestinationForm from "./features/setup/SelectDestinationForm";
import { swipeLoader } from "./features/swipe/swipeLoader";
import Callback from "./routes/Callback";
import Home from "./routes/Home";
import PageNotFound from "./routes/PageNotFound";
import Setup from "./routes/Setup";
import Swipe from "./routes/Swipe";

const routes = [
	{
		path: "/",
		element: <Home />,
		errorElement: <PageNotFound />,
	},
	{
		path: "/setup",
		element: <Setup />,
		children: [
			{ index: true, element: <Navigate replace to="select-artist" /> },
			{ path: "select-artist", element: <SelectArtistForm /> },
			{ path: "build-queue", element: <BuildQueueForm /> },
			{ path: "select-destination", element: <SelectDestinationForm /> },
		],
		errorElement: <PageNotFound />,
	},
	{
		path: "/swipe",
		element: <Swipe />,
		errorElement: <PageNotFound />,
		loader: swipeLoader,
	},
	{
		path: "/callback",
		element: <Callback />,
		errorElement: <PageNotFound />,
	},
];

const router = createBrowserRouter(routes, {
	// future: {
	// 	v7_relativeSplatPath: true,
	// 	v7_fetcherPersist: true,
	// 	v7_normalizeFormMethod: true,
	// 	v7_partialHydration: true,
	// },
	basename: "/discovraphy/",
});

export default function App() {
	return <RouterProvider router={router} />;
}
