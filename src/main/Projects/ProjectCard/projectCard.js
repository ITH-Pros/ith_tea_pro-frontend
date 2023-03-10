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

// const ProjectCard = (props) => {
//   return (
//     <div className="project-card">
//       <div className="menu-icon">
//         <FontAwesomeIcon icon={faEllipsisV} />
//         <div className="menu-options">
//           <div onClick={() => props.handleEdit()}>Edit</div>
//           <div onClick={() => props.handleDelete()}>Delete</div>
//         </div>
//       </div>
//       <div className="project-info">
//         <div className="project-name">{props.name}</div>
//         <div className="project-description">{props.description}</div>
//       </div>
//       <div className="project-icons">
//         <FontAwesomeIcon icon={faTasks} />
//         <FontAwesomeIcon icon={faComments} />
//         <FontAwesomeIcon icon={faFlag} />
//         <FontAwesomeIcon icon={faClock} />
//       </div>
//       <div className="user-profile-pictures">
//         <img src="user1.jpg" alt="user1" />
//         <img src="user2.jpg" alt="user2" />
//         <img src="user3.jpg" alt="user3" />
//         <img src="user4.jpg" alt="user4" />
//         <img src="user5.jpg" alt="user5" />
//         <img src="user6.jpg" alt="user6" />
//         <img src="user7.jpg" alt="user7" />
//         <img src="user8.jpg" alt="user8" />
//         <img src="user9.jpg" alt="user9" />
//         <img src="user10.jpg" alt="user10" />
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;
import { useAuth } from "../../../auth/AuthProvider";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faTasks,
  faCommentDots,
  faFlag,
  faClock,
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
    
       const [showMenuList, setShowMenuList] = useState(false);

       const handleMenuIconClick = () => {
         setShowMenuList(!showMenuList);
       };
    const { userDetails } = useAuth();


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
              <a onClick={() => {
				handleEdit();
			  } } > Edit</a>
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
        <div className="stat">
          <FontAwesomeIcon icon={faTasks} />
          <span>0</span>
        </div>
        <div className="stat">
          <FontAwesomeIcon icon={faCommentDots} />
          <span>{element?.tasks?.length}</span>
        </div>
        <div className="stat">
          <FontAwesomeIcon icon={faFlag} />
          <span>0</span>
        </div>
        <div className="stat">
          <FontAwesomeIcon icon={faClock} />
          <span>0</span>
        </div>
      </div>
	 

	   <div>
	   <div className=" pull-left w-50 text-center">
        <label className="lableName">Accessible By</label>
        <div className="user-profile-pics">
        {accessibleBy?.map((profile, index) => (
              <UserIcon firstName={profile?.name} />
            ))}
        </div>
        
      </div>

	  <div className=" pull-right w-50 text-center" > 
      <label className="lableName">Managed By</label>
      <div className="user-profile-pics">
      {managedBy?.map((profile, index) => (
            <UserIcon firstName={profile.name} />
          ))}
      </div>
	   </div>
	   </div>

     
    </div>
  );
};

export default ProjectCard;
