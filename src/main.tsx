import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorPage from "./pages/ErrorPage.tsx";
import "@/assets/css/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorPage />
  </StrictMode>
);
