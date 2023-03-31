import React, { useEffect, useState } from "react";
import UserIcon from "../Projects/ProjectCard/profileImage";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Logo } from "./Logo.js";
import "./index.css";
import { getLogedInUserDetails } from "../../services/user/api";
import { Text } from "@nextui-org/react";

function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfileLink] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

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
          setProfileLink(response.data.profilePicture);
        }
      }
    } catch (error) {
      console.log("Error while getting user details");
      return error.message;
    }
  };

  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Container fluid="lg" style={{ maxWidth: "1240px" }}>
        <Navbar.Brand onClick={redirectToDashbord}>
          <Logo />
          <Text b color="#8355ad" hideIn="xs">
            Tea Pro
          </Text>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <div className="user-text-name" key={userName}>
              <div onClick={redirectToUserDetail} className="user-icon">
                {profilePicture && (
                  <div className="user-pic">
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                      src={`${profilePicture}`}
                      alt="profile"
                    ></img>
                  </div>
                )}
                {!profilePicture && <UserIcon firstName={userName} />}
                <p
                  className="text-truncate"
                  style={{ marginBottom: "0px", marginLeft: "22px" }}
                >
                  {userName}
                </p>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
