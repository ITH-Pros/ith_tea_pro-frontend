
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import React from "react";
import { Navbar, Button, Link, Text } from "@nextui-org/react";
import { Layout } from "./Layout.js";
import { Logo } from "./Logo.js";

export default function App() {
      const auth = useAuth()
      const navLinkStyles = ({ isActive }) => {
              return {
                fontWeight: isActive ? 'bold' : 'normal',
                textDecoration: isActive ? 'none' : 'none',
                backgroundColor:isActive?'#eadcf8':'white',
                padding:isActive?'10px':'1  0px',
                marginRight:'45px',
                borderRadius:isActive?'9px':'0px',
                color:isActive?'#8355ad':'black'
              }
        }
  return (
    
    <Layout>
      <Navbar isBordered variant={'floating'}>
        <Navbar.Brand>
          <Logo />
          <Text b color="#8355ad" hideIn="xs">
            Tea Pro
          </Text>
        </Navbar.Brand>
        <Navbar.Content activeColor={'secondary'} hideIn="xs" variant={'highlight'}>
        <NavLink to='/' style={navLinkStyles}>
        Dashboard
       </NavLink>
       <NavLink to='/project' style={navLinkStyles}>
         Project
       </NavLink>
       <NavLink to='/rating' style={navLinkStyles}>
         Rating
       </NavLink>
       <NavLink to='/task' style={navLinkStyles}>
         Task
       </NavLink>
       <NavLink to='/team' style={navLinkStyles}>
         Team
       </NavLink>
        </Navbar.Content>
        {!auth.user && (
        // onClick={auth.logout()}
        <Navbar.Content>
          <Navbar.Item>
          <Button auto flat as={Link} href="/login">
              Login
            </Button>
            </Navbar.Item>
          {/* <Navbar.Item>
            <Button auto flat as={Link} href="/login">
              Sign Up
            </Button>
          </Navbar.Item> */}
        </Navbar.Content>
      
      )}
        {auth.user && (
        // onClick={auth.logout()}
        <Navbar.Content>
          <Navbar.Link color="inherit" href="/">
            Logout
          </Navbar.Link>
        </Navbar.Content>
      
      )}
        
      </Navbar>
   
    </Layout>
  )
}
