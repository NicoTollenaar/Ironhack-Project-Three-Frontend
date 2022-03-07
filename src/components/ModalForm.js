import { useNavigate } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useState, useContext, useEffect } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";
import axios from "axios";
import { ethers } from "ethers";
import artifacts from "./../blockchainSources/artifacts/ChainAccountArtifacts";
const ETHAddressBank = "0x03F04fDa3B6E6FA1783A5EDB810155e5F4dD5461";
const chainAccountContractAddress =
  "0x471184AE3a9632a3a65d846f961b3a4b8A9e416A";
const DECIMALS = 2;

function ModalForm(props) {
  const [amount, setAmount] = useState(0);
  const [currentChain, setCurrentChain] = useState("");
  const [userMetaMaskWallet, setUserMetaMaskWallet] = useState("");
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const backendUrl = useContext(BackendUrlContext);
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );

  // async function getArtifactsAndContractAddress() {
  //   try {
  //     const responseArtifacts = await fetch(
  //       "./../blockchainSources/artifacts/ChainAccount.json"
  //     );
  //     artifacts = await responseArtifacts.json();

  //     const responseContractAddress = await fetch(
  //       "./../blockchainSources/config.json"
  //     );
  //     chainAccountContractAddress = await responseContractAddress.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // useEffect(() => {
  //   getArtifactsAndContractAddress().then(() => {
  //     console.log("chainAccountContractAddress: ", chainAccountContractAddress);
  //     console.log("artifacts: ", artifacts);
  //   });
  // }, []);

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
    if (props.moveFundsDirection === "off-chain") {
      connectUserMetaMaskAccount()
        .then(() =>
          console.log(
            "userMetaMaskWallet, isConnected :",
            userMetaMaskWallet,
            isMetaMaskConnected
          )
        )
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    setIsMetaMaskConnected(userMetaMaskWallet ? true : false);
  }, [userMetaMaskWallet]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const chainAccountContract = new ethers.Contract(
    chainAccountContractAddress,
    artifacts.abi,
    provider
  );

  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setPendingMessage("Transaction being mined, please wait ...");

    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        if (props.moveFundsDirection === "on-chain") {
          await transferFundsOnChain(storedToken);
          navigate("/user-interface");
        } else if (props.moveFundsDirection === "off-chain") {
          await transferFundsOffChain(storedToken);
          navigate("/user-interface");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("Blockchain transaction failed!");
      }
    } else {
      setErrorMessage("Unauthorized request (no webtoken found)");
    }
  }

  async function transferFundsOnChain(storedToken) {
    if (amount > currentAccountholder.offChainAccount.balance) {
      console.log("sorry insufficient funds");
      setErrorMessage("Sorry - insufficient funds!");
      return;
    }
    const requestBody = {
      fromAccountId: currentAccountholder.offChainAccount._id,
      transferAmount: amount,
      recipientAccountType: currentAccountholder.onChainAccount.accountType,
      recipientAccountAddress: currentAccountholder.onChainAccount.address,
    };
    try {
      const response = await axios.post(
        `${backendUrl}/move-on-chain`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log(
        "In ModalForm, function transferFundsOnChain, logging response from server on axios request (response.data): ",
        response.data
      );
      const updatedAccountholder = {
        ...currentAccountholder,
        offChainAccount: response.data.dbUpdatedFromAccount,
        onChainAccount: response.data.dbUpdatedRecipientAccount,
      };
      console.log(
        "In ModalFormP, function transferFundsOnChain, logging updatedAccountholder: ",
        updatedAccountholder
      );
      changeCurrentAccountholder(updatedAccountholder);
      setPendingMessage("");
      setSuccessMessage("Blockchain transaction successful!");
      setTimeout(() => {
        props.closeModal();
      }, 3000);
    } catch (error) {
      console.log(error);
      setPendingMessage("");
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  async function transferFundsOffChain(storedToken) {
    if (amount > currentAccountholder.onChainAccount.balance) {
      console.log("sorry insufficient funds");
      setErrorMessage("Sorry - insufficient funds!");
      return;
    }
    try {
      const signerAddress = await signer.getAddress();
      console.log("signerAddress : ", signerAddress);

      const amountInCents = amount * 10 ** DECIMALS;

      const tx = await chainAccountContract
        .connect(signer)
        .moveFundsOffChain(amountInCents);
      await tx.wait();
      console.log("tx : ", tx);

      // ********* the code below should work too (instead of using interface). Problem with below code is that completion of transaction cannot or is not await before retrieving balance, meaning that balance is outdated

      // const chainAccountInterface = new ethers.utils.Interface(artifacts.abi);
      // const functionParameters = [amountInCents];
      // const functionSignature = chainAccountInterface.encodeFunctionData(
      //   "moveFundsOffChain",
      //   functionParameters
      // );
      // console.log("functionSignature :", functionSignature);

      // const transactionParameters = {
      //   to: chainAccountContractAddress,
      //   from: signerAddress,
      //   data: functionSignature,
      // };

      // const txHash = await window.ethereum.request({
      //   method: "eth_sendTransaction",
      //   params: [transactionParameters],
      // });

      // ****************

      const balanceOfAccountholderInCents =
        await chainAccountContract.balanceOf(signerAddress);
      const balanceOfBankInCents = await chainAccountContract.balanceOf(
        ETHAddressBank
      );
      const balanceOfAccountholder =
        balanceOfAccountholderInCents / 10 ** DECIMALS;
      const balanceOfBank = balanceOfBankInCents / 10 ** DECIMALS;

      console.log("Balance of accountholder: ", balanceOfAccountholder);
      console.log("Balance of bank: ", balanceOfBank);
      setSuccessMessage(
        `Transaction successful - new OnChainBalance is ${balanceOfAccountholder}`
      );
      const requestBody = {
        fromAccountId: currentAccountholder.onChainAccount._id,
        newFromAccountBalance: balanceOfAccountholder,
        transferAmount: amount,
        recipientAccountType: currentAccountholder.offChainAccount.accountType,
        recipientAccountAddress: currentAccountholder.offChainAccount.address,
      };
      const response = await axios.post(
        `${backendUrl}/move-off-chain`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log(
        "In Modal Form, function moveFundsOffChain, logging response from server on axios request (response.data): ",
        response.data
      );
      const updatedAccountholder = {
        ...currentAccountholder,
        onChainAccount: response.data.dbUpdatedFromAccount,
        offChainAccount: response.data.dbUpdatedRecipientAccount,
      };
      console.log(
        "In Modal Form, function moveFundsOffChain, logging updatedAccountholder: ",
        updatedAccountholder
      );
      changeCurrentAccountholder(updatedAccountholder);
      setPendingMessage("");
      setSuccessMessage("Blockchain transaction successful!");
      setTimeout(() => {
        props.closeModal();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }

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
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Confirm
        </Button>
      </Form>
      {isMetaMaskConnected && (
        <>
          <Alert variant={"info"}>MetaMask is connected</Alert>
          <br />
          <Button variant="info" onClick={handleDisconnect}>
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
    </>
  );
}

export default ModalForm;
