import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { ethers } from "ethers";

import approveAbi from "../Contract/approve.json";
import MigrationContractAbi from "../Contract/abi.json";

export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loggedAccount, setLoggedAccount] = useState("");
  const [tokenv1Balance, setTokenv1Balance] = useState("");
  const [tokenv2Balance, setTokenv2Balance] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [allowTransaction, setAllowTransaction] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [first, setfirst] = useState("");

  const [isWalletConnected, setIsWalletConnected] = useState();

  // /""INTERNAL............................
  const MigrationContractAddress = "0x00Be416a7A36D4BC479d90CB3a4986E4f3720d71";

  let [spinLoading, setSpinLoading] = useState(false);
  // let [color, setColor] = useState("#ffff");

  //INSTANCES
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  let contract = new ethers.Contract(
    MigrationContractAddress,
    MigrationContractAbi,
    signer
  );

  let tokenv1;
  let tokenV1Contract;
  let tokenV2Contract;

  let accounts;
  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      window.alert("Please install MetaMask to use this dApp");
      return;
    }
    try {
      // Request account access
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Set up listener for account change
      window.ethereum.on("accountsChanged", (newAccounts) => {
        console.log("MetaMask account changed");
        // Refresh the page
        window.location.reload();
      });

      // Save account details to local storage
      localStorage.setItem("connectedAccount", accounts[0]);

      const loggedAccount = accounts[0];
      const currentAccount = `${accounts[0].substr(
        0,
        4
      )}...${accounts[0].substr(-4)}`;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const balance = await provider.getBalance(loggedAccount);
      const curbal = ethers.utils.formatEther(balance, "ether");
      const etherbal = parseFloat(curbal.toString());
      const roundedbal = etherbal.toFixed(4);
      console.log(roundedbal, "account balance");

      const tV1 = await contract.tokenV1();
      const tokenV2 = await contract.tokenV2();
      const tokenV1Contract = new ethers.Contract(tV1, approveAbi, signer);
      const tokenV2Contract = new ethers.Contract(tokenV2, approveAbi, signer);
      const maxAllowanceRemaining = await tokenV1Contract.allowance(
        accounts[0],
        MigrationContractAddress
      );

      //TOKENV1 BALANCE
      const userBalanceTokenV1 = await tokenV1Contract.balanceOf(accounts[0]);
      const tokenV1UserConvertedBalance =
        ethers.utils.formatUnits(userBalanceTokenV1);

      //TOKENV2 BALANCE
      const userBalanceTokenV2 = await tokenV2Contract.balanceOf(accounts[0]);
      const tokenV2UserConvertedBalance = ethers.utils.formatUnits(
        userBalanceTokenV2.toString()
      );

      // Update component state
      setLoggedAccount(loggedAccount);
      setCurrentAccount(currentAccount);
      setTokenv1Balance(tokenV1UserConvertedBalance.toString());
      setTokenv2Balance(tokenV2UserConvertedBalance.toString());

      if (maxAllowanceRemaining <= userBalanceTokenV1) {
        // the approval button should show
        setAllowTransaction(true);
      } else {
        // the approval button should not show
        setAllowTransaction(false);
      }
      // Call handleState function if it exists
      if (typeof handleState === "function") {
        await handleState();
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  // On component mount, check for a previously connected account in localStorage
  useEffect(() => {
    const storedAccount = localStorage.getItem("connectedAccount");
    if (storedAccount) {
      connectWallet();
    }
  }, []);

  const handleSwitchAccounts = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        setIsWalletConnected(false);
      } catch (err) {
        console.error(err);
        console.log("i got here");
      }
    }
  };

  const handleState = async () => {
    try {
      if (!isLoaded) {
        // if (!window.ethereum) return alert("Please install MetaMask");
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setIsLoaded(true);
      }
    } catch (error) {}
  };

  const handleMaxChange = async (e) => {
    setV1(e);
    setV2(e);
  };
  const handleV1Change = async (e) => {
    setV1(e.target.value);
    setV2(e.target.value);
  };

  //MIGRATING//////////////////////////..............
  const handleMigrate = async () => {
    setSpinLoading(true);
    try {
      const v1Amount = ethers.utils.parseUnits(v1, "ether");
      const tx = await contract.migrateToV2(v1Amount, {
        gasLimit: 500000,
      });
      setfirst(v1);
      setV1("");
      setV2("");
      // Get the transaction receipt
      const receipt = await tx.wait();

      // Check if the transaction was successful
      if (receipt.status === 1) {
        setAllowTransaction(false);
        const tV1 = await contract.tokenV1();
        const tokenV2 = await contract.tokenV2();

        const tokenV1Contract = new ethers.Contract(tV1, approveAbi, signer);
        const tokenV2Contract = new ethers.Contract(
          tokenV2,
          approveAbi,
          signer
        );
        //TOKENV1 BALANCE
        const userBalanceTokenV1 = await tokenV1Contract.balanceOf(
          loggedAccount
        );
        const tokenV1UserConvertedBalance =
          ethers.utils.formatUnits(userBalanceTokenV1);
        setTokenv1Balance(tokenV1UserConvertedBalance.toString());

        //TOKENV2 BALANCE
        const userBalanceTokenV2 = await tokenV2Contract.balanceOf(
          loggedAccount
        );
        const tokenV2UserConvertedBalance = ethers.utils.formatUnits(
          userBalanceTokenV2.toString()
        );
        setTokenv2Balance(tokenV2UserConvertedBalance.toString());

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      }
    } catch (err) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
    setSpinLoading(false);
  };

  /////APPROVE TRANSACTION//////////////////
  const ApproveTx = async (e) => {
    setSpinLoading(true);
    try {
      tokenv1 = await contract.tokenV1();
      tokenV1Contract = new ethers.Contract(tokenv1, approveAbi, signer);
      const value = ethers.constants.MaxUint256;
      const tx = await tokenV1Contract.approve(
        MigrationContractAddress,
        value,
        {
          gasLimit: 71000,
        }
      );
      // Get the transaction receipt
      const receipt = await tx.wait();

      // Check if the transaction was successful
      if (receipt.status === 1) {
        setAllowTransaction(false);
      } else {
      }
    } catch (err) {}
    setSpinLoading(false);
  };

  return (
    <TransactionContext.Provider
      value={{
        // switchAccount,
        // disconnect,
        handleSwitchAccounts,
        first,
        success,
        error,
        connectWallet,
        ApproveTx,
        currentAccount,
        v1,
        v2,
        handleMigrate,
        handleV1Change,
        handleMaxChange,
        allowTransaction,
        tokenv1Balance,
        tokenv2Balance,
        setV1,
        // accounts,
        spinLoading,
        loggedAccount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
