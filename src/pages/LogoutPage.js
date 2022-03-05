import { AuthContext } from "./../context/auth.context";
import { useContext, useEffect } from "react";

function Logout() {
  const { logOutUser } = useContext(AuthContext);

  useEffect(() => {
    logOutUser();
  }, []);

  return (
    <div className="m-5">
      <h1 className="m-5">Succesfully logged out.</h1>
      <br />
      <h1>Thank you for watching the demo</h1>
    </div>
  );
}

export default Logout;
