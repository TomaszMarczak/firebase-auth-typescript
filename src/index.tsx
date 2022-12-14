import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./scss/custom.scss";
import { AuthProvider } from "./context/AuthContext";
import { HashRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
