// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./styles/globals.css";
// import { TransactionProvider } from "./COMPONENTS/ReactContext/TransactionContext";

// const container = document.getElementById("root");
// const root = createRoot(container);

// root.render(
//   <TransactionProvider>
//     <React.StrictMode>
//       <App />,
//     </React.StrictMode>
//   </TransactionProvider>
// );

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { TransactionProvider } from "./COMPONENTS/ReactContext/TransactionContext";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

// function getLibrary(provider) {
//   return new Web3(provider)
// }

const container = document.getElementById("root");
const root = createRoot(container);

function getLibrary(provider) {
  return new Web3Provider(provider);
}
root.render(
  <TransactionProvider>
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </React.StrictMode>
  </TransactionProvider>
);
