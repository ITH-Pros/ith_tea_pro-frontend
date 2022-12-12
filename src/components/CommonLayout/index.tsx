import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../NavBar";

const CommonLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default CommonLayout;
