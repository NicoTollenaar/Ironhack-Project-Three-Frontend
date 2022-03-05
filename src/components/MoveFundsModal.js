import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";

function MoveFundsModal() {
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = useContext(BackendUrlContext);
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  let navigate = useNavigate();

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
        recipientAccountType: currentAccountholder.onChainAccount.accountType,
        recipientAccountAddress: currentAccountholder.onChainAccount.address,
      };
      console.log(
        "In TransferPage, logging requestBody to be provided to Axios as requestBody :",
        requestBody
      );
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        const response = await axios.post(
          `${backendUrl}/move-on-chain`,
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
          offChainAccount: response.data.onChainAccount,
          onChainAccount: response.data.offChainAccount,
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="input-amount">Amount</label>
          <input
            className="form-control"
            id="input-amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => e.target.value}
          />
        </div>

        <div className="form-group">
          <button className="form-control btn btn-primary btn-sm" type="submit">
            Submit
          </button>
        </div>
      </form>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </>
  );
}

export default MoveFundsModal;
