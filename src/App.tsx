import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./routes/Home";
import PageNotFound from "./routes/PageNotFound";
import Setup from "./routes/Setup";
import Swipe from "./routes/Swipe";
import { swipeLoader } from "./routes/swipeLoader";

const routes = [
	{
		path: "/",
		element: <Home />,
		errorElement: <PageNotFound />,
	},
	{
		path: "/setup",
		element: <Setup />,
		errorElement: <PageNotFound />,
	},
	{
		path: "/swipe",
		element: <Swipe />,
		errorElement: <PageNotFound />,
		loader: swipeLoader,
	},
];

const router = createBrowserRouter(routes, {
	future: {
		v7_relativeSplatPath: true,
		v7_fetcherPersist: true,
		v7_normalizeFormMethod: true,
		v7_partialHydration: true,
	},
	basename: "/discovraphy/",
});

export default function App() {
	return <RouterProvider router={router} />;
}
