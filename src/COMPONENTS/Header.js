import "../styles/Home.css";
import { useContext, useState } from "react";
import { TransactionContext } from "../COMPONENTS/ReactContext/TransactionContext";
import img1 from "../images/logo.png";
import { GoArrowDown } from "react-icons/go";

export default function Header() {
  const {
    connectWallet,
    currentAccount,
    handleSwitchAccounts,
    handleDisconnect,
  } = useContext(TransactionContext);

  const [showModal, setShowModal] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(currentAccount);
  }

  return (
    <div className="contain1">
      <div className="head__content">
        <div className="logo_img">
          <img src={img1} alt="logo-img" width={75} height={50} />
        </div>

        <div className="main__right">
          {currentAccount ? (
            <>
              <div className="the__buttons">
                <div
                  className="address__arrow"
                  onClick={() => setShowModal(true)}
                >
                  <button className="address__buttons">{currentAccount}</button>
                  <span className="arrow__down">
                    <GoArrowDown />
                  </span>
                </div>
                <>
                  {showModal && (
                    <div className="modal">
                      <div className="modal__content">
                        <span
                          className="modal__close"
                          onClick={() => setShowModal(false)}
                        >
                          X
                        </span>
                        <button
                          className="secondary__button"
                          onClick={() => handleSwitchAccounts()}
                        >
                          Switch Account
                        </button>
                        <button
                          className="secondary__button"
                          onClick={() => handleDisconnect()}
                        >
                          Disconnect Account
                        </button>
                      </div>
                    </div>
                  )}
                </>
                {/* <button
                  onClick={() => handleSwitchAccounts()}
                  className="switch__buttons"
                >
                  Switch Acccount
                </button> */}
              </div>
            </>
          ) : (
            <button onClick={() => connectWallet()} className="the__buttons">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
