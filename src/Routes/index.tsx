import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";
import Ratings from "../Pages/Rating";
const NavRoutes = (props: any) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route path="ratings" element={<Ratings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default NavRoutes;
