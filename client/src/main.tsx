import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error tracking for debugging
window.addEventListener("error", (event) => {
  console.error("🚨 JS Error:", event.message, "at", event.filename, ":", event.lineno);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("🚨 Unhandled Promise Rejection:", event.reason);
});

// Button interaction debugging  
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll("button").forEach(btn => {
      const hasHandler = btn.onclick;
      if (!hasHandler && btn.innerText.trim()) {
        console.warn(`⚠️ Button has no action:`, btn.innerText.trim());
      }
    });
  }, 2000); // Wait for React to render
});

createRoot(document.getElementById("root")!).render(<App />);
