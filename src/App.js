import "./App.css";
import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CurrentAccountholderContext } from "./context/currentAccountholder.context";
import { TransactionContext } from "./context/transaction.context";
import { AccountsContext } from "./context/account.context";
import Navbar from "./components/Navbar";
import BankInterfacePage from "./pages/BankInterfacePage";
import UserInterfacePage from "./pages/UserInterfacePage";
import TransferPage from "./pages/TransferPage";
import TransactionsPage from "./pages/TransactionsPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import { wssBackendUrl } from "./utils/constants";


function App() {
  const { currentAccountholder, updateCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );
  const { transactions, addToTransactions } = useContext(TransactionContext);
  const { accounts, updateAccounts } = useContext(AccountsContext);
  
 useEffect(()=>{
    function createWebSocketConnection(){
      let socket = new WebSocket(wssBackendUrl);
      socket.onopen = function(event) {
        console.log("Websocket connection established, logging host and argument event: ", wssBackendUrl, event);
      };
  
      socket.onmessage = function(event) {
        
        if (event.data.toString() === "ping") {
          console.log(event.data);
          socket.send("pong");
        } else {
          try {
            const parsedData = JSON.parse(event.data);

            const { dbUpdatedFromAccount, dbNewTransaction, dbUpdatedRecipientAccount } = parsedData;
            
            console.log("Websocket messaged received, logging received data (parsedData): ", parsedData);
            
            updateCurrentAccountholder("onChainAccount", dbUpdatedFromAccount);
            addToTransactions(dbNewTransaction);
            updateAccounts(dbUpdatedFromAccount);
            updateAccounts(dbUpdatedRecipientAccount);
          } catch(err) {
            console.log("Data received is invalid json, logging received data (event.data): ", event.data);
          }
        }
      }

      socket.onerror = event => {
        socket.close();
        console.log("A websocket error occurred, logging error: ", event);
      }

      socket.onclose = function(event) {
        if (event.wasClean) {
          console.log(`Websocket connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
          console.log('Websocket connection closed abnormally, logging event:', event);
          socket = null;
          createWebSocketConnection();
        }
      };
    };

    createWebSocketConnection();

  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
        <Route path="/logout" element={<LogoutPage />} />
        <Route
          path="/bank-interface"
          element={
            <IsPrivate>
              <BankInterfacePage />
            </IsPrivate>
          }
        />
        <Route
          path="/user-interface"
          element={
            <IsPrivate>
              <UserInterfacePage />
            </IsPrivate>
          }
        />
        <Route
          path="/"
          element={
            <IsPrivate>
              <UserInterfacePage />
            </IsPrivate>
          }
        />
        <Route
          path="/transfer/:fromAccountType"
          element={
            <IsPrivate>
              <TransferPage />
            </IsPrivate>
          }
        />
       <Route
          path="/transactions/:accountType"
          element={
            <IsPrivate>
              <TransactionsPage />
            </IsPrivate>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
