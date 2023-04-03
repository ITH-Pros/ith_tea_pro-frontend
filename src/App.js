import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../src/main/Navbar/navbar";
import Login from "./auth/login";
import Dashboard from "./main/Dashboard/dashboard";
import Project from "./main/Projects/";
import Rating from "./main/Rating/rating";
import Task from "./main/Tasks/tasks";
import Team from "./main/Teams/teams";
import NoMatch from "./main/404/index";
import { ProtectedRoute } from "./components/ProtectedRoute";
import User from "./main/User";
import AddUser from "./main/User/AddUser";
import ViewUser from "./main/User/ViewUser";
import AddProject from "./main/Projects/AddProject";
import AllProject from "./main/Projects/AllProjects";
import { CheckRole } from "./components/checkRole";
import { ProSidebarProvider } from "react-pro-sidebar";
import Header from "./main/Header";
import UserForm from "./main/edit-profile";
import PasswordForm from "./setup-password";

function App() {
  return (
    <ProSidebarProvider>
      <Routes>
        {
          <Route
            path="/login"
            element={
              <Login />
            }
          />
        }
        <Route
          path="/set-password/:token"
          element={
            <PasswordForm />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Header />
              <Dashboard showBtn={true} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <Header />
                <Project />{" "}
              </ProtectedRoute>
            </>
          }
        >
          <Route
            path="add"
            element={
              <>
                <CheckRole role={["SUPER_ADMIN","ADMIN"]}>
                  <AddProject />
                </CheckRole>
              </>
            }
          />
          <Route
            path="add/:projectId"
            element={
              <>
                <CheckRole role={["SUPER_ADMIN","ADMIN"]}>
                  <AddProject />
                </CheckRole>
              </>
            }
          />

          <Route path="all" element={<AllProject />} />
        </Route>
        <Route
          path="/rating/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Header />
              <Rating />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navbar />
              <Header />
              <UserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Navbar />
              <Header />
              <Team />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task"
          exact={true}
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <Header />
                <Task />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/task/:projectId/:isArchive"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <Header />

                <Task />
              </ProtectedRoute>
            </>
          }
        />

        <Route
          path="/user"
          element={
            <>
              <ProtectedRoute>
                <Navbar />
                <Header />
                <User />
              </ProtectedRoute>
            </>
          }
        >
          <Route
            path="add"
            element={
              <>
                <CheckRole role={["SUPER_ADMIN","ADMIN"]}>
                  <AddUser />
                </CheckRole>
              </>
            }
          />
          <Route path="view/:userId" element={<ViewUser />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </ProSidebarProvider>
  );
}

export default App;
