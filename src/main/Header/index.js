import React, { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import UserIcon from '../Projects/ProjectCard/profileImage';
import { useNavigate } from "react-router-dom";


import './index.css';
import { getLogedInUserDetails } from '../../services/user/api';
import { Modal , Button } from 'react-bootstrap';
// import { Button } from 'bootstrap';
import UserForm from '../edit-profile';

function Header() {

	const navigate = useNavigate();
	const [userName, setUserName] = useState('')




	const user = {
		name: 'Aditya'
	}

	const redirectToUserDetail = () => {
		// navigate(`/project/add/${project._id}`);
		navigate("/profile")
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
			console.log('user name', response?.data.name)
		
			}
		  } catch (error) {
			console.log('Error while getting user details');
			// setLoading(false);
			return error.message;
		  }
	};



  return (
    <header>
		  <div key={userName} className='pull-right'>
			  <div onClick={redirectToUserDetail} className="user-icon">
				  <UserIcon firstName={userName} />  <p style={{marginBottom:'0px'}}>{userName}</p>
			  </div>
		  </div>
	  </header>
  );
}

export default Header;