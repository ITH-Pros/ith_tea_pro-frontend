/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import Toaster from "../components/Toaster";
import { toast } from "react-toastify";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage("_u", null);
  const [userDetails, setUserDetails] = useLocalStorage("user", null);
  const [profileModalShow, setProfileModalShow] = useLocalStorage(
    "profileModalShow",
    false
  );
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);

  const setShowToaster = (param) => showToaster(param);
  const navigate = useNavigate();

  const login = async (data) => {
    setAccessToken(data?.token);
    setUserDetails(data?.user);
    // // console.log(data?.user?.role , "data?.user?.role");

      
      if (data?.user?.profileCompleted === false) {
        setProfileModalShow(true);
      }
    
    navigate("/");
  };

  const logout = () => {
    toast.dismiss()
      toast.info("Logged Out Successfully");
    // setShowToaster(true);
    setAccessToken(null);
    setUserDetails(null);
  };

  const value = useMemo(
    () => ({
      accessToken,
      login,
      userDetails,
      logout,
      profileModalShow,
      setProfileModalShow,
    }),
    [accessToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
