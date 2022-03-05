import axios from "axios";
import { useState, useContext } from "react";
import { BackendUrlContext } from "../context/backendUrl.context";
import { useNavigate, NavLink } from "react-router-dom";

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  let navigate = useNavigate();
  const backendUrl = useContext(BackendUrlContext);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("handlesubmit called");
    const requestBody = { firstName, lastName, email, organization, password };
    console.log("In handle submit, logging body: ", requestBody);
    try {
      const response = await axios.post(`${backendUrl}/signup`, requestBody);
      console.log("response from axios: ", response);
      setFirstName("");
      setLastName("");
      setEmail("");
      setOrganization("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  // if (isLoading) {
  //   return <h1>Connecting to server, please wait ...</h1>;
  // }

  return (
    <div className="container-fluid">
      <div className="row g-3 align-items-center vh-100">
        <div className="col-4"></div>
        <div className="col-4 d-flex justify-content-center">
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <div>
              <input
                type="text"
                className="form-control mb-3"
                value={firstName}
                placeholder="First name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                className="form-control mb-3"
                value={lastName}
                placeholder="Last name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

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
                type="text"
                className="form-control mb-3"
                value={organization}
                placeholder="Organization"
                onChange={(e) => setOrganization(e.target.value)}
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
          Already signed up? Login <NavLink to="/login">here.</NavLink>
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

export default SignupPage;
