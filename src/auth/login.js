import { useState } from 'react'
import React from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

// import Particles from '../components/particals';
import './login.css' 
export default function Login() {
  const [user, setUser] = useState('')
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  const redirectPath = location.state?.path || '/'

  const handleLogin = () => {
    auth.login(user)
    navigate(redirectPath, { replace: true })
  }



  return (
    <div className='login-screen'>

{/* <Particles id="tsparticles" /> */}

  {/* <div classNameName="wrapper  fadeInDown" style={{display:'flex',justifyContent:'center',padding:'100px',marginLeft:'16px',marginRight:'16px' , marginTop:'40px',backgroundColor:'transparent',borderRadius:'30px',}}>
    <div id='formContent'>
      <h2 style={{color:'#8355ad'}}>Login</h2> 
        <form>
        <div>
            <Input type="text" name="username"  id="username" classNameName="fadeIn second textField" placeholder="Username"  autoComplete='off' onChange={e => setUser(e.target.value)} 
            />
        </div>
        <div>
              <Input type={values.showPassword ? "text" : "password"}  classNameName="fadeIn second textField"   name="password"  id="password"  onChange={handlePasswordChange("password")} value={values.password} autoComplete='off' placeholder="Password" endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {values.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
        </div>
        <div>
        <input type="submit"  style={{ cursor: 'pointer', padding: '10px', width: '200px', borderRadius: '10px', backgroundColor: '#8355ad', marginTop: '10px',marginLeft:'10px', boxShadow: 'rgb(249 138 251 / 40%) 20px 18px 13px 0px', color:' #fff', transform: 'translateY(-7px)'}} value="Login" onClick={handleLogin} classNameName="fadeIn  fourth" />
        </div>
        </form>
    </div>
  </div> */}
 
    <div className='man-login'>
    <div className="bg-box">
    <div className="bg1"></div>
    <div className="bg2"></div>
    </div>
    <div className="form">
        <form>

    <label htmlFor="account">User name</label>
    <div className="input-box">
      <ion-icon className="prefix" name="person-outline"></ion-icon>
      <input type="text" id="account" placeholder='Username' onChange={e => setUser(e.target.value)}  />
    </div>
    <label htmlFor="password">Password</label>
    <div className="input-box">
      <ion-icon className="prefix" name="lock-closed-outline"></ion-icon>
      <input type={values.showPassword ? "text" : "password"}  placeholder='Password' id="password" onChange={handlePasswordChange("password")}  value={values.password} />
      <ion-icon   onClick={handleClickShowPassword}  onMouseDown={handleMouseDownPassword} className="switch-btn" name="eye-off-outline"></ion-icon>
    </div>
    {/* <div className="send-btn" > */}

    <input className="send-btn" style={{    display: 'flex',width: '150px'}}  type="submit"  onClick={handleLogin}>
      {/* login */}
    </input>
      {/* <ion-icon name="arrow-forward-circle-outline"></ion-icon> */}
    {/* </div> */}
    </form>
    </div>
    </div>



  </div>
  )
}
