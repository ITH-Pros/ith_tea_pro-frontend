/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { setPasswordApi, verifyTokenApi } from "../services/user/api";
import { useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./index.css";
import Toaster from "../components/Toaster";

function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState("");
  const params = useParams();

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
        showToaster(true);
        setToasterMessage(response.message);
        navigate("/login");
        return;
      } else {
        showToaster(true);
        setToasterMessage(response.message);
        setEmail(response?.data?.email);
      }
    } catch (error) {
      showToaster(true);
      setToasterMessage(error.message);
      navigate("/login");
      return error.message;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password?.trim() || !confirmPassword?.trim()) {
      return;
    }

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
          return;
        } else {
          localStorage.setItem("passwordReset", true);
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
    if (event.target.value !== confirmPassword) {
      setValidationError("Passwords do not match");
    } else {
      setValidationError("");
    }
  };

  return (
    <div className="set-password">
      <form className="password-form" onSubmit={handleSubmit}>
        <h4>Set Password</h4>
        <div className="hed-pass">
          <h4>Email : {email}</h4>
        </div>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label> Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(event) => handleChangeConfirmPassword(event)}
            placeholder="Confirm Password"
          />
        </Form.Group>
        <div className="form-group">
          <p className="error">{validationError}</p>
        </div>
        {password === confirmPassword && (
          <div className="d-flex justify-content-center">
            <Button variant="primary" className="submit-button" type="submit">
              Submit
            </Button>
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
