import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";
const { AuthContext } = require("../context/auth.context");

function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);
  const { currentAccountholder } = useContext(CurrentAccountholderContext);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1 mx-5">ChainAccount</span>
        <div
          className="collapse navbar-collapse d-flex justify-content-evenly"
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav">
            <NavLink to="/bank-interface" className="mx-5">
              Bank Interface
            </NavLink>
            <NavLink to="/user-interface" className="mx-5">
              User Interface
            </NavLink>
          </div>
          <div className="navbar-nav">
            {isLoggedIn && <NavLink to="/logout">Logout</NavLink>}
            {!isLoggedIn && (
              <>
                <NavLink to="/login" className="mx-5">
                  Login
                </NavLink>
                <NavLink to="/signup" className="mx-5">
                  Signup
                </NavLink>
              </>
            )}
          </div>
          <div className="currentAccountholder-wrapper">
            {currentAccountholder && <h6>Current Accountholder is {currentAccountholder.firstName}</h6>}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
