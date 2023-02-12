import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import MigrationContractAbi from "../Contract/abi.json";
// import "./layout.js";
// import approveAbi from "../Contract/approve.json";
import { useContract, useContractRead } from "@thirdweb-dev/react";

import { TransactionContext } from "../ReactContext/TransactionContext";
// const ApproveAdd = "0x7934b55980Da574df6458515d8267b98729c3532";
const MigrationContractAddress = "0x055A12C497E7DA8a0555a064712aE39aCbE7DbFa";

// const ContractAdd = "0x055A12C497E7DA8a0555a064712aE39aCbE7DbFa";
//INSTANCES
let provider = new ethers.providers.Web3Provider(window.ethereum);
let signer = provider.getSigner();
let contract = new ethers.Contract(
  MigrationContractAddress,
  MigrationContractAbi,
  signer
);

function Project() {
  const {
    ApproveTx,
    currentAccount,
    v1,
    v2,
    handleMigrate,
    handleV1Change,
    allowTransaction,
    AllowanceCheck,
    tokenv1Balance,
    tokenv2Balance,
    setV1,
  } = useContext(TransactionContext);

  // const [error, setError] = useState(null);
  // const [v1, setV1] = useState("");
  // const [v2, setV2] = useState("");
  //   const [allowTransaction, setAllowTransaction] = useState(true);

  // ///HANDLECHANGE
  // const handleV1Change = async (e) => {
  //   setV1(e.target.value);
  //   const convertedInputs = ethers.utils.parseUnits(e.target.value, "ether");
  //   const rate = await contract.rate();
  //   const denomerator = ethers.utils.parseUnits("1", "ether");
  //   const mul = (convertedInputs * rate) / denomerator;
  //   const outPut = ethers.utils.formatUnits(mul.toString());
  //   console.log(`${outPut}, ${mul}`);
  //   setV2((e.target.value * outPut).toString());
  // };

  // const handleMigrate = async () => {
  //   try {
  //     const v1Amount = ethers.utils.parseUnits(v1, "ether");
  //     await contract.migrateToV2(v1Amount);
  //     console.log("Migration successful!");
  //   } catch (error) {
  //     console.error(error);
  //     setError(error.message);
  //   }
  // };

  return (
    <div className="mt-20 ">
      <div className="flex justify-around items-center">
        <div className="bg-image-right bg-right w-1/6 h-60 bg-no-repeat">
          {/* left hand side placeholder */}
        </div>

        <div className="action-card w-2/6 p-3 shadow-lg shadow-white-500 rounded bg-bgdark mt-20 box-shadow-lg">
          <h1 className="mb-3 font-bold">MIGRATE</h1>
          <>
            <div className="flex flex-col mb-5 relative">
              <label
                htmlFor="from"
                className="text-lighter mb-2 flex justify-between "
              >
                <h4>From</h4>
                <h4>Bal: {tokenv1Balance}</h4>
              </label>
              <input
                type="text"
                placeholder="0.0"
                value={v1}
                onChange={handleV1Change}
                className="bg-lighter p-2 rounded placeholder-placeholder-color pr-20"
              />
              <button
                className={
                  `p-1 bg-dark rounded text-bold cursor-ponter d-inline absolute bottom-1 right-1 p-2 text-xs font-semibold hover:text-lighter`
                  // : "p-1 bg-dark rounded text-bold d-inline absolute bottom-1 right-1 p-2 text-xs font-semibold text-lighter cursor-not-allowed"
                }
                onClick={() => setV1(tokenv1Balance)}
              >
                MAX
              </button>
            </div>

            <div className="flex flex-col mt-3">
              <label
                htmlFor="to"
                className="text-lighter mb-2 flex justify-between "
              >
                <h4>To</h4>
                <h4>Bal :{tokenv2Balance}</h4>
              </label>
              <input
                type="text"
                readOnly
                placeholder="0.0"
                value={v2}
                className="bg-lighter p-2 rounded placeholder-placeholder-color pr-20"
              />

              {allowTransaction ? (
                <button
                  onClick={() => ApproveTx()}
                  className="bg-dark p-2 rounded w-full mt-10 text-lighter text-bold cursor-pointer shadow-lg py-4"
                >
                  Approve
                </button>
              ) : (
                <button
                  onClick={() => handleMigrate()}
                  className="bg-dark p-2 rounded w-full mt-10 text-lighter text-bold cursor-pointer shadow-lg py-4"
                >
                  Migrate
                </button>
              )}
            </div>
          </>
        </div>
        <div className=" w-1/6">
          <p> right hand side placeholder right hand side placeholder</p>
          <p> right hand side placeholder</p>
          <p> right hand side placeholder</p>
          <p> right hand side placeholder</p>
        </div>
      </div>
    </div>
  );
}

export default Project;
