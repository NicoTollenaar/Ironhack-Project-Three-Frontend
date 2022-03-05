import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BackendUrlProviderWrapper } from "./context/backendUrl.context";
import { AuthProviderWrapper } from "./context/auth.context";
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <BackendUrlProviderWrapper>
        <AuthProviderWrapper>
          <App />
        </AuthProviderWrapper>
      </BackendUrlProviderWrapper>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
