import React from "react";
import { createRoot } from "react-dom/client";
import LightningMonitor from "./LightningMonitor";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <LightningMonitor />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
