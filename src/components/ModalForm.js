import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useContext } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";

function ModalForm() {
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = useContext(BackendUrlContext);
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );

  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("In Modal, handlesubmit called");
    if (amount > currentAccountholder.offChainAccount.balance) {
      console.log("sorry insufficient funds");
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
        "In ModalPage, logging requestBody to be provided to Axios as requestBody :",
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
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            min="0"
            placeholder="Amount"
            defalutValue={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Confirm
        </Button>
      </Form>
      {errorMessage && (
        <div className="alert alert-danger m-5 text-center" role="alert">
          {errorMessage}
        </div>
      )}
    </>
  );
}

export default ModalForm;
