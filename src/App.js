import "./styles/Home.css";
import Header from "./COMPONENTS/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Project from "./COMPONENTS/Pages/Project";
// import Swap from "./COMPONENTS/Pages/Swap";

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export default function Home(provider) {
  
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Project />} />
        </Routes>
      </Router>
    </>
  );
}
