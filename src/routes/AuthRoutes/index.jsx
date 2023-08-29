// import Auth from '@pages/Auth';
import React from "react";
import { Route, Routes } from "react-router";
import Login from "@pages/Auth/Login/login";
import ForgotPassword from "@pages/Auth/ForgotPassword/forgotPassword";
import ResetPassword from "@pages/Auth/ResetPassword/resetPassword";
import PasswordForm from "@pages/Auth/setup-password";
import { AuthContainer } from "@pages/Auth";

const LoginRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthContainer />}>
        <Route index element={<Login />} />
        <Route element={<ForgotPassword />} path="forgot-password" />
        <Route element={<ResetPassword />} path="otp" />
        <Route element={<PasswordForm />} path="newpassword" />
        {/* <Route path="/set-password/:token" element={<PasswordForm />} /> */}
      </Route>
    </Routes>
  );
};

export default LoginRoutes;
