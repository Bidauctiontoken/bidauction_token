import React from "react";
import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import routerAbi from "../Contract/abi.json";
// import { useContract, useContractWrite } from "@thirdweb-dev/react";
import approveAbi from "../Contract/approve.json";
import MigrationContractAbi from "../Contract/abi.json";

// import "./layout.js";
// import approveAbi from "../Contract/approve.json";
import { useContract, useContractRead } from "@thirdweb-dev/react";

// import Web3Modal from "web3modal";
// import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenv1Balance, setTokenv1Balance] = useState("");
  const [tokenv2Balance, setTokenv2Balance] = useState("");

  const [error, setError] = useState(null);
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [allowTransaction, setAllowTransaction] = useState(true);
  // /""INTERNAL............................
  const routerAddress = "0x055A12C497E7DA8a0555a064712aE39aCbE7DbFa";
  const MigrationContractAddress = "0x00Be416a7A36D4BC479d90CB3a4986E4f3720d71";

  const ApproveAdd = "0x7934b55980Da574df6458515d8267b98729c3532";
  const ContractAdd = "0x055A12C497E7DA8a0555a064712aE39aCbE7DbFa";

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

  let accounts;

  const connectWallet = async () => {
    // setIsLoading(true);
    if (typeof window.ethereum !== "undefined")
      try {
        // if (!window.ethereum) return alert("Please install MetaMask");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

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
        const tokenV2Contract = new ethers.Contract(
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
          setAllowTransaction(true);
        } else {
          // the approval button should not show
          setAllowTransaction(false);
        }
        setIsLoading(false);
      } catch (error) {}
  };

  ///HANDLECHANGE
  const handleV1Change = async (e) => {
    setV1(e.target.value);
    // const convertedInputs = ethers.utils.parseUnits(e.target.value, "ether");
    // const rate = await contract.rate();
    // const denomerator = ethers.utils.parseUnits("1", "ether");
    // const mul = (convertedInputs * rate) / denomerator;
    // const outPut = ethers.utils.formatEther(mul.toString());
    setV2(e.target.value);
  };

  const handleMigrate = async () => {
    try {
      const v1Amount = ethers.utils.parseUnits(v1, "ether");
      await contract.migrateToV2(v1Amount, {
        gasLimit: 100000,
      });
    } catch (error) {
      setError(error.message);
    }
  };
  /////APPROVE TRANSACTION//////////////////
  const ApproveTx = async (e) => {
    try {
      tokenv1 = await contract.tokenV1();
      tokenV1Contract = new ethers.Contract(tokenv1, approveAbi, signer);
      const value = ethers.constants.MaxUint256;
      await tokenV1Contract.approve(MigrationContractAddress, value, {
        gasLimit: 71000,
      });
      setAllowTransaction(false);
    } catch (err) {}
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
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
