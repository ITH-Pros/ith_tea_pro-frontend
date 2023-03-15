import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEllipsisV,
//   faTasks,
//   faComments,
//   faFlag,
//   faClock,
// } from "@fortawesome/free-solid-svg-icons";
import "./projectCard.css";
import UserIcon from "./profileImage";
import { useAuth } from "../../../auth/AuthProvider";
import { Modal, Row, Col } from "react-bootstrap";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faTasks,
  faCommentDots,
  faFlag,
  faClock,
  faSpellCheck,
  faCheckCircle,
  faCheck,
  faBarChart,
  faIcons,
} from "@fortawesome/free-solid-svg-icons";
import { assignTeamAPI, getUnassignedUsers } from "../../../services/user/api";
// import "./ProjectCard.css";

const ProjectCard = ({
  name,
  description,
  handleEdit,
  element,
  managedBy,
  accessibleBy,
  handleDelete,
  borderColor,
  handleCategories,
  categroies,
  taskData,
  handleToRedirectTask,
  getAndSetAllProjects
}) => {
  const generateRandomColor = () => {
    console.log(accessibleBy);
    console.log(element);
    const colors = [
      "#F94144",
      "#F3722C",
      "#F8961E",
      "#F9C74F",
      "#90BE6D",
      "#43AA8B",
      "#577590",
      "#264653",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const [modalshow, setModalShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalTitle, SetModalTitle] = useState("");

  const [showMenuList, setShowMenuList] = useState(false);

  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [listOfUnassignedUsers, setListOfUnassignedUsers] = useState([]);
  const [selectedUnassignedUsers, setSelectedUnassignedUsers] = useState('');

  console.log(selectedUnassignedUsers)


  const assignTeamUsers = async () => {
	
	let dataToSend = {
	  projectId: element._id,
	  userIds: [selectedUnassignedUsers]
	};
	try {
	  const response = await assignTeamAPI(dataToSend);
	  if (response.error) {
		console.log("Error while getting user details");
		//   setLoading(false);
		return;
	  } else {
		// setListOfUnassignedUsers(response?.data);
		console.log("user name", response?.data);
		setModalShow(false)
		setSelectedUnassignedUsers('')
		setShowSelectBox(false)
		getAndSetAllProjects()
		setSelectedRole(null)
		setSelectedUnassignedUsers('') ; setListOfUnassignedUsers([]) ; setSelectedRole(null)

	  }
	} catch (error) {
	  console.log("Error while getting user details");
	  // setLoading(false);
	  return error.message;
	}
	  };

  const getListOfUnassignedUsers = async (role) => {
    let dataToSend = {
      projectId: element._id,
      role: role,
    };
    try {
      const response = await getUnassignedUsers(dataToSend);
      if (response.error) {
        console.log("Error while getting user details");
        //   setLoading(false);
        return;
      } else {
        setListOfUnassignedUsers(response?.data);
        console.log("user name", response?.data);
      }
    } catch (error) {
      console.log("Error while getting user details");
      // setLoading(false);
      return error.message;
    }
  };

  function assignTeamUser() {
    setShowSelectBox(!showSelectBox);
  }

  function handleRoleChange(event) {
    setSelectedRole(event.target.value);
    getListOfUnassignedUsers(event.target.value);
  }

  const assignTeam = () => {};

  const handleMenuIconClick = () => {
    setShowMenuList(!showMenuList);
  };
  const { userDetails } = useAuth();

  const onClickOfIcons = (user, type) => {
    console.log(user, "---------------------suer");
    setUsers(user);
    SetModalTitle(type);
    setModalShow(true);
  };

  return (
    <div
      className="project-card"
      style={{ borderColor: borderColor || generateRandomColor() }}
    >
      {/* <div className="menu-icon">
        <FontAwesomeIcon icon={faEllipsisH} />
        <div className="menu-options">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div> */}
      <div
        className="menu-icon"
        onClick={handleMenuIconClick}
        onBlur={handleMenuIconClick}
      >
        {userDetails.role === "SUPER_ADMIN" && (
          <button className="project-btn-more dropdown ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-more-vertical"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
            <div className="dropdown-content">
              <a
                onClick={() => {
                  handleEdit();
                }}
              >
                {" "}
                Edit
              </a>
              <a
                href="#1"
                onClick={() => {
                  console.log("INNN delete");
                  handleDelete();
                }}
              >
                {" "}
                Delete
              </a>
            </div>
          </button>
        )}
      </div>
      <div onClick={() => handleToRedirectTask()} className="project-details">
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
      <div className="project-stats">
        <div className="stat">
          {/* onClick={() => handleCategories()} */}
          <FontAwesomeIcon icon={faFlag} />
          <span>{categroies}</span>
        </div>
        <div className="stat">
          <FontAwesomeIcon icon={faTasks} />
          <span>{taskData?.ONGOING || 0}</span>
        </div>
        <div className="stat">
          <FontAwesomeIcon icon={faCheck} />
          <span>{taskData?.COMPLETED || 0}</span>
        </div>
        <div className="stat">
          <FontAwesomeIcon icon={faBarChart || 0} />
          <span>{taskData?.totalTask || 0}</span>
        </div>
      </div>

      <div>
        {/* <div className=" pull-left w-50 text-center">
          <label className="lableName">Accessible By</label>
          <div className="user-profile-pics">
            {accessibleBy.length && (
              <UserIcon
                key="accessibleBy[0]._id"
                firstName={accessibleBy[0]?.name}
              />
            )}
            {accessibleBy.length > 1 && (
              <UserIcon
                key="accessibleBy[1]._id"
                firstName={accessibleBy[1]?.name}
              />
            )}
            {accessibleBy.length > 2 && (
              <span
                onClick={() => {
                  onClickOfIcons(accessibleBy, "Assined By");
                }}
              >
                <UserIcon firstName={"..."} />
              </span>
            )}
          </div>
        </div> */}

        {/* <div className=" pull-right w-50 text-center">
          <label className="lableName">Team</label>
          <div className="user-profile-pics">
            {managedBy.length && (
              <UserIcon
                key="accessibleBy[0]._id"
                firstName={managedBy[0]?.name}
              />
            )}
            {managedBy.length > 1 && (
              <UserIcon
                key="accessibleBy[1]._id"
                firstName={managedBy[1]?.name}
              />
            )}
            {managedBy.length > 2 && (
              <span
                onClick={() => {
                  onClickOfIcons(managedBy, "Managed By");
                }}
              >
                <UserIcon firstName={"..."} />
              </span>
            )}
          </div>
        </div> */}

        <div>
          <div className="pull-left w-50 text-center">
            <label className="lableName">Team Members</label>
            <div className="user-profile-pics">
              {accessibleBy
                .concat(managedBy)
                .slice(0, 13)
                .map((user, index) => (
                  <UserIcon key={index} firstName={user.name} />
                ))}
              {/* {accessibleBy?.length + managedBy?.length > 13 && ( */}
              <span
                key={"..."}
                onClick={() => {
                  onClickOfIcons(
                    accessibleBy.concat(managedBy),
                    "Assigned and Managed By"
                  );
                }}
              >
                <UserIcon firstName={"..."} />
              </span>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
      {modalshow && (
        <Modal
          show={modalshow}
          onHide={() =>{setModalShow(false);
			setShowSelectBox(false) ;setSelectedUnassignedUsers('') ; setListOfUnassignedUsers([]) ; setSelectedRole(null)}}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Row>
                {users.map((user, index) => {
                  return (
                    <Col key={index} sm={6}>
                      <div className="assignPopup">
                        <UserIcon firstName={user.name} />
                        <div className="ms-4">
                          <p className="mb-0">
                            {user?.name} ({user?.role})
                          </p>
                          <p className="userEmail">{user?.email}</p>
                        </div>
                      </div>
                    </Col>
                  );
                })}
                <Col sm={6}>
                  <div onClick={assignTeamUser} className="assignPopup">
                    <UserIcon firstName={"+"} />
                    <p className="ms-4 mb-0">{"Add Team"}</p>
                  </div>
                </Col>
                <div>
                  {showSelectBox && (
                    <><div>
										  <select value={selectedRole} onChange={handleRoleChange}>
											  <option value="">Select a role</option>
											  <option value="CONTRIBUTOR">CONTRIBUTOR</option>
											  <option value="LEAD">LEAD</option>
										  </select>
										  {selectedRole === "CONTRIBUTOR" && (
											  <select onChange={(e)=>setSelectedUnassignedUsers(e.target.value)}>
												  <option value="">Select a CONTRIBUTOR</option>
												  {listOfUnassignedUsers.map((user, index) => {
													  return (
														  <option key={index} value={user._id}>{user.name}</option>
													  );
												  })}
											  </select>
										  )}
										  {selectedRole === "LEAD" && (
											  <select onChange={(e)=>setSelectedUnassignedUsers(e.target.value)}>
												  <option value="">Select a LEAD</option>
												  {listOfUnassignedUsers.map((user, index) => {
													  return (
														  <option key={index} value={user._id}>{user.name}</option>
													  );
												  })}
											  </select>
										  )}
									  </div>
									  {selectedUnassignedUsers && <div> 
										  <button onClick={assignTeamUsers}>Assign</button>
									  </div>
									  }
									  </>

                  )}
                </div>
              </Row>
            </div>
          </Modal.Body>

          <div className="text-right me-3">
            <button
              style={{ marginLeft: "16px", width: "30%" }}
              className="btn btn-press  btn-gradient-border btn-primary"
              onClick={() => {setModalShow(false) ;setShowSelectBox(false) ; setSelectedUnassignedUsers("") ; setListOfUnassignedUsers([]) ; setSelectedRole(null)  }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectCard;
