import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Self-hosted fonts (no requests to Google) — weights used: Inter 300/400/500/600/700, Orbitron 500/600/700/800.
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/orbitron/500.css";
import "@fontsource/orbitron/600.css";
import "@fontsource/orbitron/700.css";
import "@fontsource/orbitron/800.css";
import "./index.css";
import "./i18n";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
