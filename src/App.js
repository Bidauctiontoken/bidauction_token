import "./styles/Home.css";
import Header from "./COMPONENTS/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Project from "./COMPONENTS/Pages/Project";

export default function App() {
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
