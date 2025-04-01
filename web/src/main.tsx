import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { Pointer } from "@/components/magicui/pointer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* <Pointer className="fill-blue-500" /> */}
  </StrictMode>
);
