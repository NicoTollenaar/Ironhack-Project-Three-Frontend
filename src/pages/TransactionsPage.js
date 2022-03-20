import axios from "axios";
import { useParams } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { useState, useContext, useEffect } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";
import { providerUrl } from "./../utils/constants";

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

  function formatTransactions(){
    const currentAccount = accountType === "on-chain" ? currentAccountholder.onChainAccount : currentAccountholder.offChainAccount;

    console.log("Transactions page, currentAccountholder: ", currentAccountholder);
    console.log("Transactions page, logging currentAccount and .address: ", currentAccount);
    const formattedTransactions = transactions.map((transaction) => {
      let contraAccountAddress = transaction.fromAccountId.address === currentAccount.address ? transaction.toAccountId.address : transaction.fromAccountId.address;
      console.log("Transactions page, logging contraAccountAddress: ", contraAccountAddress);

      let transferType = (contraAccountAddress === currentAccountholder.onChainAccount.address || contraAccountAddress === currentAccountholder.offChainAccount.address) ? "Internal" : "External";
      let signedAmount = currentAccount.address === transaction.fromAccountId.address ? transaction.amount * -1 : transaction.amount;
      let href = providerUrl === "http://localhost:7545" ? null : `https://rinkeby.etherscan.io/tx/${transaction.txHash}`;
      return {
        _id: transaction._id,
        date: transaction.createdAt,
        signedAmount,
        contraAccountAddress, 
        transferType,
        txHash: transaction.txHash,
        href
        }
     });
     
     formattedTransactions.sort((a, b) => {
       if (a.createdAt > b.createdAt) {
         return 1;
     } else {
       return -1;
     }
    });
     return formattedTransactions;
  }

  const formattedTransactions = formatTransactions();
  console.log("In transactions page, logging formattedTransactions: ", formattedTransactions);
  const currentBalance = accountType === "on-chain" ? currentAccountholder.onChainAccount.balance : currentAccountholder.offChainAccount.balance;
  const initialBalance = formattedTransactions.reduce((acc, curr)=> {
                      return acc - curr.signedAmount;
                    }, accountType === "on-chain" ? currentAccountholder.onChainAccount.balance : currentAccountholder.offChainAccount.balance);

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
        <div className="col-7 mt-4">
            <div className="m-3 mx-5">
              <div className="card-body">
                <div className="d-flex flex-column align-items-start mx-5">
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
        <div className="col-3">
          <div className="card my-5 ms-5">
            <div className="card-body">
              <table className="table table-borderless table-sm">
                  <tbody>
                      <tr>
                        <td className="">
                          <h5 className="text-start">Current balance</h5>
                          </td>
                        <td className="text-start d-flex justify-content-between">
                          <h6>EUR {" "} </h6> 
                          <h6 className="me-4">{currentBalance}</h6>  
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start pe-5"><h6>Initial balance</h6></td>
                        <td>
                          <div className="d-flex flex-row justify-content-between">
                            <h6>EUR {" "}</h6> 
                            <h6 className="me-4">{initialBalance}</h6>  
                          </div>
                        </td>
                      </tr>
                    </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10 mt-3">
            <div className="col d-flex">
              <h4 className="mb-3">
                <b>Transactions</b>
              </h4>
            </div>
            <table className="table" id="transaction-table">
              <thead>
                  <tr>
                    <th className="text-start" scope="col">Date</th>
                    <th className="text-start" scope="col">Counterparty account</th>
                    <th className="text-start" scope="col">Tx hash</th>
                    <th className="text-start" scope="col">Transfer</th>
                    <th className="text-end" scope="col">Amount</th>
                  </tr>
              </thead>
              <tbody>
              {formattedTransactions.map((transaction, index)=> {
                return <tr key={transaction._id}>
                  <td className="text-start text-nowrap">{transaction.date}</td> 
                  <td className="text-start">{transaction.contraAccountAddress}</td> 
                  <td className="text-start">
                    {(transaction.txHash.slice(0,2) === "0x" && providerUrl !== "http://localhost:7545") ? <a id="this" target="_blank" href= { transaction.href } > {transaction.txHash}</a> : `${transaction.txHash}`}
                    </td>
                  <td className="text-start">{transaction.transferType}</td>
                  <td className="text-end d-flex justify-content-between">
                    <div>EUR</div> 
                    <div>
                    {transaction.signedAmount}
                    </div>
                    </td>
                </tr>
              })}
              </tbody>
            </table>
            <div className="initial-balance-wrapper d-flex justify-content-between w-100">
              <h6>Initial balance:</h6>
              <div className="d-flex justify-content-between">
                <h6 className="mx-2" >EUR </h6> 
                <h6>{" "}{initialBalance}</h6>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
     </div>
    </div> 
  )
}

export default TransactionsPage;
