import { createContext, useState } from "react";

const BackendUrlContext = createContext();

function BackendUrlProviderWrapper(props) {
  const [backendUrl, setBackEndUrl] = useState("http://localhost:4001");

  return (
    <BackendUrlContext.Provider value={backendUrl}>
      {props.children}
    </BackendUrlContext.Provider>
  );
}

export { BackendUrlContext, BackendUrlProviderWrapper };
