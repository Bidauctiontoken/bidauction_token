import { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../COMPONENTS/ReactContext/TransactionContext";
import img1 from "../images/logo.png";
import { GoArrowDown } from "react-icons/go";
import "../styles/Home.css";

export default function Header() {
  const {
    connectWallet,
    currentAccount,
    handleSwitchAccounts,
    handleDisconnect,
  } = useContext(TransactionContext);

  const [showModal, setShowModal] = useState(false);

  // SWITCH METAMASK NETWORK
  // async function switchNetwork(chainId) {
  //   try {
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: `0x${chainId.toString(16)}` }],
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // const supportedNetworks = [
  //   { name: "Mainnet", chainId: 1 },
  //   { name: "BSC Mainnet", chainId: 56 },
  //   { name: "Rinkeby", chainId: 4 },
  //   { name: "Ropsten", chainId: 3 },
  //   { name: "Kovan", chainId: 42 },
  // ];

  // async function handleSwitchNetworks() {
  //   try {
  //     const accounts = await window.ethereum.request({
  //       method: "eth_accounts",
  //     });
  //     if (accounts.length === 0) {
  //       // User has not allowed access to their accounts
  //       console.log("Please connect to Metamask.");
  //     } else {
  //       const networkId = await window.ethereum.request({
  //         method: "net_version",
  //       });
  //       const network = supportedNetworks.find(
  //         (network) => network.chainId === Number(networkId)
  //       );
  //       if (network) {
  //         setShowModal(false);
  //         console.log(`Switching to ${network.name}`);
  //         await switchNetwork(network.chainId);
  //       } else {
  //         console.log("This network is not supported.");
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const [networkName, setNetworkName] = useState("");

  // async function switchNetwork(chainId) {
  //   if (
  //     typeof window.ethereum !== "undefined" &&
  //     window.ethereum.isConnected()
  //   ) {
  //     // Metamask is installed and connected
  //   } else {
  //     // Metamask is not installed or not connected
  //     alert("Please install MetaMask to use this feature:");
  //     return;
  //   }
  //   const accounts = await window.ethereum.request({ method: "eth_accounts" });
  //   if (accounts.length === 0) {
  //     // User has not allowed access to their accounts
  //   }
  //   const networkId = await window.ethereum.request({ method: "net_version" });

  //   try {
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId }],
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
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

                        {/* <div>
                          <span>Switch Network:</span>
                          {supportedNetworks.map((network) => (
                            <button
                              className="secondary__button"
                              key={network.chainId}
                              onClick={
                                () => handleSwitchNetworks()
                                // (network.chainId)
                              }
                            >
                              {network.name}
                            </button>
                          ))}
                        </div> */}
                      </div>
                    </div>
                  )}
                </>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => connectWallet()} className="the__buttons">
                Connect Wallet
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
