import { Navigate } from "react-router-dom";
import { useAuth } from "../utlis/AuthProvider";


export const CheckRole = ({ children, role }) => {
    const { userDetails } = useAuth();
    // console.log(role, userDetails.role , role.includes(userDetails.role))
    if (Array.isArray(role) && !role.includes(userDetails.role)) {
        return <Navigate to="/" />;
    } 
    if (!Array.isArray(role) &&  userDetails.role !== role) {
        return <Navigate to="/" />;
    }
    return children;
};