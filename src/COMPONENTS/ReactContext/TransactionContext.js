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
  const [userVest, setUserVest] = useState("");

  const [isWalletConnected, setIsWalletConnected] = useState();

  // /""INTERNAL............................
  const MigrationContractAddress = "0xb9121960934245C511A63afebd59c81B6a43da4B";

  let [spinLoading, setSpinLoading] = useState(false);

  let tokenv1;
  let tokenV1Contract;
  // let tokenV2Contract;

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      // Handle the case where MetaMask is not installed
      alert("Please install MetaMask to use this feature:");
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Set up listener for account change
      window.ethereum.on("accountsChanged", (newAccounts) => {
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

      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let contract = new ethers.Contract(
        MigrationContractAddress,
        MigrationContractAbi,
        signer
      );

      const balance = await provider.getBalance(loggedAccount);
      const curbal = ethers.utils.formatEther(balance, "ether");
      const etherbal = parseFloat(curbal.toString());
      const roundedbal = etherbal.toFixed(4);

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
    } catch (err) {}
  };

  // On component mount, check for a previously connected account in localStorage
  useEffect(() => {
    const storedAccount = localStorage.getItem("connectedAccount");
    if (storedAccount) {
      connectWallet();
    }
  }, []);

  //handle swich Account
  const handleSwitchAccounts = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        setIsWalletConnected(false);
      } catch (err) {}
    }
  };

  const handleDisconnect = () => {
    // Clear local storage for the connected account
    localStorage.removeItem("connectedAccount");

    // Reload the page
    window.location.reload();

    // Reset component state
    setLoggedAccount(null);
    setCurrentAccount(null);
    setTokenv1Balance(null);
    setTokenv2Balance(null);
    setAllowTransaction(false);
    setIsWalletConnected(false);
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
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let contract = new ethers.Contract(
        MigrationContractAddress,
        MigrationContractAbi,
        signer
      );

      // const v1Amount = ethers.utils.parseUnits(v1, "ether");
      const tx = await contract.migrateToV2({
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
        console.log(tokenv2Balance, "balllllllll");

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
      console.log(err, "the errors");
    }
    setSpinLoading(false);
  };

  /////APPROVE TRANSACTION//////////////////
  const ApproveTx = async (e) => {
    setSpinLoading(true);
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let contract = new ethers.Contract(
        MigrationContractAddress,
        MigrationContractAbi,
        signer
      );

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

  //CLAIM
  const Claim = async () => {
    // setSpinLoading(true);
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let contract = new ethers.Contract(
        MigrationContractAddress,
        MigrationContractAbi,
        signer
      );

      const claimIt = await contract.claim({ gasLimit: 500000 });

      // setUserVest(vestingData.toString());
      // // Get the transaction receipt
      // const receipt = await tx.wait();

      // // Check if the transaction was successful
      // if (receipt.status === 1) {
      //   setAllowTransaction(false);
      // } else {
      // }
      console.log(claimIt, "oya claim");
    } catch (err) {}
    // setSpinLoading(false);
  };

  //userVestingData
  const UserVestingData = async () => {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let contract = new ethers.Contract(
        MigrationContractAddress,
        MigrationContractAbi,
        signer
      );

      const userVestingData = await contract.userVestingData(loggedAccount);
      const userVestingDataBigNumber = userVestingData[0];
      const curbal = ethers.utils.formatEther(
        userVestingDataBigNumber,
        "ether"
      );
      const etherbal = parseFloat(curbal.toString());
      const roundedbal = etherbal.toFixed();
      setUserVest(roundedbal);
      console.log(roundedbal, "asdfghjkl");
    } catch (err) {
    }
  };

  useEffect(() => {
    UserVestingData();
  }, [loggedAccount]);

  return (
    <TransactionContext.Provider
      value={{
        userVest,
        Claim,
        handleDisconnect,
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
        spinLoading,
        loggedAccount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
