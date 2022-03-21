import { createContext, useState } from "react";

const CurrentAccountholderContext = createContext();

function CurrentAccountholderProviderWrapper(props) {
  const [currentAccountholder, setCurrentAccountholder] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    offChainAccount: {
      accountType: "off-chain",
      address: "",
      balance: 0,
    },
    onChainAccount: {
      accountType: "off-chain",
      address: "",
      balance: 0,
    },
  });

  function changeCurrentAccountholder(newAccountHolder) {
    setCurrentAccountholder(newAccountHolder);
  }

  function updateCurrentAccountholder(key, value) {
     const updatedCurrentAccountholder = {
              ...currentAccountholder,
              [`${key}`]: value,
            };
    setCurrentAccountholder(updatedCurrentAccountholder)
  }

  return (
    <CurrentAccountholderContext.Provider
      value={{ currentAccountholder, changeCurrentAccountholder, updateCurrentAccountholder }}
    >
      {props.children}
    </CurrentAccountholderContext.Provider>
  );
}

export { CurrentAccountholderContext, CurrentAccountholderProviderWrapper };
