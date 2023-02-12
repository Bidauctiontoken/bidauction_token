import "./styles/Home.css";
import Header from "./COMPONENTS/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Project from "./COMPONENTS/Pages/Project";
import Swap from "./COMPONENTS/Pages/Swap";

// import { Investment } from "./COMPONENTS/Investments/Investments";

export default function Home() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Project />} />
          <Route path="/swap" element={<Swap />} />
        </Routes>
      </Router>
    </>
  );
}
