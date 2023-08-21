import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "@pages/Dashbord/dashboard";
import ProjectGrid from "@components/FreeResource/projectGrid";
import AllProject from "@pages/Projects/AllProjects";
import AddProject from "@components/AddProject";
// import { CheckRole } from "./components/checkRole";
import Rating from "@pages/Rating/rating";
import UserForm from "@pages/edit-profile";
import ResetPassword from "@pages/Auth/ResetPassword/resetPassword";
import Navbar from "@components/Shared/Navbar/navbar";
import Header from "@components/Shared/Header";
import Teams from "@pages/Team/teams";
import Tasks from "@pages/Tasks/tasks";
import TeamReport from "@pages/Team-report";
import User from "@pages/User";
import AddUser from "@pages/User/AddUser";
import ViewUserTasks from "@components/View-Rating/viewUserTasks";
import ViewTask from "@pages/Rating/View-Rating/viewTask";
import Project from "../../pages/Projects";
import { useAuth } from "../../utlis/AuthProvider";

// Custom PrivateRoute component to check for authentication
const PrivateRoute = ({ children }) => {
  const { userDetails } = useAuth();
  console.log(userDetails);
  if (!Object.keys(userDetails || {}).length) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const CheckRole = ({ children, role }) => {
  const { userDetails } = useAuth();
  if (Array.isArray(role) && !role.includes(userDetails?.role)) {
    return <Navigate to="/" />;
  }
  if (!Array.isArray(role) && userDetails?.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Header />
      {children}
    </>
  );
}

const PrivateRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          exact
          element={
            <PrivateRoute>
              <Dashboard showBtn={true} />
            </PrivateRoute>
          }
        />

        <Route
          path="/grid"
          element={
            <PrivateRoute>
              <ProjectGrid showBtn={true} />
            </PrivateRoute>
          }
        />

        <Route
          path="/project"
          element={
            <PrivateRoute>
              <Project />
            </PrivateRoute>
          }
        >
          <Route
            path="/project/add"
            element={
              <PrivateRoute>
                <CheckRole role={["SUPER_ADMIN", "ADMIN"]}>
                  <AddProject />
                </CheckRole>
              </PrivateRoute>
            }
          />
          <Route
            path="add/:projectId"
            element={
              <PrivateRoute>
                <CheckRole role={["SUPER_ADMIN", "ADMIN"]}>
                  <AddProject />
                </CheckRole>
              </PrivateRoute>
            }
          />

          <Route
            path="all"
            element={
              <PrivateRoute>
                <AllProject />
              </PrivateRoute>
            }
          />
        </Route>

        <Route
          path="/rating/"
          element={
            <PrivateRoute>
              <Rating />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/reset-password"
          element={
            <PrivateRoute>
              <ResetPassword />
            </PrivateRoute>
          }
        />

        <Route
          path="/team"
          element={
            <PrivateRoute>
              <Teams />
            </PrivateRoute>
          }
        />

        <Route
          path="/task"
          exact={true}
          element={
            <PrivateRoute>
              <Tasks/>
            </PrivateRoute>
          }
        />

        <Route
          path="/team-report"
          element={
            <PrivateRoute>
              <TeamReport/>
            </PrivateRoute>
          }
        />

        <Route
          path="/task/:projectId"
          element={
            <PrivateRoute>
               <Tasks/>
            </PrivateRoute>
          }
        />

        <Route
          path="/user"
          element={
            <PrivateRoute>
              <User/>
            </PrivateRoute>
          }
        >
          <Route
            path="add"
            element={
              <PrivateRoute>
                <CheckRole role={["SUPER_ADMIN", "ADMIN"]}>
                   <AddUser/>
                </CheckRole>
              </PrivateRoute>
            }
          />
        </Route>

        <Route
          path="/view-user-tasks/:userId"
          element={
            <PrivateRoute>
              <ViewUserTasks />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<h1>No match</h1>} />

        <Route
          path="/view-task/:taskId"
          element={
            <PrivateRoute>
              <ViewTask />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default PrivateRoutes;
