import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EcgQiApp from "./EcgQiApp";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EcgQiApp staticHosting />
  </StrictMode>,
);
