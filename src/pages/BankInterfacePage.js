import axios from "axios";
import { Link } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { useState, useContext, useEffect } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";


function BankInterfacePage() {
  const backendUrl = useContext(BackendUrlContext);
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  const [ accountholders, setAccountholders ] = useState([]);

  useEffect(() => {
    getAccountholders()
      .then(accountholders => setAccountholders(accountholders))
      .catch(err => console.log(err));
  }, []);

  async function getAccountholders() {
    try {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        const response = await axios.get(
          `${backendUrl}/accounts`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log("In bank interface page, logging response.data: ", response.data);
        return response.data;
      } else {
        console.log("Unauthorized request (no webtoken found)");
      }
    } catch (error) {
      console.log(error.response);
    }
  }

  const totalOnChainLiabilities = accountholders.reduce((acc, curr) => {
    return acc + curr.onChainAccount.balance;
  }, 0);
  const totalOffChainLiabilities = accountholders.reduce((acc, curr) => {
    return acc + curr.offChainAccount.balance;
  }, 0);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4 mt-4">
          <table className="table table-borderless ms-5">
            <tbody>
              <tr>
                <td className="text-start"><h1>Bank</h1></td>
                <td></td>
              </tr>
              <tr>
                <td className="text-start px-5">Total liabilites off-chain accounts</td>
                <td className="text-start" >
                  <div className="d-flex justify-content-between">
                    <div>EUR</div>  
                    <div>{totalOnChainLiabilities}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-5">Total liabilities on-chain accounts</td>
                <td className="text-start">
                <div className="d-flex justify-content-between">
                    <div>EUR</div>  
                    <div>{totalOffChainLiabilities}</div>
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="text-start"><b>Total liabilities</b></td>
                <td className="text-start">
                  <div className="d-flex justify-content-between">
                  <b>EUR</b>
                  <b>{totalOffChainLiabilities + totalOnChainLiabilities}</b>
                  </div>
                </td>
              </tr>
              </tbody>
              </table>
        </div>
        <div className="col"></div>
        <div className="row">
            <div className="col d-flex mt-5">
              <h4 className="mx-5 mt-4 mb-3">
                <b>Accounts</b>
              </h4>
            </div>
        </div>
        <div className="row">
          <div className="col-10 mt-3">
            <table className="table mx-5">
              <thead>
                  <tr>
                    <th className="text-start" scope="col">Accountholder</th>
                    <th className="text-start" scope="col">On-chain account (ETH Address)</th>
                    <th className="text-start" scope="col">On-chain balance</th>
                    <th className="text-start" scope="col">Off-chain account (IBAN)</th>
                    <th className="text-start" scope="col">Off-chain balance</th>
                    <th className="text-end" scope="col">Total</th>
                  </tr>
              </thead>
              <tbody>
              {accountholders.map((accountholder)=> {
                return <tr key={accountholder._id}>
                  <td className="text-start"><Link to={"/user-interface"} onClick={e => changeCurrentAccountholder(accountholder)}>{accountholder.firstName}</Link></td>
                  <td className="text-start"><Link to={`/transactions/on-chain`} onClick={e => changeCurrentAccountholder(accountholder)}>{accountholder.onChainAccount.address}</Link></td>
                  <td className="text-start">
                    <div className="d-flex justify-content-between w-50 ms-2">
                      <div> EUR</div>
                      <div>{accountholder.onChainAccount.balance}</div>
                    </div>
                  </td> 
                  <td className="text-start"><Link to={`/transactions/off-chain`} onClick={e => changeCurrentAccountholder(accountholder)}>{accountholder.offChainAccount.address}</Link></td> 
                  <td className="text-start"> 
                  <div className="d-flex justify-content-between w-50 ms-2">
                    <div>EUR</div>
                    <div>{accountholder.offChainAccount.balance}</div>
                  </div>
                  </td> 
                  <td className="text-start"> 
                  <div className="d-flex justify-content-between w-100 ms-2">
                    <div>EUR</div>
                    <div>{accountholder.offChainAccount.balance + accountholder.onChainAccount.balance}</div>
                  </div>
                  </td> 
                </tr>
              })}
              </tbody>
            </table>
          </div>
        </div>
     </div>
    </div>
  )
}

export default BankInterfacePage;
