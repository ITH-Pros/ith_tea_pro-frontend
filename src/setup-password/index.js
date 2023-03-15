import React, { useEffect, useState } from "react";
import { setPasswordApi, verifyTokenApi } from "../services/user/api";

import {useParams , useNavigate} from "react-router-dom";

import "./index.css";

function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const navigate = useNavigate();

	const params = useParams();
	console.log("params", params)


  useEffect(() => {
	oninit();
	  }, []);

  const oninit = () => {
	verifyToken();
  }

 const verifyToken = async () => {
	let dataToSend = {
		token: params.token
	}
	try {
	  const response = await verifyTokenApi(dataToSend);
	  if (response.error) {
		console.log("Error while getting user details");
		//   setLoading(false);
		return;
	  } else {

		setEmail(response?.data?.email)
		//   setCurrentUser(response.data);
		// patchValues(response.data);
		console.log("response", response)
	  }
	} catch (error) {
	  console.log("Error while getting user details");
	//   setLoading(false);
	  return error.message;
	}
};


  const handleSubmit = async (event) => {
    event.preventDefault();

	let dataToSend = {
		email: email,
		password: password,
		confirmPassword: confirmPassword
	}
	try {
	  const response = await setPasswordApi(dataToSend);
	  if (response.error) {
		console.log("Error while getting user details");
		//   setLoading(false);
		return;
	  } else {
		//   setCurrentUser(response.data);
		// patchValues(response.data);
		console.log("response", response)
		navigate("/login")
	  }
	} catch (error) {
	  console.log("Error while getting user details");
	//   setLoading(false);
	  return error.message;
	}



   
  };

  const handleChange = (event) => {
    setPassword(event.target.value);
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
		<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
	  </label>
	</div>
	<div className="d-flex justify-content-end">
      <button variant="outline-primary"
						className="mr-3" type="submit">Submit</button>
	</div>
    </form>
	</div>
  );
}

export default PasswordForm;
