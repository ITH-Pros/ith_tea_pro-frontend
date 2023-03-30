
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import React from "react";
import { Layout } from "./Layout.js";

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { BsBoxArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTachometerAlt,
  FaHome,
  FaGem,
  FaList,
  FaRegLaughWink,
  FaHeart,

} from 'react-icons/fa';
import './navbar.css'
import { navigationRef } from '../../helpers/logOut';

export default function Navbar() {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const redirectToDashbord = () => {
    navigate("/");
    
  }
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: isActive ? 'none' : 'none',
      // backgroundColor: isActive ? '#eadcf8' : '#9ec6e1',
      // padding: isActive ? '10px' : '1  0px',
      // marginRight: '45px',
      borderRadius: isActive ? '9px' : '0px',
      color: isActive ? '#8355ad' : 'black'
    }
  }
  function logOutFromSystem (){
	console.log("logout");
	localStorage.clear();
	// navigationRef.current?.navigate('/login');
	window.location.reload();
  }
  return (

    <Layout>
      {accessToken && (
       
       <Sidebar>
        <Menu iconShape="circle">
          
         <NavLink to='/' style={navLinkStyles}>
          <MenuItem  icon={<FaHome />}> Dashboard </MenuItem></NavLink>
          <NavLink to='/project/all' style={navLinkStyles}>   <MenuItem icon={<FaGem />}>  Project  </MenuItem></NavLink>
          <NavLink to='/task' style={navLinkStyles}> <MenuItem icon={<FaList />}> Task </MenuItem></NavLink> 
          <NavLink to='/rating' style={navLinkStyles} > <MenuItem icon={<FaRegLaughWink />}>    Rating  </MenuItem></NavLink>
          <NavLink to='/team' style={navLinkStyles}> <MenuItem icon={<FaUser />}>   Team  </MenuItem></NavLink>
          <NavLink  onClick={logOutFromSystem}   style={navLinkStyles}> 
          <MenuItem  icon={<BsBoxArrowRight />}>   Logout  </MenuItem></NavLink>

        </Menu>
      </Sidebar>
      
      )
      }


    </Layout >
  )
    }
