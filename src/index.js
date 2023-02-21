import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { TransactionProvider } from "./COMPONENTS/ReactContext/TransactionContext";
import { ethers } from "ethers";

const container = document.getElementById("root");
const root = createRoot(container);

let provider;
if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
}

root.render(
  <TransactionProvider provider={provider}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TransactionProvider>
);
