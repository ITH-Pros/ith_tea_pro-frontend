import React from 'react';
import { Routes, Route } from 'react-router';
import AuthRoutes from '../routes/AuthRoutes';
import ProtectedRoutes from '../routes/ProtectedRoutes';


// const RequiredAuth = (props) => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const userDetails = UserUtils.getLocalUserDetails();
//   const token = tokenUtils.getAccessToken();
//   useEffect(() => {
//     dispatch(loginSuccessful({ token, user: userDetails }));
//   }, []);
//   const { children } = props;
//   return userDetails && token ? (
//     children
//   ) : (
//     <Navigate to="/login" replace state={{ path: location.pathname }} />
//   );
// };

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
