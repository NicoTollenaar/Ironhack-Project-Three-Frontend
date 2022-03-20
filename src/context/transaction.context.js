import { createContext, useState } from "react";

const TransactionContext = createContext();

function TransactionProviderWrapper(props) {
  const [transactions, setTransactions] = useState([]);
//     _id: "",
//     fromAccountId: {
//         _id: {},
//         accountholder: {},
//         accountType: "",
//         address: "",
//         balance: null,
//     },
//     toAccountId: {
//         _id: {},
//         accountholder: {},
//         accountType: "",
//         address: "",
//         balance: null,
//     },
//     amount: 0,
//     txHash: "",
//     balance: 0,
//     createdAt: ""
//   });

  function addToTransactions(newTransactions) {
    setTransactions(transactions => transactions.concat(newTransactions));
  }

  return (
    <TransactionContext.Provider
      value={{ transactions, addToTransactions }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
}

export { TransactionContext, TransactionProviderWrapper };
