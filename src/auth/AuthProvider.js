import { createContext, useContext, useMemo ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import Toaster from '../components/Toaster'
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage("_u", null);
  const [userDetails, setUserDetails] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  // call this function when you want to authenticate the user
  const login = async (data) => {
    setAccessToken(data?.token);
    setUserDetails(data?.user);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setToasterMessage('Logged Out Succesfully');
    setShowToaster(true);
    setAccessToken(null);
    setUserDetails(null);

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
      {toaster && <Toaster
                    message={toasterMessage}
                    show={toaster}
                    close={() => showToaster(false)} />
                }
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
};