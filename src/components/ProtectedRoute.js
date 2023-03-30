import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  return children;
};
