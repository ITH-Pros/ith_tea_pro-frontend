/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import "./projectCard.css";
import UserIcon from "./profileImage";
import { useAuth } from "../../../auth/AuthProvider";
import { Modal, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import React from "react";
import { CiCircleRemove } from "react-icons/ci";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Offcanvas from "react-bootstrap/Offcanvas";

import {
  faTasks,
  faFlag,
  faCheck,
  faBarChart,
} from "@fortawesome/free-solid-svg-icons";
import {
  assignProjectLead,
  assignTeamAPI,
  getUnassignedUsers,
  removeUserFromProject,
} from "../../../services/user/api";
const customStyles = {
  option: (provided) => ({
    ...provided,
    padding: 5,
  }),

  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    height: "45px",
    borderRadius: "5px",
    color: "#767474",
    margin: "0px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom:'15px',
  }),
  placeholder: (provided) => ({
    ...provided,
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: 13,
    borderRadius: "0px 0px 10px 10px",
    boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.05)",
    top: "32px",
    padding: "5px",
    zIndex: "2",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "200px",
    height: "45px",
    overflowY: "auto",
    padding: "0px 10px",
  }),
};
const ProjectCard = ({
  name,
  description,
  handleEdit,
  element,
  managedBy,
  accessibleBy,
  handleDelete,
  background,
  taskData,
  handleToRedirectTask,
  getAndSetAllProjects,
  handleArchiveModalShow,
  isArchive,
}) => {

  const [modalshow, setModalShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalTitle, SetModalTitle] = useState("");
  const [showMenuList, setShowMenuList] = useState(false);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [listOfUnassignedUsers, setListOfUnassignedUsers] = useState([]);
  const [selectedUnassignedUsers, setSelectedUnassignedUsers] = useState("");

  const assignTeamUsers = async () => {
    let dataToSend = {
      projectId: element._id,
      userIds: selectedUnassignedUsers,
    };
    try {
      let response;
      if (selectedRole === "LEAD") {
        response = await assignProjectLead(dataToSend);
      } else {
        response = await assignTeamAPI(dataToSend);
      }
      if (response.error) {
        return;
      } else {
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
        return;
      } else {
        setListOfUnassignedUsers(response?.data);
      }
    } catch (error) {
      console.log("Error while getting user details");
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

  const handleMenuIconClick = () => {
    setShowMenuList(!showMenuList);
  };

  const { userDetails } = useAuth();

  const onClickOfIcons = (user, type) => {
    setUsers(user);
    SetModalTitle(type);
    setModalShow(true);
  };

  const contributorOptions = listOfUnassignedUsers.map((user, index) => ({
    value: user._id,
    label: user.name,
  }));

  const handleContributorsChange = (selectedOptions) => {
    setSelectedUnassignedUsers(selectedOptions.map((option) => option.value));
  };

  const leadOptions = listOfUnassignedUsers.map((user, index) => ({
    value: user._id,
    label: user.name,
  }));

  const guestOptions = listOfUnassignedUsers.map((user, index) => ({
    value: user._id,
    label: user.name,
  }));

  const handleLeadsChange = (selectedOptions) => {
    setSelectedUnassignedUsers(selectedOptions.map((option) => option.value));
  };

  const handleGuestsChange = (selectedOptions) => {
    setSelectedUnassignedUsers(selectedOptions.map((option) => option.value));
  };

  const handleConfirmation = (userId, username) => {
    setShowConfirmation(true);
    setSelectedUser(userId);
    setSelectedUserName(username);
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);

  function ConfirmationPopup({ show, onCancel, onConfirm }) {
    return (
      <Modal show={show} onHide={onCancel} centered id="confirmation_ui">
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Are you sure you want to remove {selectedUserName} ?
          <div className="mt-3 mb-3 text-center">
            <Button size="sm" variant="secondary " onClick={onCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              style={{ marginLeft: "10px" }}
              onClick={onConfirm}
            >
              Remove
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  const removeUser = async () => {
    let dataToSend = {
      projectId: element._id,
      userIds: [selectedUser],
    };
    try {
      const response = await removeUserFromProject(dataToSend);
      if (response.error) {
        console.log("Error while getting user details");
        return;
      } else {
        getAndSetAllProjects();
        setShowConfirmation(false);
        setSelectedUser(null);
        setSelectedUserName(null);
        setModalShow(false);
      }
    } catch (error) {
      console.log("Error while getting user details");
      // return error.message;
    }
  };

  return (
    <div className="project-card" style={{ border: `3px solid ${background}` }}>
      {isArchive && <h6 className="archived">Archived</h6>}
      <div
        className="menu-icon"
        onClick={handleMenuIconClick}
        onBlur={handleMenuIconClick}
      >
        {(userDetails.role === "SUPER_ADMIN" ||
          userDetails.role === "ADMIN") && (
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
              {!isArchive && (
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
              )}
              <a
                href="#1"
                onClick={() => {
                  handleArchiveModalShow();
                }}
              >
                <i className="fa fa-archive" aria-hidden="true"></i>{" "}
                {!isArchive ? "Archive" : "Unarchive"}
              </a>
              <a
                href="#1"
                onClick={() => {
                  handleDelete();
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i> Delete
              </a>
            </div>
          </button>
        )}
      </div>

      <div onClick={() => handleToRedirectTask()} className="project-details">
        <h4  style={{cursor:'pointer'}}>{name}</h4>
        <p   style={{cursor:'pointer'}} className="text-secondary">{description}</p>
      </div>

      <div className="project-stats row">
        <div className="stat col-3">
          <>
            {["top"].map((placement, index) => (
              <OverlayTrigger
                key={index}
                placement={placement}
                overlay={
                  <Tooltip id={`tooltip-${placement}`}>Overdue Tasks</Tooltip>
                }
              >
                <Button className="tooltip-button br0">
                  <FontAwesomeIcon icon={faFlag} />
                  <span className="text-secondary">
                    {taskData?.overDueTasks || 0}%
                  </span>
                </Button>
              </OverlayTrigger>
            ))}
          </>
        </div>
        <div className="stat col-3">
          <>
            {["top"].map((placement, index) => (
              <OverlayTrigger
                key={index + 1}
                placement={placement}
                overlay={
                  <Tooltip id={`tooltip-${placement}`}>Completed tasks</Tooltip>
                }
              >
                <Button className="tooltip-button br0">
                  <FontAwesomeIcon icon={faTasks} />
                  <span className="text-secondary">
                    {taskData?.COMPLETED || 0}%
                  </span>
                </Button>
              </OverlayTrigger>
            ))}
          </>
        </div>
        <div className="stat col-3">
          <>
            {["top"].map((placement, index) => (
              <OverlayTrigger
                key={index + 2}
                placement={placement}
                overlay={
                  <Tooltip id={`tooltip-${placement}`}>Ongoing tasks</Tooltip>
                }
              >
                <Button className="tooltip-button br0">
                  <FontAwesomeIcon icon={faCheck} />
                  <span className="text-secondary">
                    {taskData?.ONGOING || 0}%
                  </span>
                </Button>
              </OverlayTrigger>
            ))}
          </>
        </div>
        <div className="stat col-3">
          <>
            {["top"].map((placement, index) => (
              <OverlayTrigger
                key={index + 3}
                placement={placement}
                overlay={
                  <Tooltip id={`tooltip-${placement}`}>
                    Total number of tasks
                  </Tooltip>
                }
              >
                <Button className="tooltip-button br0">
                  <FontAwesomeIcon icon={faBarChart} />
                  <span className="text-secondary">
                    {taskData?.totalTask || 0}
                  </span>
                </Button>
              </OverlayTrigger>
            ))}
          </>
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
                    {!user?.profilePicture && index < 3 && (
                      <UserIcon key={index} firstName={user.name} />
                    )}
                    {index > 2 && index === 3 && (
                      <span
                        onClick={() => {
                          onClickOfIcons(
                            accessibleBy.concat(managedBy),
                            "Team Members"
                          );
                        }}
                      >
                        <UserIcon
                          key={index}
                          firstName={"..."}
                          className="team_icon"
                        />
                      </span>
                    )}
                    {user?.profilePicture && index < 3 && (
                      <div key={index} className="user_pic_card">
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
            </div>
            {userDetails.role !== "CONTRIBUTOR" && !isArchive && userDetails.role !== "GUEST" && (
  <div
    style={{ position: "relative", float: "right" }}
    onClick={() => {
      onClickOfIcons(accessibleBy.concat(managedBy), "Assigned and Managed By");
    }}
  >
    <i className="fa fa-user-plus add-user-icon" aria-hidden="true"></i>
  </div>
)}

          </div>
        </div>
      </div>
      {modalshow && (
        <Offcanvas
          className="Offcanvas-modal"
          style={{ width: "500px" }}
          show={modalshow}
          placement="end"
          onHide={() => {
            setModalShow(false);
            setShowSelectBox(false);
            setSelectedUnassignedUsers("");
            setListOfUnassignedUsers([]);
            setSelectedRole(null);
          }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title> {modalTitle}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="pt-0">
            <div>
              <Col sm={12}>
                {userDetails.role !== "CONTRIBUTOR" &&
                  !isArchive &&
                  modalTitle !== "Team Members" &&
                  userDetails.role !== "LEAD" && (
                    <div onClick={assignTeamUser} className="assignPopup">
                      <UserIcon
                        style={{ width: "20px" }}
                        firstName={"+"}
                        className="plus_icon"
                      />
                      <p className="ms-2 mb-0" style={{ cursor: "pointer" }}>
                        {" "}
                        {"Add Team"}
                      </p>
                    </div>
                  )}
              </Col>
              <div>
                {showSelectBox && (
                  <>
                    <div className="select-rol-con">
                      <select size="lg"
                        className="form-control form-control-lg mt-2"
                        value={selectedRole}
                        onChange={handleRoleChange}
                      >
                        <option value="">Select a role</option>
                        <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                        <option value="LEAD">LEAD</option>
                        <option value="GUEST">GUEST</option>
                      </select>
                      {selectedRole === "CONTRIBUTOR" && (
                        <Select
                          styles={customStyles}
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
                          styles={customStyles}
                          placeholder="Select Member"
                          options={leadOptions}
                          value={leadOptions.filter((option) =>
                            selectedUnassignedUsers.includes(option.value)
                          )}
                          isMulti
                          onChange={handleLeadsChange}
                        />
                      )}
                      {selectedRole === "GUEST" && (
                        <Select
                          styles={customStyles}
                          placeholder="Select Member"
                          options={guestOptions}
                          value={guestOptions.filter((option) =>
                            selectedUnassignedUsers.includes(option.value)
                          )}
                          isMulti
                          onChange={handleGuestsChange}
                        />
                      )}
                    </div>
                    {selectedUnassignedUsers && (
                      <div className="mb-3 pull-right">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={assignTeamUsers}
                        >
                          Assign
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div style={{clear:'both'}}></div>

              <Row >
                {users.map((user, index) => {
                  return (
                    <Col key={index} sm={12}>
                      <div className="assignPopup ">
                        <>
                          {!user?.profilePicture && (
                            <UserIcon
                              key={index}
                              firstName={user.name}
                              className="list_user"
                            />
                          )}
                          {user?.profilePicture && (
                            <div className="user_pic_card">
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
                        <div className="ms-2">
                          <p className="mb-0">
                            {user?.name} ({user?.role})
                          </p>
                          <p className="userEmail">{user?.email}</p>
                        </div>

                        {(userDetails.role === "SUPER_ADMIN" ||
                          userDetails.role === "ADMIN") && (
                          <CiCircleRemove
                            onClick={() =>
                              handleConfirmation(user._id, user.name)
                            }
                            style={{ cursor: "pointer" }}
                            className="delete_icon"
                          />
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <ConfirmationPopup
              show={showConfirmation}
              onCancel={() => setShowConfirmation(false)}
              onConfirm={removeUser}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default ProjectCard;
