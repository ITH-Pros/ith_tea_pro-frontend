import React, { useEffect, useState } from "react";
import { setPasswordApi, verifyTokenApi } from "../services/user/api";

import { useParams, useNavigate } from "react-router-dom";

import "./index.css";
import Toaster from "../components/Toaster";
import { set } from "immutable";

function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState("");

  const params = useParams();
  console.log("params", params);

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value !== password) {
      setValidationError("Passwords do not match");
    } else {
      setValidationError("");
    }
  };

  useEffect(() => {
    oninit();
  }, []);

  const oninit = () => {
    verifyToken();
  };

  const verifyToken = async () => {
    let dataToSend = {
      token: params.token,
    };
    try {
      const response = await verifyTokenApi(dataToSend);
      if (response.error) {
        console.log("Password already setup");
		showToaster(true)
		setToasterMessage(response.message)	
        navigate("/login");
        return;
      } else {
		showToaster(true)
		setToasterMessage(response.message)
        setEmail(response?.data?.email);
        console.log("response", response);
      }
    } catch (error) {
		showToaster(true)
		setToasterMessage(error.message)

      navigate("/login");

      console.log("Error while getting user details");

      return error.message;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    } else {
      let dataToSend = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      };
      try {
        const response = await setPasswordApi(dataToSend);
        if (response.error) {
          console.log("Error while getting user details");

          return;
        } else {
          console.log("response", response);
          navigate("/login");
        }
      } catch (error) {
        console.log("Error while getting user details");
        return error.message;
      }
    }
  };

  const handleChange = (event) => {
    setPassword(event.target.value);
    // setConfirmPassword(event.target.value);
    if (event.target.value !== confirmPassword) {
      setValidationError("Passwords do not match");
    } else {
      setValidationError("");
    }
  };

  return (
    <div className="addUserFrom rightDashboard">
      <form className="password-form" onSubmit={handleSubmit}>
        <h4>Email : {email}</h4>
        <div className="form-group">
          <label>
            Password:
            <input type="password" value={password} onChange={handleChange} />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => handleChangeConfirmPassword(event)}
            />
          </label>
        </div>
        <div className="form-group">
          <p className="error">{validationError}</p>
        </div>
        {password === confirmPassword && (
          <div className="d-flex justify-content-end">
            <button variant="outline-primary" className="mr-3" type="submit">
              Submit
            </button>
          </div>
        )}
      </form>

	  {toaster && (
	<Toaster
	  message={toasterMessage}
	  show={toaster}
	  close={() => showToaster(false)}
	/>
  )}
    </div>
  );
}

export default PasswordForm;