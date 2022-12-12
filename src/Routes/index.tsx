import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";
import Dashboard from "../Pages/Dashboard";
const NavRoutes = (props: any) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<div>Error 404 Not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default NavRoutes;
