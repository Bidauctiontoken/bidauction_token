import React, { useState, useEffect, useContext } from "react";
import "./Pages.css";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { TransactionContext } from "../ReactContext/TransactionContext";
import routerAbi from "../Contract/abi.json";

const Swap = () => {
  const routerAddress = "0x7872D3C3Ebc9152daEeC572311E9A51724ff70A5";

  const { maximum, minimum, roi, totalDeposit } =
    useContext(TransactionContext);
  const [totalReward, setTotalReward] = useState(0);
  const { contract } = useContract(
    "0x7872D3C3Ebc9152daEeC572311E9A51724ff70A5",
    routerAbi
  );
  const { data: rewards, isLoading: loadingRewards } = useContractRead(
    contract,
    "_roi" // The name of the view/mapping/variable on your contract
  );

  console.log(totalReward, "roi rioi");
  useEffect(() => {
    if (!loadingRewards) {
      setTotalReward(rewards);
    }
  }, [loadingRewards, rewards]);

  return (
    <div className="mainContainer">
      <h1>minepad</h1>
      <div>
        <p>Total Reward: {totalReward}</p>
      </div>
      <p>
        i give myself away lorem10 Include popular icons in your React projects
        easily with react-icons, which utilizes ES6 imports that allows you to
        include only the icons that your project is using.
      </p>
    </div>
  );
};

export default Swap;
