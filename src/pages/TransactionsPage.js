import axios from "axios";
import { useParams } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { useState, useContext, useEffect } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";


function TransactionsPage() {
  const backendUrl = useContext(BackendUrlContext);
  const { accountType } = useParams();
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  const [ transactions, setTransactions ] = useState([]);

  useEffect(() => {
    getTransactions()
      .then(transactions => setTransactions(transactions))
      .catch(err => console.log(err));
  }, []);

  // function formatTransactions(){
  //   const currentAccount = accountType === "on-chain" ? currentAccountholder.onChainAccount : currentAccountholder.offChainAccount;
  //   const formattedTransactions = transactions.map(transaction => {
  //     return {
  //       date: transaction._createdAt,
  //       amount,

  //     }
  //   })

  // }

  async function getTransactions() {
    const currentAccount = accountType === "on-chain" ? currentAccountholder.onChainAccount : currentAccountholder.offChainAccount;
    try {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        const response = await axios.get(
          `${backendUrl}/transactions/${currentAccount._id}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log("In Transactions page, logging response.data: ", response.data);
        return response.data;
      } else {
        console.log("Unauthorized request (no webtoken found)");
      }
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6 mt-4">
            <div className="m-3">
              <div className="card-body">
                <div className="d-flex flex-column align-items-start">
                  <h5 className="text-align-start">
                    Account: {accountType === "on-chain" ? `${currentAccountholder.onChainAccount.address} (on-chain)` : `${currentAccountholder.offChainAccount.address} (off-chain)`}
                  </h5>
                  <div className="my-3 w-100 total-balance-wrapper d-flex justify-content-between">
                    <h6>
                         Accountholder: {currentAccountholder.firstName}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="col-4">
          <div className="card my-5">
            <div className="card-body">
              <table className="table table-borderless table-sm">
                  <tbody>
                      <tr>
                        <td className="text-start px-5"><h5>Current balance</h5></td>
                        <td className="text-start"><h6>EUR 
                          {accountType === "on-chain" ? `${currentAccountholder.onChainAccount.balance}` : `${currentAccountholder.offChainAccount.balance}`}
                        </h6></td>
                      </tr>
                      <tr>
                        <td className="text-start px-5"><h6>Initial balance</h6></td>
                        <td className="text-start"><h6>EUR [initial balance]</h6></td>
                      </tr>
                    </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col d-flex mt-5">
              <h4 className="mx-5 mt-4 mb-3">
                <b>Transactions</b>
              </h4>
            </div>
        </div>
        <div className="row">
          <div className="col-10 mt-3">
            <table className="table mx-5">
              <thead>
                  <tr>
                    <th className="text-start" scope="col">Date</th>
                    <th className="text-start" scope="col">Counterparty</th>
                    <th className="text-start" scope="col">Account</th>
                    <th className="text-start" scope="col">Transfer type</th>
                    <th className="text-start" scope="col">Tx hash</th>
                    <th className="text-start" scope="col">Amount</th>
                    <th className="text-start" scope="col">Balance</th>
                  </tr>
              </thead>
              <tbody>
              {/* {transactions.map((transaction)=> {
                return <tr key={transaction._id}>
                  <a href=""></a>
                  <td className="text-start">EUR {transaction._createdAt}</td> 
                  <td className="text-start"><a target="_blank" href=" ">{transaction.txHash}</a></td>
                  <td className="text-start"> from [name]</td>
                  <td className="text-start">from [account]</td> 
                  <td className="text-start">To [account]</td> 
                  <td className="text-start">Amount EUR [+/- amount]</td> 
                  <td className="text-start">Balance EUR [+/- amount]</td> 
                </tr>
              })} */}
              </tbody>
            </table>
            <div className="initial-balance-wrapper d-flex justify-content-between mx-5">
              <h6>Initial balance:</h6>
              <h6>EUR: [to be calculated]</h6>
            </div>
          </div>
        </div>
     </div>
    </div> 
  )
}

export default TransactionsPage;
