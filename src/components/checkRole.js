import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export const CheckRole = ({ children, role }) => {
    const { userDetails } = useAuth();
    if (userDetails.role !== role) {
        return <Navigate to="/" />;
    }
    return children;
};