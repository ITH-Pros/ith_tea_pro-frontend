import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword, forgotPassword, verifyOtp } from "../services/auth/api";

function ForgotPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [showOtp, setShowOtp] = useState(false);
  const [passWordSection, setPassWordSection] = useState(false);


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
    event.preventDefault();
    const dataToSend = {
      // email : email,
      otp: otp,
    };
    // Make API call with dataToSend
    try {
      const response = await forgotPassword(dataToSend);
      if(response.error){
        console.log(response.error,'-----------------error')
      }
      else{
        // navigate("/reset-password");
        setShowOtp(true);
      }
    }
    catch (error) {
      console.log(error,'-----------------error')
    }
  };

  const verifyEmailOrOTP = async (event) => {
    event.preventDefault();
    const dataToSend = {
      email : email,
      otp: otp,
    };
    // Make API call with dataToSend
    try {
      const response = await verifyOtp(dataToSend);
      if(response.error){
        console.log(response.error,'-----------------error')
      }
      else{
        // navigate("/reset-password");
        setPassWordSection(true);
      }
    }
    catch (error) {
      console.log(error,'-----------------error')
    }
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
      otp: otp,
    };
    // Make API call with dataToSend

    try {
      const response = await changePassword(dataToSend);
      if(response.error){
        console.log(response.error,'-----------------error')
      }
      else{
        navigate("/login");
      }
    }
    catch (error) {
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
    </div>
  );
}

export default ForgotPassword;
