import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { TransactionProvider } from "./COMPONENTS/ReactContext/TransactionContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <TransactionProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TransactionProvider>
);
