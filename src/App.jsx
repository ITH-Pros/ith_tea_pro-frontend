import { useState } from "react";
import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ToastContainer } from "react-toastify";
import "./App.css";
// import Login from "./pages/Auth/Login/login";
// import ForgotPassword from "./pages/Auth/ForgotPassword/forgotPassword";
// import PasswordForm from "./pages/Auth/setup-password/index";
// import ResetPassword from "./pages/Auth/ResetPassword/resetPassword";
// import { ProtectedRoute } from "./utlis/ProtectedRoute";
// import { CheckRole } from "./helpers/checkRole";
// import Dashboard from "./pages/Dashbord/dashboard";
// import ProjectGrid from "./components/FreeResource/projectGrid";
// import AllProject from "./pages/Projects/AllProjects";
// import AddProject from "./components/AddProject";
// import Rating from "./pages/Rating/rating";
// import Navbar from "./components/Shared/Navbar/navbar";
// import Header from "./components/Shared/Header/index";
// import UserForm from "./pages/edit-profile";
// import Team from "./pages/Team/teams";
// import Task from "./pages/Tasks/tasks";
// import TeamReport from "./pages/Team-report/index";
// import User from "./pages/User/index";
// import AddUser from "./pages/User/AddUser/index";
// import ViewUser from "./pages/User/ViewUser/index";
// import ViewUserTasks from "./components/View-Rating/viewUserTasks";
// import NoMatch from "./components/404/index";
// import ViewTask from "./components/view-task/index";
import NavigationRoutes from "./routes";

function App() {
  return (
    <React.Fragment>
      <ToastContainer autoClose={2000} />
      <ProSidebarProvider>
        <NavigationRoutes />
      </ProSidebarProvider>
    </React.Fragment>
  );
}

export default App;
