// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
createRoot(container).render(
	// AVOID USE EFFECT 2x in dev
	// <StrictMode>
	//   <App />
	// </StrictMode>,
	<App />,
);
