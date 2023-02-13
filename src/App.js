import "./styles/Home.css";
import Header from "./COMPONENTS/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Project from "./COMPONENTS/Pages/Project";
import BidaHome from "./COMPONENTS/Pages/BidaHome";
// import Swap from "./COMPONENTS/Pages/Swap";


export default function Home() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Project />} />
          <Route path="/bidahome" element={<BidaHome />} />
          {/* <Route path="/swap" element={<Swap />} /> */}
        </Routes>
      </Router>
    </>
  );
}
