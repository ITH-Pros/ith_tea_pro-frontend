import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPassword } from "@services/auth/api";
import Loader from "@components/Shared/Loader/index";
import { toast } from "react-toastify";
import logo from "@assets/img/logo.png"
import { useMutation } from 'react-query';

const ResetPassword = ({ handleModalClose }) => {
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string().required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      resetPasswordMutation.mutate({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
    },
  });

  const resetPasswordMutation = useMutation(resetPassword, {
    onSuccess: (data) => {
      if (data.error) {
        toast.info(data.message);
      } else {
        toast.info(data.message);
        localStorage.clear();
        handleModalClose();
        // Uncomment the following if you want to navigate after resetting
        // setTimeout(() => {
        //   navigate("/login");
        //   window.location.reload();
        // }, 2000);
      }
    },
    onError: (error) => {
      toast.info(
        error?.error?.message || "Something Went Wrong in reset password"
      );
    }
  });

  const togglePasswordVisibility = (fieldName) => {
    formik.setFieldValue(fieldName, !formik.values[fieldName]);
  };

  const backToLogin = () => {
    navigate("/profile");
  };

  return (
    <div className="login-screen">
      {/* ... Your JSX ... */}
      <div className="man-login">
        <div className="bg-box">
          <div className="bg1"></div>
          <div className="bg2"></div>
        </div>
        <div className="loginContent form">
          <a href="https://pro.ith.tech/login">
            <img src={logo} alt="logo" />
          </a>
          <div className="text mb-0">Tea Pro</div>
          <div>
            <h4 className="text-center mt-2">Reset Password</h4>
            <form onSubmit={formik.handleSubmit}>
              <div className="field mt-4">
                <span className="fa fa-lock"></span>
                <div className="password-field">
                  <input
                    placeholder="Old Password"
                    type={formik.values.showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    {...formik.getFieldProps("oldPassword")}
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => togglePasswordVisibility("showOldPassword")}
                  >
                    {/* Your icon code */}
                  </button>
                </div>
                {/* Error message */}
                {formik.touched.oldPassword && formik.errors.oldPassword ? (
                  <p className="error-msg">{formik.errors.oldPassword}</p>
                ) : null}
              </div>
              <div className="field mt-0">
                {/* New Password field similar to above */}
                <span className="fa fa-lock"></span>
                <div className="password-field">
                  <input
                    placeholder="New Password"
                    type={formik.values.showNewPassword ? "text" : "password"}
                    id="newPassword"
                    {...formik.getFieldProps("newPassword")}
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => togglePasswordVisibility("showNewPassword")}
                  >
                    {/* Your icon code */}
                  </button>
                  </div>
              </div>
              <div className="field">
                {/* Confirm Password field similar to above */}
                <span className="fa fa-lock"></span>
                <div className="password-field">
                  <input
                    placeholder="Confirm Password"
                    type={
                      formik.values.showConfirmPassword ? "text" : "password"
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
                    {/* Your icon code */}
                  </button>
                  </div>
                {formik.values.newPassword !==
                  formik.values.confirmPassword && (
                  <p className="error-msg">Passwords do not match</p>
                )}
              </div>
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
                Back
              </button>
            </form>
          </div>
        </div>
      </div>

      {formik.isSubmitting && <Loader />}
    </div>
  );
};

export default ResetPassword;