import { useState } from "react";

function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataToSend = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
      console.log(dataToSend,'---------------data to send ')
    // Make API call with dataToSend
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
      <button type="submit" disabled={isSubmitDisabled}>
        Submit
      </button>
    </form>
  </div>
  );
}

export default ResetPassword;  