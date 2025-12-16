import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { App } from "./App.tsx";

const rootElem = document.getElementById("root");

if (rootElem) {
	const root = createRoot(rootElem);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
