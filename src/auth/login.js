import React,{ useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { loginUser } from "../services/auth/api";
import "./login.css";
import { useAuth } from "./AuthProvider";
import Toaster from "../components/Toaster";

export default function Login() {

    const { login, accessToken } = useAuth();
    const [toasterMessage, setToasterMessage] = useState("");
    const [toaster, showToaster] = useState(false);
    const [loginFormValue, setLoginFormValue] = useState({
      email: "",
      password: "",
      showPassword: false,
    });

  useEffect(() => {
    let passwordReset = localStorage.getItem("passwordReset");
    if (passwordReset) {
      showToaster(true);
      setToasterMessage("Password set up successfully");
      localStorage.removeItem("passwordReset");
    }
  }, []);



  const updateLoginFormValues = (e) => {
    setLoginFormValue({ ...loginFormValue, [e.target.name]: e.target.value });
  };

  const showHidePassword = () => {
    setLoginFormValue({
      ...loginFormValue,
      showPassword: !loginFormValue.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginFormValue.email || !loginFormValue.password) {
      showToaster(true);
      setToasterMessage("Email & Password is required.");
      return;
    }
    let dataToSend = loginFormValue;
    try {
      const userLogin = await loginUser(dataToSend);
      if (userLogin.error) {
        showToaster(true);
        setToasterMessage(
          userLogin?.message || "Please check login credential"
        );
      } else {
        login(userLogin?.data);
        localStorage.setItem(
          "profileCompleted",
          userLogin?.data.user.profileCompleted
        );
      }
    } catch (error) {
      showToaster(true);
      setToasterMessage(error?.message || "Please check login credential");
    }
  };

  return (
    <>
      {accessToken ? (
        <Navigate to="/" replace />
      ) : (
        <div className="login-screen">
          <div className="man-login">
            <div className="bg-box">
              <div className="bg1"></div>
              <div className="bg2"></div>
            </div>
            <div className="loginContent form">
              <a href="https://projects.ith.tech/login">
                <img src={require("../assests/img/logo.png")} alt="logo" />
              </a>
              <div className="text">Tea Pro</div>
              <form>
                <div className="field">
                  <span className="fa fa-user"></span>
                  <input
                    type="email"
                    placeholder="Email Id"
                    name="email"
                    onChange={updateLoginFormValues}
                  />
                  {/* <label>Email Id</label> */}
                </div>

                <div className="field">
                  <span className="fa fa-lock"></span>
                  <input
                    type={loginFormValue.showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={updateLoginFormValues}
                  ></input>
                  <i
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "21px",
                      cursor: "pointer",
                    }}
                    name="showPassword"
                    onClick={showHidePassword}
                    onMouseDown={handleMouseDownPassword}
                    className={
                      loginFormValue.showPassword
                        ? "fa fa-eye"
                        : " fa fa-eye-slash"
                    }
                  ></i>
                </div>
                <button className="loginButton" onClick={handleLogin}>
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
    </>
  );
}
