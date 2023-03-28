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
import {
  assignProjectLead,
  assignTeamAPI,
  getUnassignedUsers,
} from "../../../services/user/api";
import Select from "react-select";
// import "./ProjectCard.css";

const ProjectCard = ({
  name,
  description,
  handleEdit,
  element,
  managedBy,
  accessibleBy,
  handleDelete,
  background,
  handleCategories,
  categroies,
  taskData,
  handleToRedirectTask,
  getAndSetAllProjects,
  handleArchiveModalShow,
  isArchive,
}) => {
  const generateRandomColor = () => {
    console.log(accessibleBy);
    console.log(element);
    const colors = [
      "#e4ffc5",
      "#ffd9d9",
      "#e3e8ff",
      "#e3d3ff",
      "#d3fcff",
      "#e5e5e5",
      "#fffb6d",
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
  const [selectedUnassignedUsers, setSelectedUnassignedUsers] = useState([]);

  console.log(selectedUnassignedUsers);

  const assignTeamUsers = async () => {
    let dataToSend = {
      projectId: element._id,
      userIds: selectedUnassignedUsers,
    };
    try {
      let response;
      if (selectedRole == "LEAD") {
        response = await assignProjectLead(dataToSend);
      } else {
        response = await assignTeamAPI(dataToSend);
      }
      if (response.error) {
        console.log("Error while getting user details");
        //   setLoading(false);
        return;
      } else {
        // setListOfUnassignedUsers(response?.data);
        console.log("user name", response?.data);
        setModalShow(false);
        setSelectedUnassignedUsers("");
        setShowSelectBox(false);
        getAndSetAllProjects();
        setSelectedRole(null);
        setSelectedUnassignedUsers("");
        setListOfUnassignedUsers([]);
        setSelectedRole(null);
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

  // Define options for the contributor select
  const contributorOptions = listOfUnassignedUsers.map((user, index) => ({
    value: user._id,
    label: user.name,
  }));

  // Define a function to handle changes to the selected contributors
  const handleContributorsChange = (selectedOptions) => {
    setSelectedUnassignedUsers(selectedOptions.map((option) => option.value));
  };

  // Define options for the lead select
  const leadOptions = listOfUnassignedUsers.map((user, index) => ({
    value: user._id,
    label: user.name,
  }));

  // Define a function to handle changes to the selected leads
  const handleLeadsChange = (selectedOptions) => {
    setSelectedUnassignedUsers(selectedOptions.map((option) => option.value));
  };

  return (
    <div
      className="project-card"
      style={{ background: background || generateRandomColor() }}
    >
      {isArchive && <h6 className="archived">Archived</h6>}
      {isArchive && (
        <div className="delete-archived">
          {" "}
          <i
            onClick={handleDelete}
            title="delete project"
            className="fa fa-trash"
            aria-hidden="true"
          ></i>{" "}
        </div>
      )}
      {!isArchive && (
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
                  <i
                    className="fa fa-pencil-square"
                    aria-hidden="true"
                  ></i>{" "}
                  Edit Project
                </a>
                <a
                  href="#1"
                  onClick={() => {
                    console.log("INNN delete");
                    handleArchiveModalShow();
                    //   handleDelete();
                  }}
                >
                  {" "}
                  <i className="fa fa-archive" aria-hidden="true"></i> Archive
                </a>
                <a
                  href="#1"
                  onClick={() => {
                    console.log("INNN delete");
                    handleDelete();
                  }}
                >
                  {" "}
                  <i className="fa fa-trash" aria-hidden="true"></i> Delete
                </a>
              </div>
            </button>
          )}
        </div>
      )}

      <div onClick={() => handleToRedirectTask()} className="project-details">
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
      <div className="project-stats row">
        <div className="stat col-3" title="Over Due Tasks">
          {/* onClick={() => handleCategories()} */}
          <FontAwesomeIcon icon={faFlag} />
          <span>{taskData?.overDueTasks}</span>
        </div>
        <div className="stat col-3" title="Completed Tasks">
          <FontAwesomeIcon icon={faTasks} />
          <span>{taskData?.COMPLETED || 0}</span>
        </div>
        <div className="stat col-3" title="On Going Tasks">
          <FontAwesomeIcon icon={faCheck} />
          <span>{taskData?.ONGOING || 0}</span>
        </div>
        <div className="stat col-3" title="Total Tasks">
          <FontAwesomeIcon icon={faBarChart || 0} />
          <span>{taskData?.totalTask || 0}</span>
        </div>
      </div>

      <div>
        <div>
          <div className="pull-left w-100">
            <label className="lableName">Team Members</label>
            <div className="user-profile-pics">
              {accessibleBy
                .concat(managedBy)
                .slice(0, 13)
                .map((user, index) => (
                  <>
                    {!user?.profilePicture && (
                      <UserIcon key={index} firstName={user.name} />
                    )}
                    {user?.profilePicture && (
                      <div className="user-pic">
                        <img
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                          }}
                          src={`${user?.profilePicture}`}
                          alt="profile"
                        ></img>
                      </div>
                    )}
                  </>
                ))}
              {/* {accessibleBy?.length + managedBy?.length > 13 && ( */}
              <span
                style={{ position: "relative" }}
                key={"+"}
                onClick={() => {
                  onClickOfIcons(
                    accessibleBy.concat(managedBy),
                    "Assigned and Managed By"
                  );
                }}
              >
                <UserIcon firstName={"+"} />
                <i
                  className="fa fa-user-plus add-user-icon"
                  aria-hidden="true"
                ></i>
              </span>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
      {modalshow && (
        <Modal
          show={modalshow}
          onHide={() => {
            setModalShow(false);
            setShowSelectBox(false);
            setSelectedUnassignedUsers("");
            setListOfUnassignedUsers([]);
            setSelectedRole(null);
          }}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
            <Row>
            <Col sm={12}>
                  {userDetails.role !== "CONTRIBUTOR" &&
                    !isArchive &&
                    userDetails.role !== "LEAD" && (
                      <div onClick={assignTeamUser} className="assignPopup">
                        <UserIcon firstName={"+"} />
                        <p className="ms-4 mb-0">{"Add Team"}</p>
                      </div>
                    )}
                </Col>
                <div>
                  {showSelectBox && (
                    <>
                      <div className="select-rol-con">
                        <select
                          className="form-control form-control-lg"
                          value={selectedRole}
                          onChange={handleRoleChange}
                        >
                          <option value="">Select a role</option>
                          <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                          <option value="LEAD">LEAD</option>
                        </select>
                        {selectedRole === "CONTRIBUTOR" && (
                          <Select
                            options={contributorOptions}
                            value={contributorOptions.filter((option) =>
                              selectedUnassignedUsers.includes(option.value)
                            )}
                            isMulti
                            onChange={handleContributorsChange}
                          />
                        )}
                        {selectedRole === "LEAD" && (
                          <Select
                            options={leadOptions}
                            value={leadOptions.filter((option) =>
                              selectedUnassignedUsers.includes(option.value)
                            )}
                            isMulti
                            onChange={handleLeadsChange}
                          />
                        )}
                      </div>
                      {selectedUnassignedUsers && (
                        <div className="assign-name">
                          <button onClick={assignTeamUsers}>Assign</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
            </Row>
              <Row>
                {users.map((user, index) => {
                  return (
                    <Col key={index} sm={12}>
                      <div className="assignPopup">
                        <>
                          {!user?.profilePicture && (
                            <UserIcon key={index} firstName={user.name} />
                          )}
                          {user?.profilePicture && (
                            <div className="user-pic">
                              <img
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                }}
                                src={`${user?.profilePicture}`}
                                alt="profile"
                              ></img>
                            </div>
                          )}
                        </>
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
               
              </Row>
            </div>
          </Modal.Body>

          {/* <div className="text-right me-3">
            <button
              style={{ marginLeft: "16px", width: "30%" }}
              className="btn btn-press  btn-gradient-border btn-primary"
              onClick={() => {
                setModalShow(false);
                setShowSelectBox(false);
                setSelectedUnassignedUsers("");
                setListOfUnassignedUsers([]);
                setSelectedRole(null);
              }}
            >
              Close
            </button>
          </div> */}
        </Modal>
      )}
    </div>
  );
};

export default ProjectCard;
