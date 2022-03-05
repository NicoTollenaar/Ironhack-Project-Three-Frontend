import axios from "axios";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import MoveFundsModal from "../components/MoveFundsModal";
import { useState, useContext, useEffect } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";

function UserInterfacePage() {
  const backendUrl = useContext(BackendUrlContext);
  const [modalShow, setModalShow] = useState(false);
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  const [query, setQuery] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    changeCurrentAccountholder(currentAccountholder);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const requestBody = { query };
      console.log(
        "In loginPage, logging query to be provided to Axios as requestBody :",
        query
      );
      const storedToken = localStorage.getItem("authToken");
      console.log(
        "In LoginPage, handle submit, logging retrieved from localstorage: ",
        storedToken
      );
      if (storedToken) {
        const response = await axios.post(
          `${backendUrl}/accounts`,
          requestBody,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log(
          "In userInterface, handlesubmit, logging response from server on axios request (response.data): ",
          response.data
        );
        changeCurrentAccountholder(response.data);
        console.log(
          "In userinfterfacepage, logging currentAccountholder (from context) :",
          currentAccountholder
        );
      } else {
        setErrorMessage("Unauthorized request (no webtoken found)");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  console.log(
    "In userinterfact, logging currentAccoutholder after update :",
    currentAccountholder
  );

  return (
    <>
      <MoveFundsModal show={modalShow} onHide={() => setModalShow(false)} />
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
                  <h5 className="text-align-start">
                    {currentAccountholder.firstName}
                  </h5>
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
              <b>Off-chain account</b>
            </h4>
          </div>
          <div className="col-6 d-flex">
            <h4 className="mx-3">
              <b>On-chain account</b>
            </h4>
          </div>
        </div>
        <div className="row">
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
                  if (currentAccountholder.firstName) setModalShow(true);
                }}
              >
                Move funds on-chain
              </Button>
              <button className="mx-4" onClick={() => navigate("/transfer")}>
                Transfer
              </button>
            </div>
          </div>
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
              <button>Move off-chain</button>
              <button className="mx-4">Transfer</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInterfacePage;
