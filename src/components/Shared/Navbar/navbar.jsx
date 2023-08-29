import { NavLink } from "react-router-dom";
import React, { useContext } from "react";
import { Layout } from "./Layout.jsx";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { BsBoxArrowRight } from "react-icons/bs";
import { FaUser, FaHome, FaGem, FaList, FaRegLaughWink, FaUsers } from "react-icons/fa";
import "./navbar.css";
import { useAuth } from "../../../utlis/AuthProvider.jsx";

export default function Navbar() {
  const { userDetails ,accessToken } = useAuth();

  const allowedRoles = ["SUPER_ADMIN", "ADMIN"];

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
          <Menu
            onClick={() => {
              localStorage.removeItem('selectedOptions')
            }}
            iconShape="circle"
          >
            <NavLink
              to="/"
              style={navLinkStyles}
            >
              <MenuItem icon={<FaHome />}> Dashboard </MenuItem>
            </NavLink>
            <NavLink
              to="/project/all"
              style={navLinkStyles}
            >
              <MenuItem icon={<FaGem />}> Project </MenuItem>
            </NavLink>

            {userDetails?.role !== 'GUEST' && (
              <>
                <NavLink
                  to="/task"
                  style={navLinkStyles}
                >
                  <MenuItem icon={<FaList />}> Task </MenuItem>
                </NavLink>
                <NavLink
                  to="/rating"
                  style={navLinkStyles}
                >
                  <MenuItem icon={<FaRegLaughWink />}> Rating </MenuItem>
                </NavLink>
                <NavLink
                  to="/team"
                  style={navLinkStyles}
                >
                  <MenuItem icon={<FaUsers />}> Team </MenuItem>
                </NavLink>
                {allowedRoles.includes(userDetails?.role) && (
                  <NavLink
                    to="/team-report"
                    style={navLinkStyles}
                  >
                    <MenuItem icon={<FaUser />}>Team Report</MenuItem>
                  </NavLink>
                )}
              </>
            )}

            {/* {userDetails?.role === 'SUPER_ADMIN' || userDetails?.role === 'ADMIN' ? (
            <NavLink to="/guest" style={navLinkStyles}>
              <MenuItem icon={<FaUser />}>Guest</MenuItem>
            </NavLink>
          ) : null} */}

            <NavLink
              to="/login"
              onClick={logOutFromSystem}
              style={navLinkStyles}
            >
              <MenuItem icon={<BsBoxArrowRight />}> Logout </MenuItem>
            </NavLink>
          </Menu>
        </Sidebar>
      )}
    </Layout>
  )
}
