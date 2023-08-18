import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "@services/auth/api";
import logo from "@assets/img/logo.png";
import "./login.css";
import { toast } from "react-toastify";
import { useAuth } from "../../../utlis/AuthProvider";
import { useMutation } from 'react-query';


const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  const handleForgotClick = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const showHidePassword = (values, setFieldValue) => {
    setFieldValue("showPassword", !values.showPassword);
  };

  const loginMutation = useMutation(loginUser, {
    onSuccess: (data) => {
      if (data?.error) {
        toast.dismiss();
        toast.info(data?.message || 'Please check login credentials');
      } else {
        login(data?.data);
        localStorage.setItem(
          'profileCompleted',
          data?.data.user.profileCompleted
        );
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || 'Please check login credentials');
    }
  });

  const handleLogin = (values) => {
    loginMutation.mutate(values);
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
              <a href="https://pro.ith.tech/login">
                <img src={logo} alt="logo" />
              </a>
              <div className="text">Tea Pro</div>
              <Formik
              initialValues={{
                email: "",
                password: "",
                showPassword: false,
              }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
              >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="field">
                    <span className="fa fa-user"></span>
                    <Field type="email" name="email" placeholder="Email Id" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="field">
                    <span className="fa fa-lock"></span>
                    <Field
                      type={values.showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                    />
                    <i
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "21px",
                        cursor: "pointer",
                      }}
                      onClick={() => showHidePassword(values, setFieldValue)}
                      className={
                        values.showPassword
                          ? "fa fa-eye"
                          : " fa fa-eye-slash"
                      }
                    ></i>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <button className="loginButton" type="submit">
                    Log in
                  </button>
                  <button
                    onClick={handleForgotClick}
                    className="btn text-primary mt-2 pull-right"
                  >
                    Forgot Password
                  </button>
                </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
