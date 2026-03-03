import { Navigate, Outlet } from "react-router";
import {
	stepOrder,
	stepToPath,
	stepValid,
} from "../features/setup/setupConfig";
import { useSetupStore } from "../hooks/useSetupStore";
import Header from "../layouts/Header";

export default function Swipe() {
	const setupStore = useSetupStore();
	const { userAuthenticated } = setupStore;

	if (!userAuthenticated) {
		return <Navigate replace to={`/callback`} />;
	}
	const firstInvalidIndex = stepOrder.findIndex(
		(step) => !stepValid[step](setupStore),
	);

	if (firstInvalidIndex !== -1) {
		return (
			<Navigate
				replace
				to={`/setup/${stepToPath[stepOrder[firstInvalidIndex]]}`}
			/>
		);
	}

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Outlet />
		</div>
	);
}
