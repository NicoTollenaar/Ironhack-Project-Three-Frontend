import axios from "axios";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import MoveFundsModal from "../components/MoveFundsModal";
import { useState, useContext, useEffect } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";
import { wssBackendUrl } from "./../utils/constants";

function UserInterfacePage() {
  const backendUrl = useContext(BackendUrlContext);
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  const [modalShow, setModalShow] = useState(false);
  const [moveFundsDirection, setMoveFundsDirection] = useState("");
  const [query, setQuery] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    changeCurrentAccountholder(currentAccountholder);
  }, []);

  // useEffect(() => {
  //   const eventSource = new EventSource(`${backendUrl}/events`);
  //   eventSource.onmessage = (event) => {
  //     const parsedData = JSON.parse(event.data);

  //     const { dbUpdatedFromAccount } = parsedData;

  //     console.log("eventSource.onmessage triggered, logging received data (dbUpdatedFromAccount): ", dbUpdatedFromAccount);
      
  //     const updatedCurrentAccountholder = {
  //       ...currentAccountholder,
  //       onChainAccount: dbUpdatedFromAccount,
  //     };
  //     changeCurrentAccountholder(updatedCurrentAccountholder);
  //     navigate("/user-interface");
  //   };
  //   eventSource.onerror = function(err) {
  //     console.error("EventSource failed:", err);
  //   };
  // }, []);

  useEffect(()=>{
    const socket = new WebSocket(wssBackendUrl);
    socket.onopen = function(event) {
      console.log("Websocket connection established, logging host and argument event: ", wssBackendUrl, event);
    };
    
    socket.onmessage = function(event) {
      console.log(`Websocket message: data received from server: ${event.data}`);
      
      const parsedData = JSON.parse(event.data);
      
      const { dbUpdatedFromAccount } = parsedData;
      
      console.log("socket.onmessage triggered, logging received data (dbUpdatedFromAccount): ", dbUpdatedFromAccount);
      
      const updatedCurrentAccountholder = {
        ...currentAccountholder,
        onChainAccount: dbUpdatedFromAccount,
      };
      changeCurrentAccountholder(updatedCurrentAccountholder);
      // navigate("/user-interface");
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`Websocket connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('Websocket connection closed, but abnormally, logging event:', event);
      }
    };
    
    socket.onerror = function(error) {
      console.log(`In socket.onerror, logging error.message: ${error.message}`);
    };
    
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const requestBody = { query };
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        const response = await axios.post(
          `${backendUrl}/accounts`,
          requestBody,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        changeCurrentAccountholder(response.data);
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
      <MoveFundsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        moveFundsDirection={moveFundsDirection}
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <form onSubmit={handleSubmit} className="d-flex flex-column">
              <div>
                <input
                  type="text"
                  className="form-control mx-3 my-5 w-75"
                  value={query}
                  placeholder="Search on accountholder name"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
          <div className="col-6">
            <div className="m-3">
              <div className="card-body d-flex flex-column align-items-start">
                <div className="d-flex flex-column align-items-start">
                  <h4 className="text-align-start">
                    Accountholder {currentAccountholder.firstName}
                  </h4>
                  <div className="my-3 w-100 total-balance-wrapper d-flex justify-content-between">
                    <h6 className="">
                      <b>Total Balance: </b>
                    </h6>
                    <h6>
                      <b>
                        EUR:{" "}
                        {currentAccountholder.onChainAccount.balance +
                          currentAccountholder.offChainAccount.balance}
                      </b>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row my-4">
          <div className="col-6 d-flex">
            <h4 className="mx-3">
              <b>On-chain account</b>
            </h4>
          </div>
          <div className="col-6 d-flex">
            <h4 className="mx-3">
              <b>Off-chain account</b>
            </h4>
          </div>
        </div>
        <div className="row">
          {/*  */}
          <div className="col-6">
            <div className="card m-3">
              <div className="card-body d-flex flex-column align-items-start w-75">
                <p className="d-flex w-100">
                  {currentAccountholder.onChainAccount.address}
                </p>
                <div className="my-3 w-100 total-balance-wrapper d-flex justify-content-between">
                  <h6 className="">
                    <b>Balance: </b>
                  </h6>
                  <h6>
                    <b>EUR: {currentAccountholder.onChainAccount.balance}</b>
                  </h6>
                </div>
                <Link to="/transactions">Transaction history</Link>
              </div>
            </div>
            <div className="button-container d-flex justify-content-start mx-3">
              <Button
                variant="primary"
                onClick={() => {
                  if (currentAccountholder.firstName) {
                    setMoveFundsDirection("off-chain");
                    setModalShow(true);
                  }
                }}
              >
                Move funds off-chain
              </Button>
              <button
                className="mx-4"
                onClick={() => navigate("/transfer/on-chain")}
              >
                Transfer
              </button>
            </div>
          </div>

          <div className="col-6">
            <div className="card m-3">
              <div className="card-body d-flex flex-column align-items-start w-75">
                <p className="d-flex w-100">
                  {currentAccountholder.offChainAccount.address}
                </p>
                <div className="my-3 w-100 total-balance-wrapper d-flex justify-content-between">
                  <h6>
                    <b>Balance: </b>
                  </h6>
                  <h6>
                    <b>EUR: {currentAccountholder.offChainAccount.balance}</b>
                  </h6>
                </div>
                <Link to="/transactions">Transaction history</Link>
              </div>
            </div>
            <div className="button-container d-flex justify-content-start mx-3">
              <Button
                variant="primary"
                onClick={() => {
                  if (currentAccountholder.firstName) {
                    setMoveFundsDirection("on-chain");
                    setModalShow(true);
                  }
                }}
              >
                Move funds on-chain
              </Button>
              <button
                className="mx-4"
                onClick={() => navigate("/transfer/off-chain")}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInterfacePage;
