import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App.jsx'
import "./index.css";
import Router from "./router/Router.jsx";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
// import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "./index.css";
import "./flag.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <PrimeReactProvider> */}
    <Router />
    {/* </PrimeReactProvider> */}
  </React.StrictMode>
);
