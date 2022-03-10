import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";
import { ethers } from "ethers";
import artifacts from "./../blockchainSources/artifacts/ChainAccountArtifacts";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import {
  chainAccountContractAddress,
  ETHAddressBank,
  DECIMALS,
} from "./../utils/constants";

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

  useEffect(() => {
    if (typeof window.ethereum !== undefined) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Account changed: ", accounts[0]);
        setUserMetaMaskWallet(accounts[0]);
      });
      window.ethereum.on("chainChanged", (chaindId) => {
        console.log("Chain ID changed: ", chaindId);
        setCurrentChain(chaindId);
      });
    } else {
      alert("Please install MetaMask to use this app!");
    }
  }, []);

  useEffect(() => {
    connectUserMetaMaskAccount()
      .then(() =>
        console.log(
          "userMetaMaskWallet, isConnected :",
          userMetaMaskWallet,
          isMetaMaskConnected
        )
      )
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setIsMetaMaskConnected(userMetaMaskWallet ? true : false);
  }, [userMetaMaskWallet]);

  async function connectUserMetaMaskAccount() {
    const accounts = await window.ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .then(() => window.ethereum.request({ method: "eth_requestAccounts" }));
    setUserMetaMaskWallet(accounts[0]);
    setIsMetaMaskConnected(true);
  }

  async function handleDisconnect() {
    setIsMetaMaskConnected(false);
    setUserMetaMaskWallet("");
    setErrorMessage("");
    navigate("/user-interface");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (fromAccountType === "off-chain" && accountType === "on-chain")
      setPendingMessage("Transaction being mined, please wait ...");
    let fromAccount,
      fromAccountId,
      newBalanceRecipientFrontend,
      newBalanceTransferorFrontend,
      propertyToUpdate,
      endpoint,
      txHash;
    switch (fromAccountType) {
      case "on-chain":
        fromAccount = currentAccountholder.onChainAccount;
        fromAccountId = currentAccountholder.onChainAccount._id;
        endpoint = "from-on-chain-account";
        propertyToUpdate = "onChainAccount";
        break;
      case "off-chain":
        fromAccount = currentAccountholder.offChainAccount;
        fromAccountId = currentAccountholder.offChainAccount._id;
        propertyToUpdate = "offChainAccount";
        endpoint = "from-off-chain-account";
        break;
      default:
        setErrorMessage("From account type must be specified");
        throw new Error("From account type must be specified");
    }

    if (amount > fromAccount.balance) {
      setErrorMessage("Sorry - insufficient funds!");
      return;
    }

    const requestBody = {
      fromAccountId,
      transferAmount: amount,
      recipientAccountType: accountType,
      recipientAccountAddress: address,
    };
    try {
      if (fromAccountType === "on-chain") {
        ({ newBalanceTransferorFrontend, newBalanceRecipientFrontend, txHash } =
          await transferFromOnChainAccount());
        requestBody.newBalanceRecipientFrontend = newBalanceRecipientFrontend;
        requestBody.newBalanceTransferorFrontend = newBalanceTransferorFrontend;
        requestBody.txHash = txHash;
      }

      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        const response = await axios.post(
          `${backendUrl}/transfer/${endpoint}`,
          requestBody,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        const { dbUpdatedFromAccount } = response.data;
        const updatedAccountholder = {
          ...currentAccountholder,
          [`${propertyToUpdate}`]: dbUpdatedFromAccount,
        };

        changeCurrentAccountholder(updatedAccountholder);
        setPendingMessage("");
        setErrorMessage("");
        setSuccessMessage("Blockchain transaction successful!");
        setTimeout(() => {
          handleDisconnect();
        }, 2000);
      } else {
        setErrorMessage("Unauthorized request (no webtoken found)");
        throw new Error("Unauthorized request (no webtoken found)");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  async function transferFromOnChainAccount() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const chainAccountContract = new ethers.Contract(
      chainAccountContractAddress,
      artifacts.abi,
      provider
    );
    const amountInCents = amount * 10 ** DECIMALS;
    const recipientAddress =
      accountType === "off-chain" ? ETHAddressBank : address;

    const tx = await chainAccountContract
      .connect(signer)
      .transfer(recipientAddress, amountInCents);
    setPendingMessage("Transaction is being mined, please wait ...");
    await tx.wait();

    if (tx) {
      setPendingMessage("");
      setSuccessMessage("Blockchain transaction succesful!");
    }

    const newBalanceTransferorFrontendHexInCents =
      await chainAccountContract.balanceOf(
        currentAccountholder.onChainAccount.address
      );

    const newBalanceTransferorFrontend =
      newBalanceTransferorFrontendHexInCents.toString() / 10 ** DECIMALS;

    let newBalanceRecipientFrontend;

    if (accountType === "on-chain") {
      const newBalanceRecipientFrontendHexInCents =
        await chainAccountContract.balanceOf(address);
      newBalanceRecipientFrontend =
        newBalanceRecipientFrontendHexInCents.toString() / 10 ** DECIMALS;
    } else {
      newBalanceRecipientFrontend = null;
    }
    return {
      newBalanceTransferorFrontend,
      newBalanceRecipientFrontend,
      txHash: tx.hash,
    };
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
                  required
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
                  required
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
                  required
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
          {isMetaMaskConnected && (
            <>
              <Alert variant={"info"}>MetaMask is connected</Alert>
              <br />
              <Button variant="warning" onClick={handleDisconnect}>
                Disconnect
              </Button>{" "}
            </>
          )}
          {errorMessage && (
            <div className="alert alert-danger m-5 text-center" role="alert">
              {errorMessage}
            </div>
          )}
          {pendingMessage && (
            <div className="alert alert-warning m-5 text-center" role="alert">
              {pendingMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success m-5 text-center" role="alert">
              {successMessage}
            </div>
          )}
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default TransferPage;
