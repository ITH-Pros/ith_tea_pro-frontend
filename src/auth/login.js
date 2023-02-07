import { useState } from 'react'
import React from "react";
import { Navigate } from 'react-router-dom'
import { loginUser } from '../services/auth/api'

// import Particles from '../components/particals';
import './login.css'
import { useAuth } from './AuthProvider';
export default function Login() {
  const { login, accessToken } = useAuth();

  const [loginFormValue, setLoginFormValue] = useState({
    email: '',
    password: '',
    showPassword: false
  })

  const updateLoginFormValues = (e) => {
    setLoginFormValue({ ...loginFormValue, [e.target.name]: e.target.value })
  }
  const showHidePassword = () => {
    setLoginFormValue({ ...loginFormValue, showPassword: !loginFormValue.showPassword })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };



  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginFormValue.email || !loginFormValue.password) {
      return
    }
    let dataToSend = loginFormValue
    try {
      const userLogin = await loginUser(dataToSend);
      // setLoading(false);
      if (userLogin.error) {
        // toast.error(userLogin.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
      } else {
        // toast.success("Submitted succesfully !", {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        // setRatings(userLogin.data);
        login(userLogin.data);
      }
    } catch (error) {
      // setLoading(false);
    }

  };

  return (
    <>
      {
        accessToken ?
          <Navigate to="/" replace />
          :
          <div className='login-screen'>

            <div className='man-login'>
              <div className="bg-box">
                <div className="bg1"></div>
                <div className="bg2"></div>
              </div>
              <div className="loginContent form">
                <img src={require('../assests/img/logo.png')} alt="logo" />
                <div className="text">Tea Pro</div>
                <form >
                  <div className="field">
                    <span className="fa fa-user"></span>
                    <input type="email" placeholder="Email Id" name='email' onChange={updateLoginFormValues} />
                    {/* <label>Email Id</label> */}
                  </div>

                  <div className="field">
                    <span className="fa fa-lock"></span>
                    <input type={loginFormValue.showPassword ? "text" : "password"} name='password' placeholder="Password" onChange={updateLoginFormValues} >

                    </input>
                    <i style={{ position: 'relative', top: '25px', right: '28px', cursor: 'pointer' }} name='showPassword' onClick={showHidePassword} onMouseDown={handleMouseDownPassword} className={loginFormValue.showPassword ? "fa fa-eye-slash" : "fa fa-eye"} ></i>
                    {/* <label>Password</label> */}
                  </div>
                  <button className='loginButton' onClick={handleLogin}>Log in</button>
                  <div className="or">Or</div>
                  <div className="icon-button">
                    <span className="facebook">Forget Password?</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
      }

    </>


  )
}
