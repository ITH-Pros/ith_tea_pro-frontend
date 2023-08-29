import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { forgotPassword, verifyOtp, changePassword } from "@services/auth/api";
import Loader from "@components/Shared/Loader/index";
import { toast } from "react-toastify";
import logo from "@assets/img/logo.png";
import { useMutation } from "react-query";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const forgotPasswordMutation = useMutation(forgotPassword);
  const verifyOtpMutation = useMutation(verifyOtp);
  const changePasswordMutation = useMutation(changePassword);
  const [passWordSection, setPassWordSection] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpLogId, setOtpLogId] = useState("");
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validationSchema = () => {
    if (!showOtp && !passWordSection)
      return Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
      });

    if (showOtp)
      return Yup.object().shape({
        otp: Yup.string().required("OTP is required"),
      });

    if (passWordSection)
      return Yup.object().shape({
        newPassword: Yup.string()
          .nullable(true)
          .required("New Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
          .nullable(true)
          .required("Confirm Password is required"),
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
      try {
        if (!showOtp && !passWordSection) {
          const response = await forgotPasswordMutation.mutateAsync({
            email: values.email,
          });
          if (response.error) {
            toast.info(response.message);
          } else {
            toast.info(response.message);
            setShowOtp(true);
          }
        } else if (showOtp) {
          const response = await verifyOtpMutation.mutateAsync({
            email: values.email,
            otp: values.otp,
          });
          if (response.error) {
            toast.info(response.message);
          } else {
            toast.info(response.message);
            setOtpLogId(response.data.otpLogId);
            setPassWordSection(true);
            setShowOtp(false);
          }
        } else {
          const response = await changePasswordMutation.mutateAsync({
            password: values.newPassword,
            repeat: values.confirmPassword,
            otpLogId: otpLogId,
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

            <form onSubmit={formik.handleSubmit}>
              {!showOtp && !passWordSection && (
                <div className="field mt-4">
                  <span className="fa fa-user"></span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger pull-right">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              )}

              {showOtp && (
                <React.Fragment>
                  <div className="field mt-4">
                    <span className="fa fa-user"></span>
                    <input
                      type="email"
                      id="email-filled"
                      value={formik.values.email}
                      disabled
                    />
                  </div>
                  <div className="field mt-4">
                    <span className="fa fa-lock"></span>
                    <input
                      placeholder="OTP"
                      type="text"
                      id="otp"
                      {...formik.getFieldProps("otp")}
                    />
                    {formik.touched.otp && formik.errors.otp ? (
                      <div className="text-danger pull-right">
                        {formik.errors.otp}
                      </div>
                    ) : null}
                  </div>
                </React.Fragment>
              )}

              {passWordSection && (
                <div className="field mt-4">
                  <span className="fa fa-lock"></span>
                  <div className="password-field">
                    <input
                      placeholder="New Password"
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      {...formik.getFieldProps("newPassword")}
                    />
                    <button
                      type="button"
                      className="eye-button"
                      onClick={toggleShowNewPassword}
                    >
                      <i
                        style={{
                          position: "absolute",
                          top: "12px",
                          cursor: "pointer",
                        }}
                        name="showPassword"
                        className={
                          showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"
                        }
                      ></i>
                    </button>
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                      <div className="text-danger pull-right">
                        {formik.errors.newPassword}
                      </div>
                    ) : null}
                  </div>
                  <div className="field">
                    <span className="fa fa-lock"></span>
                    <div className="password-field">
                      <input
                        placeholder="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        {...formik.getFieldProps("confirmPassword")}
                      />
                      <button
                        type="button"
                        className="eye-button"
                        onClick={toggleShowConfirmPassword}
                      >
                        <i
                          style={{
                            position: "absolute",
                            top: "12px",
                            cursor: "pointer",
                          }}
                          name="showPassword"
                          className={
                            showConfirmPassword
                              ? "fa fa-eye"
                              : "fa fa-eye-slash"
                          }
                        ></i>
                      </button>
                      {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword ? (
                        <div className="text-danger pull-right">
                          {formik.errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>
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
          </div>
          {formik.isSubmitting && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
