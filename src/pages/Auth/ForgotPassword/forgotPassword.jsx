import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  verifyOtp,
  changePassword,
} from "@services/auth/api";
import Loader from "@components/Shared/Loader/index";
import { toast } from "react-toastify";
import logo from '@assets/img/logo.png';
import { useMutation } from 'react-query';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const forgotPasswordMutation = useMutation(forgotPassword);
  const verifyOtpMutation = useMutation(verifyOtp);
  const changePasswordMutation = useMutation(changePassword);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    otp: Yup.string().required("OTP is required"),
    newPassword: Yup.string().required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!values.otpLogId) {
          const response = await forgotPasswordMutation.mutateAsync({ email: values.email });
          if (response.error) {
            toast.info(response.message);
          } else {
            toast.info(response.message);
            formik.setFieldValue("otpLogId", response.data.otpLogId);
          }
        } else if (!values.passWordSection) {
          const response = await verifyOtpMutation.mutateAsync({
            email: values.email,
            otp: values.otp,
          });
          if (response.error) {
            toast.info(response.message);
          } else {
            toast.info(response.message);
            formik.setFieldValue("passWordSection", true);
          }
        } else {
          const response = await changePasswordMutation.mutateAsync({
            password: values.newPassword,
            repeat: values.confirmPassword,
            otpLogId: values.otpLogId,
          });
          if (response.error) {
            toast.info(response.message);
          } else {
            toast.info(response.message);
            localStorage.clear();
            navigate("/login");
            window.location.reload();
          }
        }
      } catch (error) {
        toast.info(error?.error?.message);
      }
      setSubmitting(false);
    },
  });

  const backToLogin = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = (fieldName) => {
    formik.setFieldValue(fieldName, !formik.values[fieldName]);
  };

  return (
    <div className="login-screen">
      {/* ... Your other JSX ... */}
      <div className="man-login">
        <div className="bg-box">
          <div className="bg1"></div>
          <div className="bg2"></div>
        </div>
        <div className="loginContent form">
          {/* ... Your other JSX ... */}

          <a href="https://pro.ith.tech/login">
            <img src={logo} alt="logo" />
          </a>
          <div className="text mb-1">Tea Pro</div>
          <div>
            <h4 className="text-center">Forgot Password</h4>

            {!showOtp && !passWordSection && (
              <form onSubmit={formik.handleSubmit}>
                {formik.values.otpLogId === "" && (
                  <div className="field mt-4">
                    <span className="fa fa-user"></span>
                    <input
                      type="email"
                      placeholder="Email"
                      id="email"
                      {...formik.getFieldProps("email")}
                    />
                  </div>
                )}

                {formik.values.otpLogId !== "" && (
                  <div className="field mt-4">
                    <span className="fa fa-user"></span>
                    <input
                      type="email"
                      id="email"
                      value={formik.values.email}
                      disabled
                    />
                  </div>
                )}

                {formik.values.passWordSection && (
                  <div className="field mt-4">
                    <span className="fa fa-lock"></span>
                    <div className="password-field">
                      <input
                        placeholder="New Password"
                        type={
                          formik.values.showNewPassword ? "text" : "password"
                        }
                        id="newPassword"
                        {...formik.getFieldProps("newPassword")}
                      />
                      <button
                        type="button"
                        className="eye-button"
                        onClick={() =>
                          togglePasswordVisibility("showNewPassword")
                        }
                      >
                        <i
                          style={{
                            position: "absolute",
                            top: "12px",
                            cursor: "pointer",
                          }}
                          name="showPassword"
                          className={
                            formik.values.showNewPassword
                              ? "fa fa-eye"
                              : "fa fa-eye-slash"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>
                )}

                {formik.values.passWordSection && (
                  <div className="field">
                    <span className="fa fa-lock"></span>
                    <div className="password-field">
                      <input
                        placeholder="Confirm Password"
                        type={
                          formik.values.showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        id="confirmPassword"
                        {...formik.getFieldProps("confirmPassword")}
                      />
                      <button
                        type="button"
                        className="eye-button"
                        onClick={() =>
                          togglePasswordVisibility("showConfirmPassword")
                        }
                      >
                        <i
                          style={{
                            position: "absolute",
                            top: "12px",
                            cursor: "pointer",
                          }}
                          name="showPassword"
                          className={
                            formik.values.showConfirmPassword
                              ? "fa fa-eye"
                              : "fa fa-eye-slash"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  className="loginButton"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </button>
                <button
                  onClick={backToLogin}
                  className="btn text-primary mt-2 pull-right"
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
          {formik.isSubmitting && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
