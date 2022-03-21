import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BackendUrlProviderWrapper } from "./context/backendUrl.context";
import { CurrentAccountholderProviderWrapper } from "./context/currentAccountholder.context";
import { AuthProviderWrapper } from "./context/auth.context";
import { TransactionProviderWrapper } from "./context/transaction.context";
import { AccountsProviderWrapper } from "./context/account.context";
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AccountsProviderWrapper>
        <TransactionProviderWrapper>
          <CurrentAccountholderProviderWrapper>
            <BackendUrlProviderWrapper>
              <AuthProviderWrapper>
                <App />
              </AuthProviderWrapper>
            </BackendUrlProviderWrapper>
          </CurrentAccountholderProviderWrapper>
        </TransactionProviderWrapper>
      </AccountsProviderWrapper>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
