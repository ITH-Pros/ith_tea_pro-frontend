
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import React from "react";
import { Navbar, Button, Link, Text } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { Logo } from "./Logo.js";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
  FaUser,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTachometerAlt,
  FaGem,
  FaList,
  FaRegLaughWink,
  FaHeart
} from 'react-icons/fa';
import './navbar.css'
import { navigationRef } from '../../helpers/logOut';
export default function App() {
  const { accessToken, logout } = useAuth()
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
  const logOutFromSystem =()=>{
	localStorage.clear();
	navigationRef.current?.navigate('/login');
  }
  return (

    <Layout>
      {accessToken && (
       
       <Sidebar>
        <Menu iconShape="circle">
          <MenuItem>
          <Logo />
          <Text b color="#8355ad" hideIn="xs">
         Tea Pro
         </Text></MenuItem>
         <NavLink to='/' style={navLinkStyles}>
          <MenuItem  icon={<FaTachometerAlt />}> Dashboard </MenuItem></NavLink>
          <NavLink to='/project/all' style={navLinkStyles}>   <MenuItem icon={<FaGem />}>  Project  </MenuItem></NavLink>
          <NavLink to='/rating' style={navLinkStyles} > <MenuItem icon={<FaRegLaughWink />}>    Rating  </MenuItem></NavLink>
          <NavLink to='/task' style={navLinkStyles}> <MenuItem icon={<FaList />}> Task </MenuItem></NavLink> 
          <NavLink to='/team' style={navLinkStyles}> <MenuItem icon={<FaUser />}>   Team  </MenuItem></NavLink>
          <NavLink  onclick={logOutFromSystem}   style={navLinkStyles}> <MenuItem icon={<FaRegLaughWink />}>   LogOut  </MenuItem></NavLink>

        </Menu>
      </Sidebar>
        // <Navbar isBordered variant={'floating'}>
        //   <Navbar.Brand>
        //     <Logo />
        //     <Text b color="#8355ad" hideIn="xs">
        //       Tea Pro
        //     </Text>
        //   </Navbar.Brand>
        //   <Navbar.Content activeColor={'secondary'} hideIn="xs" variant={'highlight'}>
        //     <NavLink to='/' style={navLinkStyles}>
        //       Dashboard
        //     </NavLink>
        //     <NavLink to='/project/all' style={navLinkStyles}>
        //       Project
        //     </NavLink>
        //     <NavLink to='/rating' style={navLinkStyles}>
        //       Rating
        //     </NavLink>
        //     <NavLink to='/task' style={navLinkStyles}>
        //       Task
        //     </NavLink>
        //     <NavLink to='/team' style={navLinkStyles}>
        //       Team
        //     </NavLink>
        //   </Navbar.Content>


        //   < Navbar.Content >
        //     <Navbar.Link color="inherit" style={{ cursor: 'pointer' }} onClick={() => logout()}>
        //       Logout
        //     </Navbar.Link>
        //   </Navbar.Content>
        // </Navbar>
      )
      }


    </Layout >
  )
    }
