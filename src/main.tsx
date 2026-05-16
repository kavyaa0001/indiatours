import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import SmoothScroll from "./components/SmoothScroll";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SmoothScroll>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SmoothScroll>
  </React.StrictMode>
);
