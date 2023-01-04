import { createContext, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage("_u", null);
  const [userDetails, setUserDetails] = useLocalStorage("user", null);
  const navigate = useNavigate();
  // call this function when you want to authenticate the user
  const login = async (data) => {
    console.log('data in login-----------------------', data)
    setAccessToken(data?.token);
    setUserDetails(data?.user);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setUserDetails(null);

    console.log('**************************logout**************************')
  };


  const value = useMemo(
    () => ({
      accessToken,
      login,
      userDetails,
      logout
    }),
    [accessToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
};