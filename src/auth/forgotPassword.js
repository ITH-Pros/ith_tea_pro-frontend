import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword, forgotPassword, verifyOtp } from "../services/auth/api";
import Toaster from "../components/Toaster";
import Loader from '../components/Loader/index'

function ForgotPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [passWordSection, setPassWordSection] = useState(false);
  const [otpLogId, setOtpLogId] = useState("");


  const navigate = useNavigate();


  const backToLogin = () => {
    navigate("/login");
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

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };


  const sendOtp = async (event) => {
    setLoading(true);
    event.preventDefault();
    const dataToSend = {
      email : email,
    };
    try {
      const response = await forgotPassword(dataToSend);
    setLoading(false);

      if (response.error) {
        setToasterMessage(response?.message);
        showToaster(true);
        console.log(response.error,'-----------------error')
      }
      else {
        setToasterMessage(response?.message);
        showToaster(true);
        // navigate("/reset-password");
        setShowOtp(true);
      }
    }
    catch (error) {
    setLoading(false);

      setToasterMessage(error?.error?.message);
      showToaster(true);
      console.log(error,'-----------------error')
    }
  };

  const verifyEmailOrOTP = async (event) => {
    setLoading(true);

    event.preventDefault();
    const dataToSend = {
      email : email,
      otp: otp,
    };
    // Make API call with dataToSend
    console.log(dataToSend,'---------------data to send ')
    try {
      const response = await verifyOtp(dataToSend);
    setLoading(false);

      if (response.error) {
        setToasterMessage(response?.message);
        showToaster(true);
        console.log(response,'-----------------3error')
      }
      else {
        setToasterMessage(response?.message);
        showToaster(true);
        console.log(response,'-----------------3success')
        setOtpLogId(response.data.otpLogId);
        // navigate("/reset-password");
        setPassWordSection(true);
        setShowOtp(false);

      }
    }
    catch (error) {
    setLoading(false);

      console.log(error,'-----------------5error')
    }
  };




  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const dataToSend = {
      password: newPassword,
      repeat: confirmPassword,
      otpLogId: otpLogId,
    };
    // Make API call with dataToSend

    try {
      const response = await changePassword(dataToSend);
      setLoading(false);
      if(response.error){
        setToasterMessage(response?.message);
        showToaster(true);
        console.log(response.error,'-----------------error')
      }
      else{
        setToasterMessage(response?.message);
        showToaster(true);
        setTimeout(() => {
          localStorage.clear();
        navigate("/login");

          window.location.reload();
        },1000)
      }
    }
    catch (error) {
      setLoading(false);

      setToasterMessage(error?.error?.message);
        showToaster(true);
      console.log(error,'-----------------error')
    }
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
            <h2>Forgot Password</h2>

            {!showOtp && !passWordSection && (
              <form onSubmit={sendOtp}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="loginButton" type="submit">
                Submit
              </button>
              <button onClick={backToLogin} className="loginButton" >
               Back to Login
              </button>
            </form>
            )
              }

           
            {showOtp && (
            <form onSubmit={verifyEmailOrOTP}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled
                />
              </div>
              <div>
                <label htmlFor="otp">OTP:</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                />
              </div>
              <button className="loginButton" type="submit">
                Submit
              </button>
              <button onClick={backToLogin} className="loginButton" >
               Back to Login
              </button>
            </form>
            )
              }



            {passWordSection && (
            <form onSubmit={handleSubmit}>
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
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
             
              <button className="loginButton" type="submit" disabled={isSubmitDisabled}>
                Submit
              </button>
              <button onClick={backToLogin} className="loginButton" >
               Back to Login
              </button>
            </form>
            )
              }


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

export default ForgotPassword;
