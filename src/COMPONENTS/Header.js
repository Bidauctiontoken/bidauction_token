import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { TransactionContext } from "../COMPONENTS/ReactContext/TransactionContext";
import img1 from "../images/logo.png";

export default function Header() {
  const { connectWallet, currentAccount, handleSwitchAccounts } =
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
              <div className="the__buttons">
                <button className="address__buttons">{currentAccount}</button>
                <button
                  onClick={() => handleSwitchAccounts()}
                  className="switch__buttons"
                >
                  Switch Acccount
                </button>
              </div>
            </>
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
