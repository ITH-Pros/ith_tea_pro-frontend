import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";
import Dashboard from "pages/Dashboard";
import Ratings from "pages/Ratings";
import Projects from "pages/Projects";
import Tasks from "pages/Tasks";
const NavRoutes = (props: any) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="projects" element={<Projects />} />

          <Route path="*" element={<div>Error 404 Not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default NavRoutes;
