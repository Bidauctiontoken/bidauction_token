// import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useWeb3React } from "@web3-react/core";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { TransactionContext } from "../COMPONENTS/ReactContext/TransactionContext";
import img1 from "../images/logo.png";

export default function Header() {
  const { active, deactivate } = useWeb3React();

  const handleDisconnect = () => {
    if (active) {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
    }
    console.log("i am clicking");
  };

  const { connectWallet, currentAccount, switchAccount } =
    useContext(TransactionContext);

  return (
    <div className="contain1">
      <div className="head__content">
        <div className="logo_img">
          <img src={img1} alt="logo-img" width={75} height={50} />
        </div>
        <div className="the__ul">
          <span>
            <Link to="/"></Link>
          </span>
        </div>

        <div className="main__right">
          {currentAccount ? (
            <>
              <button className="the__buttons">{currentAccount}</button>
              {/* <button
                onClick={() => handleDisconnect()}
                className="the__buttons "
              >
                disc
              </button> */}
            </>
          ) : (
            <button onClick={() => connectWallet()} className="the__buttons ">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
