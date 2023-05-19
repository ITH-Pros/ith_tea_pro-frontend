/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import UserIcon from "../Projects/ProjectCard/profileImage";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Logo } from "./Logo.js";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import "./index.css";
import { getLogedInUserDetails } from "../../services/user/api";
import { Text } from "@nextui-org/react";
import { useAuth } from "../../auth/AuthProvider";

function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(false);

  const { userDetails } = useAuth();

  useEffect(() => {
  
    getUserDetails();
    
  }, []);

  useEffect(() => {
    setProfilePicture(localStorage.getItem('selectedProfilePicture'))
  }, [localStorage.getItem('selectedProfilePicture')]);

  const redirectToDashbord = () => {
    navigate("/");
  };

  const redirectToUserDetail = () => {
    navigate("/profile");
    localStorage.setItem("isEditProfile", "true");
  };

  const getUserDetails = async () => {
    try {
      const response = await getLogedInUserDetails();
      if (response.error) {
        console.log("Error while getting user details");
        return;
      } else {
        setUserName(response?.data.name);
        if (response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
        }
      }
    } catch (error) {
      console.log("Error while getting user details");
      return error.message;
    }
  };

  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Container fluid >
        <Navbar.Brand onClick={redirectToDashbord}>
                <img style={{height:'35px',widows:'35px'}} src={require("../../assests/img/logo.png")} alt="logo" />
          <Text b color="#8355ad" style={{cursor:"pointer"}} hideIn="xs">
            Tea Pro
          </Text>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <div className="user-text-name" key={userName}>
              <div onClick={redirectToUserDetail} className="user-icon">
                {profilePicture && (
                  <div className="user-pic ms-2">
                   <button id='headerbuttontoupdateprofile' hidden={true} ></button>
                     
                    <img
                      style={{
                        
                        borderRadius: "50%",
                      }}
                      src={`${profilePicture}`}
                      alt="profile"
                    ></img>
                  </div>
                )}
                {!profilePicture && <UserIcon firstName={userName} />}
               
                <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>{userName}</Tooltip>}
                            >
                              <p 
                  className="text-truncate"
                  style={{ marginBottom: "0px", marginLeft: "10px" , cursor:"pointer", paddingTop:'10px', maxWidth:'100px' }}
                >
                  {userName}
                </p>
                            </OverlayTrigger>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
