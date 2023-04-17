import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import React from "react";
import { Layout } from "./Layout.js";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { BsBoxArrowRight } from "react-icons/bs";
import { FaUser, FaHome, FaGem, FaList, FaRegLaughWink, FaUsers } from "react-icons/fa";
import "./navbar.css";

export default function Navbar() {
  const { accessToken } = useAuth();

  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "none" : "none",
      borderRadius: isActive ? "9px" : "0px",
      color: isActive ? "#8355ad" : "black",
    };
  };

  function logOutFromSystem() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <Layout>
      {accessToken && (
        <Sidebar>
          <Menu iconShape="circle">
            <NavLink to="/" style={navLinkStyles}>
              <MenuItem icon={<FaHome />}> Dashboard </MenuItem>
            </NavLink>
            <NavLink to="/project/all" style={navLinkStyles}>
              <MenuItem icon={<FaGem />}> Project </MenuItem>
            </NavLink>
            <NavLink to="/task" style={navLinkStyles}>
              <MenuItem icon={<FaList />}> Task </MenuItem>
            </NavLink>
            <NavLink to="/rating" style={navLinkStyles}>
              <MenuItem icon={<FaRegLaughWink />}> Rating </MenuItem>
            </NavLink>
            <NavLink to="/team" style={navLinkStyles}>
              <MenuItem icon={<FaUsers />}> Team </MenuItem>
            </NavLink>
            <NavLink to="/team-report" style={navLinkStyles}>
              <MenuItem icon={<FaUser />}>  Report Card </MenuItem>
            </NavLink>
            <NavLink onClick={logOutFromSystem} style={navLinkStyles}>
              <MenuItem icon={<BsBoxArrowRight />}> Logout </MenuItem>
            </NavLink>
          </Menu>
        </Sidebar>
      )}
    </Layout>
  );
}
