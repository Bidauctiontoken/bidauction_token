import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { ethers } from "ethers";
// import moment from "moment";

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
  const [userWidrawal, setUserWidrawal] = useState("");
  const [userSubtract, setUserSubtract] = useState("");
  const [userClaimDate, setUserClaimDate] = useState("");

  const [isWalletConnected, setIsWalletConnected] = useState();
  let [spinLoading, setSpinLoading] = useState(false);
  let [claimLoading, setClaimLoading] = useState(false);
  const [isNextClaimDate, setIsNextClaimDate] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // const [migrationNotStarted, setMigrationNotStarted] = useState(false);

  // /""INTERNAL............................
  // const MigrationContractAddress = "0xc094de1a51e8491f6ad7d6d73db07f144d44cb50";
  const MigrationContractAddress = "0xFF218559Ad9DA76c3673C5e26b7F4431E42Bf757";
  // const MigrationContractAddress = "0xb6Be5015bF8fAec175972F5954C73C7baaAdd364";
  // const MigrationContractAddress = "0x4FC9A093746D87997a9edf7D4c60c2cc31952B98";

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

      const v1Amount = ethers.utils.parseUnits(v1.toString(), "ether");
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

  const IsMigration = async () => {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let contract = new ethers.Contract(
        MigrationContractAddress,
        MigrationContractAbi,
        provider
      );

      // Check if migration has started
      const migrationStarted = await contract.migrationStarted();
      // code to check if migration started is false
      return migrationStarted;
      // return !migrationStarted;
    } catch (err) {}
  };

  /////APPROVE TRANSACTION//////////////////
  // const ApproveTx = async (e) => {
  //   setSpinLoading(true);
  //   try {
  //     let provider = new ethers.providers.Web3Provider(window.ethereum);
  //     let signer = provider.getSigner();
  //     let contract = new ethers.Contract(
  //       MigrationContractAddress,
  //       MigrationContractAbi,
  //       signer
  //     );

  //     tokenv1 = await contract.tokenV1();
  //     tokenV1Contract = new ethers.Contract(tokenv1, approveAbi, signer);
  //     const value = ethers.constants.MaxUint256;
  //     const tx = await tokenV1Contract.approve(
  //       MigrationContractAddress,
  //       value,
  //       {
  //         gasLimit: 71000,
  //       }
  //     );
  //     // Get the transaction receipt
  //     const receipt = await tx.wait();

  //     // Check if the transaction was successful
  //     if (receipt.status === 1) {
  //       setAllowTransaction(false);
  //     } else {
  //     }
  //   } catch (err) {}
  //   setSpinLoading(false);
  // };

  // //CLAIM
  // const Claim = async () => {
  //   setClaimLoading(true);
  //   try {
  //     let provider = new ethers.providers.Web3Provider(window.ethereum);
  //     let signer = provider.getSigner();
  //     let contract = new ethers.Contract(
  //       MigrationContractAddress,
  //       MigrationContractAbi,
  //       signer
  //     );

  //     const claimIt = await contract.claim({
  //       from: loggedAccount,
  //       gasLimit: 500000,
  //     });

  //     // Get the transaction receipt
  //     const receipt = await claimIt.wait();

  //     // Check if the transaction was successful
  //     if (receipt.status === 1) {
  //       setAllowTransaction(false);
  //     } else {
  //     }
  //     console.log(claimIt, "oya claim");
  //   } catch (err) {}
  //   setClaimLoading(false);
  // };

  //userVestingData
  // const UserVestingData = async () => {
  //   try {
  //     let provider = new ethers.providers.Web3Provider(window.ethereum);
  //     let signer = provider.getSigner();
  //     let contract = new ethers.Contract(
  //       MigrationContractAddress,
  //       MigrationContractAbi,
  //       signer
  //     );

  //     const userVestingData = await contract.userVestingData(loggedAccount);
  //     const userVestingData0 = userVestingData[0];
  //     const userVestingData1 = userVestingData[1];
  //     const isSmartContractTime = userVestingData[2];
  //     console.log(userVestingData);

  //     const userVestingData0InEther = ethers.utils.formatEther(
  //       userVestingData0,
  //       "ether"
  //     );
  //     const userVestingData1InEther = ethers.utils.formatEther(
  //       userVestingData1,
  //       "ether"
  //     );

  //     const userVestingData0InFloat = parseFloat(userVestingData0InEther);
  //     const userVestingData1InFloat = parseFloat(userVestingData1InEther);

  //     const roundedUserVestingData0 = userVestingData0InFloat.toFixed();
  //     const roundedUserVestingData1 = userVestingData1InFloat.toFixed();

  //     const subtractVesting = roundedUserVestingData0 - roundedUserVestingData1;

  //     // Convert the Unix timestamp to a human-readable date and time string using Moment.js
  //     const NextClaimDate = moment
  //       .unix(isSmartContractTime)
  //       .format("MMMM Do YYYY, h:mm:ss a");
  //     console.log(NextClaimDate, "moment date");

  //     const nextClaimTime = new Date(
  //       isSmartContractTime * 1000
  //     ).toLocaleString();

  //     setUserVest([roundedUserVestingData0]);
  //     setUserWidrawal([roundedUserVestingData1]);
  //     setUserSubtract(subtractVesting);
  //     setUserClaimDate(nextClaimTime);

  //     // Disable the claim button if the next claim date has not been reached

  //     const isCurrentTime = Date.now();
  //     // const isButtonDisabled = isSmartContractTime > isCurrentTime;
  //     // setIsButtonDisabled(isButtonDisabled);

  //     if (isSmartContractTime > isCurrentTime) {
  //       setIsButtonDisabled(true);
  //       console.log(isButtonDisabled, "disable");
  //     } else {
  //       setIsButtonDisabled(false);
  //       console.log(isButtonDisabled, "enable");
  //     }

  //     // setIsNextClaimDate(isCurrentTime);

  //     //  disabled={isCurrentTime <= isSmartContractTime}
  //     // console.log(isButtonDisabled, "is button is live");
  //     console.log(
  //       "nextclaim from smart contract ",
  //       isSmartContractTime.toString()
  //     );
  //     console.log(`current time ${isCurrentTime}`);
  //   } catch (err) {
  //     // console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   UserVestingData();
  // }, [loggedAccount]);

  return (
    <TransactionContext.Provider
      value={{
        // setMigrationNotStarted,
        // migrationNotStarted,
        IsMigration,
        isButtonDisabled,
        isNextClaimDate,
        userClaimDate,
        claimLoading,
        userSubtract,
        userWidrawal,
        userVest,
        // Claim,
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
