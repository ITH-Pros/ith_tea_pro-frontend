// import Auth from '@pages/Auth';
import React from 'react';
import { Route, Routes } from 'react-router';
import Login from '@pages/Auth/Login/login';
import ForgotPassword from '@pages/Auth/ForgotPassword/forgotPassword';
import ResetPassword from '@pages/Auth/ResetPassword/resetPassword';
import PasswordForm from '@pages/Auth/setup-password';

const LoginRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}>
        <Route index element={<Login />} path="/" />
        <Route element={<ForgotPassword />} path="forgot-password" />
        <Route element={<ResetPassword />} path="otp" />
        <Route element={<PasswordForm />} path="newpassword" />
      </Route>
    </Routes>
  );
};

export default LoginRoutes;
