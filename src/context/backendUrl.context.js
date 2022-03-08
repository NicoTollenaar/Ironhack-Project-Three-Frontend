import "dotenv/config";

import { createContext, useState } from "react";

const BackendUrlContext = createContext();

function BackendUrlProviderWrapper(props) {
  const [backendUrl, setBackEndUrl] = useState(
    process.env.CHAINACCOUNT_API_URL
  );

  return (
    <BackendUrlContext.Provider value={backendUrl}>
      {props.children}
    </BackendUrlContext.Provider>
  );
}

export { BackendUrlContext, BackendUrlProviderWrapper };
