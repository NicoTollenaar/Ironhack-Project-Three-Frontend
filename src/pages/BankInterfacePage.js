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
  const [ accounts, setAccounts ] = useState([]);

  useEffect(() => {
    getAccounts()
      .then(accounts => setAccounts(accounts))
      .catch(err => console.log(err));
  }, []);

  async function getAccounts() {
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

  const onChainAccounts = accounts.filter(e => e.accountType === "on-chain");
  const offChainAccounts = accounts.filter(e => e.accountType === "off-chain");

  function passCurrentAccountholder(accountholder){
      const accountholderOnChainAccount = onChainAccounts.find((account) => account.accountholder._id === accountholder._id);
      const accountholderOffChainAccount = offChainAccounts.find((account) => account.accountholder._id === accountholder._id);
      const populatedAccountholder = {
        ...accountholder,
        offChainAccount: accountholderOffChainAccount,
        onChainAccount: accountholderOnChainAccount
      };
      console.log("Bankinterfacepage, in passCurrentAccountholder, logging populatedAccountholder: ", populatedAccountholder);
      changeCurrentAccountholder(populatedAccountholder);  
  }

  // console.log("In bank interface page, logging accounts: ", onChainAccounts, offChainAccounts);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4 mt-4">
          <table className="table table-borderless ms-5">
            <tbody>
              <tr>
                <td className="text-start"><h4>Bank</h4></td>
                <td></td>
              </tr>
              <tr>
                <td className="text-start px-5">Total liabilites off-chain accounts</td>
                <td className="text-start">EUR [sum to be calculated</td>
              </tr>
              <tr>
                <td className="text-start px-5">Total liabilities on-chain accounts</td>
                <td className="text-start">EUR [sum to be calculated]</td>
              </tr>
              <tr className="">
                <td className="text-start"><b>Total liabilities</b></td>
                <td className="text-start"><b>EUR: [sum to be calculated]</b></td>
              </tr>
              </tbody>
              </table>
        </div>
        <div className="col"></div>
        <div className="row">
            <div className="col-6 d-flex">
            <h4 className="mx-5 mt-4 mb-3">
              <b>On-chain accounts</b>
            </h4>
          </div>
          <div className="col-6 d-flex">
            <h4 className="mt-4 mb-3">
              <b>Off-chain accounts</b>
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="card mx-5">
              <div className="card-body">
                <table className="table table-sm table-borderless">
                  <tbody>
                  {onChainAccounts.map((account)=> {
                    return <tr key={account._id}>
                      <td className="text-start">{account.accountholder.firstName}</td>
                      <td className="text-center">
                        <Link to={"/user-interface"} onClick={e => passCurrentAccountholder(account.accountholder)}>{account.address}</Link>
                      </td>
                      <td className="text-start">EUR {account.balance}</td> 
                    </tr>
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-6">
              <div className="card">
              <div className="card-body">
                <table className="table table-sm table-borderless">
                  <tbody>
                  {offChainAccounts.map((account)=> {
                    return <tr key={account._id}>
                      <td className="text-start">{account.accountholder.firstName}</td>
                      <td className="text-center">
                        <Link to={"/user-interface"} onClick={e => passCurrentAccountholder(account.accountholder)}>{account.address}</Link>
                      </td>
                      <td className="text-start">EUR {account.balance}</td> 
                    </tr>
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


        </div>
     </div>
    </div>
      
  )
}

export default BankInterfacePage;
