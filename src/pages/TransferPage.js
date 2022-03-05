import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";

function TransferPage() {
  let backendUrl = useContext(BackendUrlContext);
  let { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  const [accountType, setAccountType] = useState("");
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
              <h5 className="d-flex mx-3 my-3 mt-3">
                {currentAccountholder.firstName}{" "}
                {currentAccountholder.lastName && currentAccountholder.lastName}{" "}
              </h5>
              <div className="from-wrapper d-flex mx-3 my-3">
                <h6>From account:</h6>
                <h6 className="mx-5">
                  {currentAccountholder.offChainAccount.address}
                </h6>
                <h6>
                  ({currentAccountholder.offChainAccount.accountType} account)
                </h6>
              </div>
              <div className="to-wrapper w-100 d-flex my-2">
                <h6 className="mx-3 me-4">To: </h6>
                <select
                  className="form-select form-select-sm w-25"
                  defaultValue={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option selected>Account Type</option>
                  <option value="on-chain">On-chain</option>
                  <option value="off-chain">Off-chain</option>
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
