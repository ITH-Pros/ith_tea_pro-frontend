import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth/api";
import Toaster from "../components/Toaster";
import Loader from '../components/Loader/index'

function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backToLogin = () => {
    navigate("/profile");
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    if (event.target.value !== confirmPassword) {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value !== newPassword) {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);

    event.preventDefault();
    const dataToSend = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
      console.log(dataToSend,'---------------data to send ')
    // Make API call with dataToSend
    try {
      const response = await resetPassword(dataToSend);
      setLoading(false);

      if (response.error) {
        setToasterMessage(response?.message);
        setShowToaster(true);
        console.log(response?.message||'response.error')
      }
      else {
        console.log(response?.message||'else')

        setToasterMessage(response?.message);
        setShowToaster(true);
        setTimeout(() => {
          localStorage.clear();
        navigate("/login");

          window.location.reload();
        },1000)
        // navigate("/profile");
      }
    }
    catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message||'Something Went Wrong');
      setShowToaster(true);
      console.log(error?.error?.message||'error')

    }

  };

  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-screen">
    <div className="man-login">
      <div className="bg-box">
        <div className="bg1"></div>
        <div className="bg2"></div>
      </div>
      <div className="loginContent form">
        <a href="https://pro.ith.tech/login">
          <img src={require("../assests/img/logo.png")} alt="logo" />
        </a>
        <div className="text">Tea Pro</div>
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old Password:</label>
          <div className="password-field">
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              value={oldPassword}
              onChange={handleOldPasswordChange}
              required
            />
            <button
              type="button"
              className="eye-button"
              onClick={toggleShowOldPassword}
            >
              {showOldPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <div className="password-field">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <button
              type="button"
              className="eye-button"
              onClick={toggleShowNewPassword}
            >
              {showNewPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <button
              type="button"
              className="eye-button"
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨"}️
        </button>
        </div>
        {newPassword !== confirmPassword && (
          <p className="error-msg">Passwords do not match</p>
        )}
      </div>
      <button className="loginButton" type="submit" disabled={isSubmitDisabled}>
        Submit
      </button>
      <button onClick={backToLogin} className="loginButton" >
               Back
              </button>
    </form>
  </div>
  </div>
      </div>
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />)}
      {loading ? <Loader /> : null}
      
    </div>
    
  );
}

export default ResetPassword;  