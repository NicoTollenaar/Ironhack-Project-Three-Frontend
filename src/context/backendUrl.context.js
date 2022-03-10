// import "dotenv/config";

import { createContext, useState } from "react";
import { backendUrlConstant } from "../utils/constants";

const BackendUrlContext = createContext();

function BackendUrlProviderWrapper(props) {
  const [backendUrl, setBackEndUrl] = useState(backendUrlConstant);

  console.log("In backendurl context, logging bankendUrl: ", backendUrl);

  return (
    <BackendUrlContext.Provider value={backendUrl}>
      {props.children}
    </BackendUrlContext.Provider>
  );
}

export { BackendUrlContext, BackendUrlProviderWrapper };
