// import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import "../styles/Home.css";
import { FiSun } from "react-icons/fi";
// import Project from "./Pages/Project";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { TransactionContext } from "../COMPONENTS/ReactContext/TransactionContext";
import img1 from "../images/logo.png";

export default function Header() {
  const { connectWallet, currentAccount } = useContext(TransactionContext);

  return (
    <div className="contain1">
      <div className="head__content">
        <div className="logo_img">
          <img src={img1} alt="logo-img" width={75} height={50} />
        </div>
        <div className="the__ul">
          <span>
            <Link to="/bidahome">Home</Link>
          </span>
          <span>
            <Link to="/">Migrate</Link>
          </span>
        </div>

        <div className="main__right">
          {currentAccount ? (
            <button className="the__buttons">{currentAccount}</button>
          ) : (
            <button onClick={() => connectWallet()} className="the__buttons ">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
