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
import Modal from "react-bootstrap/Modal";

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
}) => {
  const generateRandomColor = () => {
    console.log(accessibleBy)
    console.log(element)
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
  const [modalTitle, SetModalTitle] = useState('');
    
       const [showMenuList, setShowMenuList] = useState(false);

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
      <div className="project-details">
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
      <div className="project-stats">
        <div onClick={()=>handleCategories()} className="stat">
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
        <div className=" pull-left w-50 text-center">
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

            {/* <FontAwesomeIcon icon={faEllipsisH} /> */}
          </div>
        </div>

        <div className=" pull-right w-50 text-center">
          <label className="lableName">Managed By</label>
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

            {/* <UserIcon firstName={profile.name} /> */}
          </div>
        </div>
      </div>
      {modalshow && (
        <Modal
          show={modalshow}
          onHide={() => setModalShow(false)}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {users.map((user, index) => {
                return (
                  <div>
                    <UserIcon firstName={user.name} />
                    <p>{user?.name}</p>
                  </div>
                );
              })}
              <UserIcon firstName={"+"} />
              <p>{"Add User"}</p>
            </div>
          </Modal.Body>

          <button
            style={{ marginLeft: "16px" }}
            className="btn mr-3"
            onClick={() => setModalShow(false)}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ProjectCard;
