import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";
import { ethers } from "ethers";
import artifacts from "./../blockchainSources/artifacts/ChainAccountArtifacts";
const ETHAddressBank = "0x03F04fDa3B6E6FA1783A5EDB810155e5F4dD5461";
const chainAccountContractAddress =
  "0x471184AE3a9632a3a65d846f961b3a4b8A9e416A";
const DECIMALS = 2;

function TransferPage() {
  let backendUrl = useContext(BackendUrlContext);
  let { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  const { fromAccountType } = useParams();
  const [accountType, setAccountType] = useState("");
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  const [currentChain, setCurrentChain] = useState("");
  const [userMetaMaskWallet, setUserMetaMaskWallet] = useState("");
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  let navigate = useNavigate();

  console.log(
    "On TransferPage, logging currentAccountholder (context) :",
    currentAccountholder,
    changeCurrentAccountholder
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (amount > currentAccountholder.offChainAccount.balance) {
      setErrorMessage("Sorry - insufficient funds!");
      return;
    }
    try {
      const requestBody = {
        fromAccountId: currentAccountholder.offChainAccount._id,
        transferAmount: amount,
        recipientAccountType: accountType,
        recipientAccountAddress: address,
      };
      console.log(
        "In TransferPage, logging requestBody to be provided to Axios as requestBody :",
        requestBody
      );
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        const response = await axios.post(
          `${backendUrl}/transfer`,
          requestBody,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log(
          "In TransferPage, handlesubmit, logging response from server on axios request (response.data): ",
          response.data
        );
        const updatedAccountholder = {
          ...currentAccountholder,
          offChainAccount: response.data,
        };
        changeCurrentAccountholder(updatedAccountholder);

        navigate("/user-interface");
      } else {
        setErrorMessage("Unauthorized request (no webtoken found)");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  async function transferFromOffChainAccount(storedToken) {}

  async function transferFromOnChainAccount(storedToken) {}

  function handleCancel() {
    setErrorMessage("");
    navigate("/user-interface");
  }

  return (
    <div className="container-fluid">
      <div className="row mt-5"></div>
      <div className="row mt-5">
        <div className="col-2"></div>
        <div className="col-8">
          <h3 className="d-flex mb-4">Transfer</h3>
        </div>
        <div className="col-2"></div>
      </div>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <form className="form" onSubmit={handleSubmit}>
            <div className="card">
              <h4 className="d-flex mx-3 mt-2">From:</h4>
              <h5 className="d-flex mx-3 mb-3 mt-2">
                Accountholder {currentAccountholder.firstName}{" "}
                {currentAccountholder.lastName && currentAccountholder.lastName}{" "}
              </h5>
              <div className="from-wrapper d-flex mx-3 mt-1 mb-3">
                <h6 className="text-capitalize">
                  {fromAccountType === "off-chain"
                    ? currentAccountholder.offChainAccount.accountType
                    : currentAccountholder.onChainAccount.accountType}{" "}
                  account:
                </h6>
                <p className="mx-3">
                  {fromAccountType === "off-chain"
                    ? currentAccountholder.offChainAccount.address
                    : currentAccountholder.onChainAccount.address}
                </p>
              </div>
              <div className="to-wrapper w-100 d-flex my-2">
                <h6 className="mx-3 me-4">To: </h6>
                <select
                  className="form-select form-select-sm w-25"
                  defaultValue={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option selected>Account Type</option>
                  <option value="on-chain">on-chain</option>
                  <option value="off-chain">off-chain</option>
                </select>
                <input
                  className="form-control form-control-sm w-100 ms-4"
                  type="text"
                  placeholder="Account number or ETH address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="amount-wrapper d-flex ms-3 my-5">
                <h6>Amount: </h6>
                <input
                  className="form-control form-control-sm ms-4 w-50"
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex my-3">
              <button type="submit" className="btn btn-secondary">
                Confirm
              </button>
              <button
                type="button"
                className="btn btn-secondary mx-5"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <div className="col-2"></div>
      </div>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 m-5">
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default TransferPage;
