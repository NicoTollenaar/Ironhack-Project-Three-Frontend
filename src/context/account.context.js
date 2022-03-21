import { createContext, useState } from "react";

const AccountsContext = createContext();

function AccountsProviderWrapper(props) {
  const [accounts, setAccounts ] = useState([]); 

  function updateAccounts(updatedObject) {
    console.log("In accounts context, logging accounts before update:", accounts);
    const newAccountsArray = [...accounts];
    const indexOfelementToUpdate = newAccountsArray.findIndex(e => e._id === updatedObject._id);
    newAccountsArray.splice(indexOfelementToUpdate, 1, updatedObject);
    console.log("In accounts context, logging newaccountsarray after update, :", newAccountsArray);

    setAccounts(newAccountsArray);
  }

    console.log("In accounts context, logging accounts after update function:", accounts);


  return (
    <AccountsContext.Provider
      value={{ accounts, updateAccounts }}
    >
      {props.children}
    </AccountsContext.Provider>
  );
}

export { AccountsContext, AccountsProviderWrapper };
