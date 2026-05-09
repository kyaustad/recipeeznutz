import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { Titlebar } from "./components/custom/titlebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TooltipProvider>
      <Titlebar />
      <main className="app-main">
        <App />
      </main>
    </TooltipProvider>
  </React.StrictMode>,
);
