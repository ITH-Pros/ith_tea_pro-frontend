import React from 'react';
import { Routes, Route } from 'react-router';
import AuthRoutes from '../routes/AuthRoutes';
import ProtectedRoutes from '../routes/ProtectedRoutes';

const NavigationRoutes = () => {
  return (
    <Routes>
      <Route path="login/*" element={<AuthRoutes />} />

      <Route
        path="/*"
        element={<ProtectedRoutes /> }
      />
    </Routes>
  );
};

export default NavigationRoutes;
