import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BankInterfacePage from "./pages/BankInterfacePage";
import UserInterfacePage from "./pages/UserInterfacePage";
import TransferPage from "./pages/TransferPage";
import Header from "./components/Header";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <Header /> */}
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
          path="/transfer"
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
