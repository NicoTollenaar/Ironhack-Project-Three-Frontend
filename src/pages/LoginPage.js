import axios from "axios";
import { useState, useContext } from "react";
import { BackendUrlContext } from "../context/backendUrl.context";
import { AuthContext } from "../context/auth.context";
import { useNavigate, NavLink } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const backendUrl = useContext(BackendUrlContext);
  let navigate = useNavigate();

  console.log("In loginpage, logging backendUrl: ", backendUrl);

  async function handleSubmit(e) {
    e.preventDefault();
    const requestBody = { email, password };
    try {
      const response = await axios.post(`${backendUrl}/login`, requestBody);
      console.log("response from axios: ", response);
      const { authToken } = response.data;
      console.log(
        "In LoginPage, handlesubmit, logging authToken receieved from server (response.data.authToken): ",
        authToken
      );
      storeToken(authToken);
      authenticateUser();
      setEmail("");
      setPassword("");
      navigate("/bank-interface");
    } catch (error) {
      console.log(error.response.data);
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  return (
    <div className="container-fluid">
      <div className="row g-3 align-items-center vh-100">
        <div className="col-4"></div>
        <div className="col-4 d-flex justify-content-center">
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <div>
              <input
                type="email"
                className="form-control mb-3"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                className="form-control mb-3"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Submit
            </button>
          </form>
        </div>
        <div className="align-self-start">
          Not yet registered? Signup <NavLink to="/signup">here.</NavLink>
        </div>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="col-4"></div>
      </div>
    </div>
  );
}

export default LoginPage;
