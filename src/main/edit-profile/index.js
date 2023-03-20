import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import Toaster from '../../components/Toaster';
import { editLogedInUserDetails, getLogedInUserDetails } from '../../services/user/api';
import './index.css'

function UserForm(props) {

	const {handleModalClose} = props;
	
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [role, setRole] = useState(''); // ['SUPER_ADMIN', 'ADMIN', 'CONTRIBUTOR']
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [dob, setDob] = useState('');
  console.log('dob', dob);
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

//   const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
	onInit();
	  }, []);


  const onInit = () => {
	getUserDetails();
  }

  const patchValues = (currentUser) => {
	setName(currentUser?.name || '');
	setRole(currentUser?.role || '');
	setEmail(currentUser?.email	|| '');
	setEmployeeId(currentUser?.employeeId	|| '');
	setDesignation(currentUser?.designation	|| '');
	setDepartment(currentUser?.department	|| '');
	setGithub(currentUser?.githubLink	|| '');
	setTwitter(currentUser?.twitterLink	|| '');
	setLinkedin(currentUser?.linkedInLink	|| '');

	setDob(currentUser?.dob	|| '');

	console.log('currentUser?.dob', currentUser?.dob ,dob , new Date(dob)?.toLocaleDateString());

	// const date = new Date(currentUser?.dob);
	// const year = date.getFullYear();
	// const month = date.getMonth() + 1;
	// const day = date.getDate();
	// const formattedDate = `${year}-${month}-${day}`;
	// console.log('formattedDate', formattedDate);
	
	// setDob(formattedDate);
	



	  };



//   get currentUserdetails from API and set the values
  const getUserDetails = async () => {
	setLoading(true);
	 try {
		const response = await getLogedInUserDetails();
		if (response.error) {
		  console.log('Error while getting user details');
		  setLoading(false);
		  return;
		} else {
		//   setCurrentUser(response.data);
		  patchValues(response.data);
		  setLoading(false);
		}
	  } catch (error) {
		console.log('Error while getting user details');
		setLoading(false);
		return error.message;
	  }
    };





  function handleEditClick(event) {
    event.preventDefault();
    setIsEditable(true); // Set isEditable to true when Edit button is clicked
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
	const dataToSend = {
		name: name,
		role: role,
		email: email,
		employeeId: employeeId,
		designation: designation,
		department: department,
		dob: dob,
		githubLink: github,
		twitterLink: twitter,
		linkedInLink: linkedin,
	}

	try {
		// call API to update the user details
		setLoading(true);
		const response = await editLogedInUserDetails(dataToSend);
		if (response.error) {
			console.log('Error while updating user details');
			setLoading(false);
			return;
		}
		else {
			setLoading(false);
			showToaster(true);
			setToasterMessage(response.message);
			setIsEditable(false);
			handleModalClose();
			navigate('/');
		}
	} catch (error) {
		console.log('Error while updating user details');
		setLoading(false);
		return error.message;
	}
    // Do something with the form data
  };

  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  return (
	<div className="addUserFrom rightDashboard" > 
    <form >
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
	  {/* Role */}
	  <div className="form-group">
		<label htmlFor="role">Role:</label>
		<input 
			type="text"
			id="role"
			value={role}
			onChange={(event) => setRole(event.target.value)}
			readOnly={true}
		/>
	  </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
		  readOnly={true}
        />
      </div>
      <div className="form-group">
        <label htmlFor="employeeId">Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
      <div className="form-group">
        <label htmlFor="designation">Designation:</label>
        <input
          type="text"
          id="designation"
          value={designation}
          onChange={(event) => setDesignation(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
      <div className="form-group">
        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
      <div className="form-group">
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          value={formatDate(dob)}
		  max={formatDate(new Date())}
          onChange={(event) => setDob(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
      <div className="form-group">
        <label htmlFor="github">Github:</label>
        <input
          type="url"
          id="github"
          value={github}
          onChange={(event) => setGithub(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
      <div className="form-group">
        <label htmlFor="twitter">Twitter:</label>
        <input
          type="url"
          id="twitter"
          value={twitter}
          onChange={(event) => setTwitter(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
      <div className="form-group">
        <label htmlFor="linkedin">LinkedIn:</label>
        <input
          type="url"
          id="linkedin"
          value={linkedin}
          onChange={(event) => setLinkedin(event.target.value)}
		  readOnly={!isEditable}
        />
      </div>
	  {isEditable && (
		<button onClick={handleSubmit} className="submit-button"> Update
  </button>)}
 

  {/* Edit button */}
  {!isEditable && (
	<button className="submit-button edit" onClick={handleEditClick} >Edit
  </button>)
	}

 
</form>

{toaster && (
					<Toaster
						message={toasterMessage}
						show={toaster}
						close={() => showToaster(false)} />
				)}
				{loading ? <Loader /> : null}

</div>

  );
}

export default UserForm;
