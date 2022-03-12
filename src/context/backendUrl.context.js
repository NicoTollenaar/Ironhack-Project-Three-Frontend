// import "dotenv/config";

import { createContext, useState } from "react";
import { backendUrlConstant } from "../utils/constants";

const BackendUrlContext = createContext();

function BackendUrlProviderWrapper(props) {
  const [backendUrl, setBackEndUrl] = useState(backendUrlConstant);

  return (
    <BackendUrlContext.Provider value={backendUrl}>
      {props.children}
    </BackendUrlContext.Provider>
  );
}

export { BackendUrlContext, BackendUrlProviderWrapper };
