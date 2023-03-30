import React, { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import UserIcon from '../Projects/ProjectCard/profileImage';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Logo } from "./Logo.js";
import './index.css';
import { getLogedInUserDetails } from '../../services/user/api';
import { Modal , Button } from 'react-bootstrap';
// import { Button } from 'bootstrap';
import UserForm from '../edit-profile';
import { Text } from "@nextui-org/react";
function Header() {

	const navigate = useNavigate();
	const [userName, setUserName] = useState('')
	const [profilePicture, setProfileLink] = useState(false);

	const redirectToDashbord = () => {
		navigate("/");
		
	  }


	const user = {
		name: 'Aditya'
	}

	const redirectToUserDetail = () => {
		// navigate(`/project/add/${project._id}`);
		navigate("/profile")
		localStorage.setItem('isEditProfile', 'true')
	}

	useEffect(() => {
		getUserDetails();
	}, []);

	const getUserDetails = async () => {
		// setLoading(true);
		 try {
			const response = await getLogedInUserDetails();
			if (response.error) {
			  console.log('Error while getting user details');
			//   setLoading(false);
			  return;
			} else {

				setUserName(response?.data.name);
				if (response.data.profilePicture) {
	
					setProfileLink(response.data.profilePicture);
}
			console.log('user name--------------------------------------',response?.data)
		
			}
		  } catch (error) {
			console.log('Error while getting user details');
			// setLoading(false);
			return error.message;
		  }
	};



  return (
 

	<Navbar bg="light" variant="light" fixed="top">
      <Container fluid="lg" style={{maxWidth:'1240px'}}>
        <Navbar.Brand onClick={redirectToDashbord}>
	
          <Logo />
          <Text b color="#8355ad" hideIn="xs">
           Tea Pro
         </Text>
		</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          
			<div className='user-text-name' key={userName}>
        <div onClick={redirectToUserDetail} className="user-icon">
          {profilePicture && (
            <div className="user-pic">
              <img style={{    width: '30px',
    height: '30px',
    borderRadius: '50%'}} src={`${profilePicture}`} alt="profile"></img>
            </div>
          )}
          {!profilePicture && <UserIcon firstName={userName} />}
          <p className='text-truncate' style={{ marginBottom: "0px", marginLeft: "22px" }}>{userName}</p>
        </div>
      </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;