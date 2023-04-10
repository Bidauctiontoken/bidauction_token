import { useState, useContext } from "react";
import { TransactionContext } from "../ReactContext/TransactionContext";
import ClipLoader from "react-spinners/ClipLoader";
import { Modal } from "antd";

function Project() {
  //spinner
  const [color, setColor] = useState("#ffffff");
  const [showCountdown, setShowCountdown] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMigrate, setIsMigrate] = useState(false);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#ffff",
  };

  const {
    // userSubtract,
    // userWidrawal,
    // userVest,
    // Claim,
    ApproveTx,
    v1,
    v2,
    handleMaxChange,
    handleV1Change,
    handleMigrate,
    allowTransaction,
    tokenv1Balance,
    tokenv2Balance,
    spinLoading,
    loggedAccount,
    success,
    error,
    IsMigration,
    checkIfMigrate,
    hasMigrated,

    // claimLoading,
    // userClaimDate,
    // isNextClaimDate,
    // isButtonDisabled,
    migrationNotStarted,
  } = useContext(TransactionContext);

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Notice"
        // set background color here
      >
        <div className="modalContent">
          <p>The migration has not yet started.</p>
        </div>
      </Modal>

      <div className="project__content">
        <>
          {success && (
            <div className="transaction__popup">
              <p>Migration {v1} to Bida V2 successful! 🤑</p>
            </div>
          )}
          {error && (
            <div className="transaction__error__popup">
              <p>Migration Not successful! ✖️</p>
            </div>
          )}
        </>

        <div className="flex flex-col sm:flex-column mx-10">
          <div className="mb-7">{/* left hand side placeholder */}</div>
          <div className="actionCard flex  justify-between gap-9 mb-9">
            <div className="action-card w-full sm:w-2/4 m-auto p-3 shadow-md shadow-white-500 rounded bg-bgdark mt-9 box-shadow-lg">
              <h1 className="mb-3 font-bold">MIGRATE</h1>
              <>
                <div className="flex flex-col mb-5 relative">
                  <label
                    htmlFor="from"
                    className="text-lighter mb-2 flex justify-between"
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
                      loggedAccount
                        ? `p-1 bg-dark rounded text-bold cursor-ponter d-inline absolute bottom-1 right-1 p-2 text-xs font-semibold hover:text-lighter`
                        : "p-1 bg-dark rounded text-bold d-inline absolute bottom-1 right-1 p-2 text-xs font-semibold text-lighter cursor-not-allowed"
                    }
                    onClick={() => handleMaxChange(tokenv1Balance)}
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
                    <>
                      <button
                        className={
                          loggedAccount
                            ? `bg-dark p-2 rounded w-full mt-10 text-lg font-semibold text-bold cursor-pointer shadow-lg py-4 hover:text-lighter`
                            : "bg-dark p-2 rounded w-full mt-10 text-lg font-semibold text-bold cursor-not-allowed shadow-lg py-4 hover:text-lighter"
                        }
                        onClick={async () => {
                          if (await IsMigration()) {
                            ApproveTx();
                          } else {
                            setIsOpen(true);
                          }
                          // }
                          // console.log("not yet started");
                        }}
                      >
                        {spinLoading ? (
                          <div className="spinnerbtn">
                            <ClipLoader
                              color={color}
                              cssOverride={override}
                              loading={spinLoading}
                              size={30}
                            />
                            <p>Approve...</p>
                          </div>
                        ) : (
                          "Approve"
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={
                          loggedAccount
                            ? `bg-dark p-2 rounded w-full mt-10 text-lg font-semibold text-bold cursor-pointer shadow-lg py-4 hover:text-lighter`
                            : "bg-dark p-2 rounded w-full mt-10 text-lg font-semibold text-bold cursor-not-allowed shadow-lg py-4 hover:text-lighter"
                        }
                        onClick={() => handleMigrate()}
                        // disabled={!allowTransaction}
                      >
                        {spinLoading ? (
                          <div className="spinnerbtn">
                            <ClipLoader
                              color={color}
                              cssOverride={override}
                              loading={spinLoading}
                              size={30}
                            />
                            <p>Migrating...</p>
                          </div>
                        ) : (
                          "Migrate"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </>
            </div>
            {/* <div className="action-card w-full sm:w-2/3 p-3 shadow-md shadow-white-500 rounded bg-bgdark mt-5 box-shadow-lg first-letter">
            <h1 className="mb-3 font-bold">VESTING</h1>
            <>
              <div className="flex flex-col mb-9 ">
                <label
                  htmlFor="from"
                  className="text-lighter mb-2 flex justify-between"
                >
                  <h4>Amount Vesting</h4>
                  <h4 className=" px-3">{userVest}</h4>
                </label>
              </div>

              <div className="flex flex-col mt-3">
                <label className="text-lighter mb-2 flex justify-between ">
                  <h4>Amount Withdraw</h4>
                  <h4 className="px-3">{userWidrawal}</h4>
                </label>
                <hr className="text-lighter mb-6" />
                <h4 className="flex px-1  mx-2 mb-2 text-lighter justify-end">
                  {userSubtract}
                </h4>
                <p className="flex justify-between">
                  Next Claim Date:{" "}
                  <span className="text-lighter ">{userClaimDate} </span>
                </p>
                <>
                  <button
                    className={
                      isButtonDisabled
                        ? "bg-disable p-2 rounded w-full mt-10 text-lg font-semibold text-bold cursor-not-allowed  shadow-lg py-4 hover:text-lighter"
                        : `bg-dark p-2 rounded w-full mt-10 text-lg font-semibold text-bold cursor-pointer shadow-lg py-4 hover:text-lighter`
                    }
                    disabled={isButtonDisabled}
                    // disabled={!isButtonDisabled}
                    onClick={() => Claim()}
                  >
                    {claimLoading ? (
                      <div className="spinnerbtn">
                        <ClipLoader
                          color={color}
                          cssOverride={override}
                          loading={claimLoading}
                          size={30}
                        />
                        <p>Claiming...</p>
                      </div>
                    ) : (
                      "Claim"
                    )}
                  </button>
                </>
              </div>
            </>
          </div> */}
          </div>

          <div className="bida__video__content">
            <iframe
              src="https://youtube.com/embed/PGZG2NY1cjw"
              title="Bid Auction: How to Migrate from BIDA V1 to V2"
              width="400"
              height="340"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <p>Bid Auction: How to Migrate from BIDA V1 to V2</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
