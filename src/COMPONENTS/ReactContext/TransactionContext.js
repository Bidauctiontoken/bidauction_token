import React from "react";
import { createContext, useEffect, useState, CSSProperties } from "react";
import { ethers } from "ethers";

import routerAbi from "../Contract/abi.json";
import approveAbi from "../Contract/approve.json";
import MigrationContractAbi from "../Contract/abi.json";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import ClipLoader from "react-spinners/ClipLoader";

import { css } from "@emotion/react";

export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loggedAccount, setloggedAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenv1Balance, setTokenv1Balance] = useState("");
  const [tokenv2Balance, setTokenv2Balance] = useState("");
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [allowTransaction, setAllowTransaction] = useState(true);
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
    // setIsLoading(true);
    if (typeof window.ethereum !== "undefined")
      try {
        // if (!window.ethereum) return alert("Please install MetaMask");
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setloggedAccount(accounts[0]);

        setCurrentAccount(
          `${accounts[0].substr(0, 4)}...${accounts[0].substr(-4)}`
        );

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        const curbal = ethers.utils.formatEther(balance, "ether");
        const etherbal = parseFloat(curbal.toString());
        const roundedbal = etherbal.toFixed(4);

        // setAccountBal(roundedbal);
        // setAddress(`${accounts[0].substr(0, 4)}...${accounts[0].substr(-4)}`);
        // await AllowanceCheck();
        const tV1 = await contract.tokenV1();
        const tokenV2 = await contract.tokenV2();
        tokenV1Contract = new ethers.Contract(tV1, approveAbi, signer);
        tokenV2Contract = new ethers.Contract(
          tokenV2,
          approveAbi,
          signer
        );
        const maxAllowanceRemaining = await tokenV1Contract.allowance(
          accounts[0],
          MigrationContractAddress
        );

        //TOKENV1 BALANCE
        const userBalanceTokenV1 = await tokenV1Contract.balanceOf(accounts[0]);
        const tokenV1UserCOnvertdBalance =
          ethers.utils.formatUnits(userBalanceTokenV1);
        setTokenv1Balance(tokenV1UserCOnvertdBalance.toString());
          
        //TOKENV2 BALANCE
        const userBalanceTokenV2 = await tokenV2Contract.balanceOf(accounts[0]);
        const tokenV2UserCOnvertdBalance = ethers.utils.formatUnits(
          userBalanceTokenV2.toString()
        );
        setTokenv2Balance(tokenV2UserCOnvertdBalance.toString());

        if (maxAllowanceRemaining <= userBalanceTokenV1) {
          // the approval button should show
          setAllowTransaction(false);
        } else {
          // the approval button should not show
          setAllowTransaction(true);
        }
        setIsLoading(false);
      } catch (error) {}
  };

  ///HANDLECHANGE
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
      setV1("");
      setV2("");

      // Get the transaction receipt
      const receipt = await tx.wait();

      // Check if the transaction was successful
      if (receipt.status === 1) {
        console.log("Transaction successful. Hash:", receipt.transactionHash);
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
        const tokenV1UserCOnvertdBalance =
          ethers.utils.formatUnits(userBalanceTokenV1);
        setTokenv1Balance(tokenV1UserCOnvertdBalance.toString());


        //TOKENV2 BALANCE
        const userBalanceTokenV2 = await tokenV2Contract.balanceOf(
          loggedAccount
        );
        const tokenV2UserCOnvertdBalance = ethers.utils.formatUnits(
          userBalanceTokenV2.toString()
        );
        setTokenv2Balance(tokenV2UserCOnvertdBalance.toString());
        
      } else {
        console.log("Transaction failed.");
      }
    } catch (err) {
      // setError(error.message);
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
        console.log("Transaction successful. Hash:", receipt.transactionHash);
        setAllowTransaction(false);
      } else {
        console.log("Transaction failed.");
      }
    } catch (err) {
      console.log("Error:", err);
    }
    setSpinLoading(false);
  };

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        ApproveTx,
        currentAccount,
        v1,
        v2,
        handleMigrate,
        handleV1Change,
        allowTransaction,
        tokenv1Balance,
        tokenv2Balance,
        setV1,
        accounts,
        spinLoading,
        loggedAccount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
