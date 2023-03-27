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
	const [profilePicture, setProfileLink] = useState(false);




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
    <header>
      <div key={userName} className="pull-right">
        <div onClick={redirectToUserDetail} className="user-icon">
          {profilePicture && (
            <div className="user-pic">
              <img style={{    width: '30px',
    height: '30px',
    borderRadius: '50%'}} src={`${profilePicture}`} alt="profile"></img>
            </div>
          )}
          {!profilePicture && <UserIcon firstName={userName} />}
          <p style={{ marginBottom: "0px", marginLeft: "22px" }}>{userName}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;