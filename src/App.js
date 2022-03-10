import "./App.css";
import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CurrentAccountholderContext } from "../src/context/currentAccountholder.context";
import Navbar from "./components/Navbar";
import BankInterfacePage from "./pages/BankInterfacePage";
import UserInterfacePage from "./pages/UserInterfacePage";
import TransferPage from "./pages/TransferPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

function App() {
  // let { currentAccountholder, changeCurrentAccountholder } = useContext(
  //   CurrentAccountholderContext
  // );
  

  // let navigate = useNavigate();

  // useEffect(() => {
  //   const eventSource = new EventSource("http://localhost:4001/events");
  //   eventSource.onmessage = (event) => {
  //     const parsedData = JSON.parse(event.data);
  //     console.log(
  //       "In app.js, first logging parsedData before update: ",
  //       parsedData
  //     );

  //     const { dbUpdatedFromAccount } = parsedData;
  //     console.log(
  //       "In app.js, then logging currentAccountholder before update: ",
  //       currentAccountholder
  //     );

  //     const updatedCurrentAccountholder = {
  //       ...currentAccountholder,
  //       onChainAccount: dbUpdatedFromAccount,
  //     };
  //     console.log(
  //       "Still in app.js, finally logging updatedCurrentAccountholder after update: ",
  //       updatedCurrentAccountholder
  //     );

  //     changeCurrentAccountholder(updatedCurrentAccountholder);
  //     navigate("/user-interface");
  //   };
  // }, []);


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
      </Routes>
    </div>
  );
}

export default App;
