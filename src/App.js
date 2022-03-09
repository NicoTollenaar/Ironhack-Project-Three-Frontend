import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
  const [eventsArray, setEventsArray] = useState([]);
  // const [listening, setListening] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:4001/events");

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setEventsArray((eventsArray) => eventsArray.concat(parsedData));
    };
  }, []);

  console.log("In App.js (frontend) logging eventsArray: ", eventsArray);

  return (
    <div className="App">
      {/* {eventsArray.map((e) => (
        <p>{e}</p>
      ))} */}
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
