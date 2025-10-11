import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // AVOID USEEFFECT 2x in dev
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <App />,
);
