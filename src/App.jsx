import { useState } from "react";
import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ToastContainer } from "react-toastify";
import "./App.css";
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
