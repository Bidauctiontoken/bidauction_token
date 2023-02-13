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
      <div className="main__left">
        <div className="logo_img">
          <img src={img1} alt="logo-img" width={50} height={7} />
        </div>
        <ul>
          <li>
            <Link to="/bidahome">Home</Link>
          </li>
          <li>
            <Link to="/">Migrate</Link>
          </li>
          {/* <li>
            <Link to="/minepad">Minepad</Link>
          </li>
          <li>
            <Link to="/swap">Swap</Link>
          </li> */}
          <li>{/* <Link to="/nft">NFT</Link> */}</li>
        </ul>
      </div>
      <div className="main__right">
        {currentAccount ? (
          <button className="the__buttons">{currentAccount}</button>
        ) : (
          <button onClick={() => connectWallet()} className="the__buttons ">
            Connect Wallet
          </button>
        )}

        {/* <div className="connect">
          <ConnectWallet colorMode="white" accentColor="transparent" />
        </div> */}
        {/* <FiSun className="fisun" /> */}
      </div>
    </div>
  );
}
