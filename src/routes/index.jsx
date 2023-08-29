import React from "react";
import { Routes, Route } from "react-router";
import AuthRoutes from "../routes/AuthRoutes";
import ProtectedRoutes from "../routes/ProtectedRoutes";
import PasswordForm from "@pages/Auth/setup-password";

const NavigationRoutes = () => {
  return (
    <Routes>
      <Route path="login/*" element={<AuthRoutes />} />
      <Route path="/set-password/:token" element={<PasswordForm />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
};

export default NavigationRoutes;
