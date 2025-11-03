import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CineMind from "./CineMind.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CineMind />
    </BrowserRouter>
  </StrictMode>
);
