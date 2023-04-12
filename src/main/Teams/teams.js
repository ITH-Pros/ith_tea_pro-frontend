/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllProjects,
  getUserAssignedProjects,
  resendActivationLinkApi,
  getUserAnalytics,
  assignUserToProjectByIds,
  deleteUserById,
} from "../../services/user/api";
import "./teams.css";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Modals from "../../components/modal";
import { useAuth } from "../../auth/AuthProvider";
import Toaster from "../../components/Toaster";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserIcon from "../Projects/ProjectCard/profileImage";
import { Button, Modal } from "react-bootstrap";

export default function Teams(props) {
  const { userDetails } = useAuth();
  const [userAnalytics, setUserAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [usersList, setUsersListValue] = useState([]);
  const [projectList, setProjectListValue] = useState([]);
  const [userAssignedProjects, setUserAssignedProjects] = useState([]);
  const [toaster, showToaster] = useState(false);
  const [pageDetails, setPageDetails] = useState({
    currentPage: 1,
    rowsPerPage: 10,
    totalPages: 1,
  });

  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");

  const [confirmModalShow, setConfirmModalShow] = useState(false);

const [userId, setUserId] = useState("");




  useEffect(() => {
    onInit();
  }, []);

  function onInit() {
    let options = {
      currentPage: 1,
      rowsPerPage: 10,
    };
    getAndSetAllUsers(options);
  }

  const getUserAnalitics = async () => {
    setLoading(true);
    try {
      const userAnalytics = await getUserAnalytics();
      setLoading(false);
      if (userAnalytics.error) {
        setToasterMessage(userAnalytics?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setUserAnalytics(userAnalytics?.data);
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const getAndSetAllUsers = async function (options) {
    setLoading(true);
    try {
      let params = {
        limit: options?.rowsPerPage,
        currentPage: options?.currentPage,
      };
      const projects = await getAllUsers({ params });
      setLoading(false);
      if (projects.error) {
        setToasterMessage(projects?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setUsersListValue(projects?.data?.users || []);
        let totalPages = Math.ceil(
          projects.data.totalCount / options?.rowsPerPage
        );
        setPageDetails({
          currentPage: Math.min(options?.currentPage, totalPages),
          rowsPerPage: options?.rowsPerPage,
          totalPages,
        });
        getUserAnalitics();
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  // const handleSelectProject = (projectId) => {
  //   setSelectedProjectId(projectId);
  // };

  const handleAddUserToProject = async function (userId) {
    setSelectedProjectIds("");
    setLoading(true);
    try {
      const projects = await getAllProjects();
      setLoading(false);
      if (projects.error) {
        setToasterMessage(projects?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setProjectListValue(projects.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
    try {
      let dataToSend = {
        params: { userId },
      };
      const userAssignedProjects = await getUserAssignedProjects(dataToSend);
      setLoading(false);
      if (userAssignedProjects.error) {
        setToasterMessage(
          userAssignedProjects?.message || "Something Went Wrong"
        );
        setShowToaster(true);
        return;
      } else {
        setUserAssignedProjects(userAssignedProjects.data);
      
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
    setSelectedUserId(userId);
    setModalShow(true);
  };

  const [selectedProjectIds, setSelectedProjectIds] = useState([]);

// const handleSelectProject =(projectId) => {
//   if (selectedProjectIds.includes(projectId)) {
//     setSelectedProjectIds(selectedProjectIds.filter(id => id !== projectId));
//   } else {
//     setSelectedProjectIds([...selectedProjectIds, projectId]);
//   }
// }
const GetModalBody = () => {
  return (
    <>
      {projectList &&
        projectList.map((project, index) => {
          const checkAlreadyAssigned = userAssignedProjects.find(
            (ele) => ele._id === project._id
          );
          const isSelected = selectedProjectIds.includes(project._id);
          return (
            <div key={project._id} className="assignPro">
              <input
                disabled={checkAlreadyAssigned}
                checked={checkAlreadyAssigned || isSelected}
                onChange={() => {
                  if (isSelected) {
                    setSelectedProjectIds(selectedProjectIds.filter((id) => id !== project._id));
                  } else {
                    setSelectedProjectIds([...selectedProjectIds, project._id]);
                  }
                }}
                type="checkbox"
              />
              <span>{project.name}</span>
            </div>
          );
        })}
    </>
  );
};


  // const GetModalBody = () => {
  //   return (
  //     <>
  //       {projectList &&
  // projectList.map((project, index) => {
  //   const checkAlreadyAssigned = userAssignedProjects.find(
  //     (ele) => ele._id === project._id
  //   );
  //   const isSelected = selectedProjectIds.includes(project._id);
  //   return (
  //     <div key={project._id} className="assignPro">
  //       <input
  //         disabled={checkAlreadyAssigned}
  //         checked={checkAlreadyAssigned || isSelected}
  //         onChange={() => handleSelectProject(project._id)}
  //         type="checkbox"
  //       />
  //       <span>{project.name}</span>
  //     </div>
  //   );
  // })}
  //     </>
  //   );
  // };
  const handleAssignUserProjectSubmit = async () => {
    setLoading(true);
    try {
      let dataToSend = {
        projectIds: selectedProjectIds,
        userId: selectedUserId,
      };
      const assignRes = await assignUserToProjectByIds(dataToSend);
      setLoading(false);
      if (assignRes.error) {
        setToasterMessage(assignRes?.message || "Something Went Wrong");
        setShowToaster(true);
        setModalShow(false);

        return;
      } else {
        setProjectListValue(assignRes.data);
        setToasterMessage(assignRes?.message);

        
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setModalShow(false);
      return error.message;
    }
    setModalShow(false);
  };


  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      let dataToSend = {
        userId:userId ,
      };
      const deleteUser = await deleteUserById(dataToSend);
      setLoading(false);
      if (deleteUser.error) {
        setToasterMessage(deleteUser?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage("User Deleted Successfully");
        setShowToaster(true);
        getAndSetAllUsers(pageDetails);
        setConfirmModalShow(false);
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const CustomPagination = (props) => {
    const { getAndSetAllUsers, setPageDetails, pageDetails } = props;

    const numberOfRowsArray = [10, 20, 30, 40, 50];
    const handleOnChange = (e) => {
      let pageNumber = Math.min(
        Math.max(e.target.value, 1),
        pageDetails.totalPages
      );
      if (pageDetails.currentPage === pageNumber) {
        return;
      }
      let dataToSave = { ...pageDetails, [e.target.name]: pageNumber };
      setPageDetails(dataToSave);
      getAndSetAllUsers(dataToSave);
    };

 

    const onChangeRowsPerPage = (e) => {
      let dataToSave = {
        ...pageDetails,
        [e.target.name]: parseInt(e.target.value),
        currentPage: 1,
      };

      setPageDetails(dataToSave);
      getAndSetAllUsers(dataToSave);
    };
    const changePageNumber = (value) => {
      if (
        pageDetails.currentPage + value <= 0 ||
        pageDetails.currentPage + value > pageDetails.totalPages
      ) {
        return;
      }
      let dataToSave = {
        ...pageDetails,
        currentPage: pageDetails.currentPage + value,
      };
      setPageDetails(dataToSave);
      getAndSetAllUsers(dataToSave);
    };
  
    return (
      <div className="pagination ">
        <i
          className="fa fa-angle-left pagination-arrow left-arrow"
          aria-hidden="true"
          onClick={() => changePageNumber(-1)}
        ></i>
        <input
          className="pagination-input"
          type="number"
          value={pageDetails.currentPage}
          name="currentPage"
          onChange={handleOnChange}
          autoFocus
        />
        <span className="pagination-input">/</span>
        <span className="pagination-input"> {pageDetails.totalPages}</span>
        <i
          className="fa fa-angle-right pagination-arrow right-arrow"
          aria-hidden="true"
          onClick={() => changePageNumber(1)}
        ></i>
        <span className="page-per-view"> Per Page View : </span>
        <select
          className="pagination-select"
          onChange={onChangeRowsPerPage}
          name="rowsPerPage"
          value={pageDetails.rowsPerPage}
        >
          {numberOfRowsArray.map((ele, index) => {
            return (
              <option key={ele} value={ele}>
                {ele}
              </option>
            );
          })}
        </select>
      </div>
    );
  };
  const resendActivationLink = async(userId) => {
    setLoading(true); 
    try {
      let dataToSend = {
        userId:userId ,
      };
      const resendLink = await resendActivationLinkApi(dataToSend);
      setLoading(false);
      if (resendLink.error) {
        setToasterMessage(resendLink?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage(resendLink?.message);
        setShowToaster(true);
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  }

  return (
    <>
      <div className="rightDashboard" style={{ marginTop: "7%" }}>
        <h1 className="h1-text">
          <i className="fa fa-users" aria-hidden="true"></i>Team Members
          <div className="projects-button">
          {(userDetails.role === "SUPER_ADMIN" || userDetails.role === "ADMIN")  && (
            <Link style={{float:'right'}}
              to={{
                pathname: "/user/add",
              }}
            >
              <i
                className="fa fa-user-plus fa-3x addBtn"
                title="Add User"
                aria-hidden="true"
                style={{ marginRight: "5" }}
              >
                {" "}
                Add Team{" "}
              </i>
            </Link>
          )}
          </div>
        </h1>

        <div className="container-team">
          {usersList &&
            usersList.map((user, index) => {
              return (
                <div key={user._id} className="box">
                  <div className="top-bar"></div>
                  <div className="top">
                    <Link
                      to={{
                        pathname: "/user/view/" + user._id,
                      }}
                    ></Link>
                  </div>




                  {(userDetails.role === "SUPER_ADMIN" || userDetails.role ==="ADMIN") && !user?.isDeleted && (
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
                onClick={()=>{setConfirmModalShow(true); setUserId(user._id)}

                } icon="pi pi-check" label="Confirm"
                  // onClick={() => {
                  //   handleEdit();
                  // }}
                >
                  {" "}
                  <i
                    className="fa fa-pencil-square"
                    aria-hidden="true"
                  ></i>{" "}
                  Delete user
                </a>
              
           
            </div>
          </button>
        )}
                  <div className="content">
                    <>
                      {!user?.credentials&&<img onClick={()=>resendActivationLink(user?._id)} style={{ width: '36px', height: '36px', position: 'relative', bottom: '23px', left: '112px', cursor: 'pointer' }} src={require("../../assests/img/resend-icon.jpg")} alt='resend' title="Resend Password Setup Link" ></img>}
                      {!user?.profilePicture && (
                        <UserIcon key={index} firstName={user.name} />
                      )}
                      {user?.profilePicture && (
                        <div className="user-pic">
                          <img
                            style={{
                              width: "45px",
                              height: "45px",
                              borderRadius: "50%",
                            }}
                            src={`${user?.profilePicture}`}
                            alt="profile"
                          ></img>
                        </div>
                      )}
                    </>
                    <div className="content-height">
                      <strong style={{ FontSize: "14px", color: "#673AB7" }}>
                        {user.name} ({user.role})
                      </strong>
                      {user.designation && <p>{user?.designation}</p>}
                      <p>{user.email}</p>
                      {user.employeeId && <p>{user?.employeeId} </p>}
                      {userDetails?.role !== "CONTRIBUTOR" &&
                        userAnalytics &&
                        Array.isArray(userAnalytics) &&
                        userAnalytics.find(
                          (analytics) => analytics?._id === user?._id
                        ) && (
                          <div className="user-analytics">
                            <div className="user-analytics-item">
                              <div className="user-analytics-item-value">
                                Completed After Due Date:{" "}
                                {userAnalytics
                                  .find(
                                    (analytics) => analytics?._id === user._id
                                  )
                                  .completedAfterDueDatePercentage.toFixed(2)}
                                %
                              </div>

                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: `${userAnalytics
                                      .find(
                                        (analytics) =>
                                          analytics?._id === user._id
                                      )
                                      .completedAfterDueDatePercentage.toFixed(
                                        2
                                      )}%`,
                                  }}
                                  aria-valuenow={userAnalytics
                                    .find(
                                      (analytics) => analytics?._id === user._id
                                    )
                                    .completedAfterDueDatePercentage.toFixed(2)}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}

                      <div className="team-socail">
                        {user?.githubLink && (
                          <a
                            href={user?.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faGithub} />
                          </a>
                        )}

                        {user?.linkedInLink && (
                          <a
                            href={user?.linkedInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faLinkedin} />
                          </a>
                        )}

                        {user?.twitterLink && (
                          <a
                            href={user?.twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faTwitter} />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>

                  {userDetails.role === "SUPER_ADMIN" && "ADMIN" && user?.role !=='ADMIN' && (
                    <div className="btn">
                      <button
                        className="btn-glow margin-right btn-color"
                        onClick={() => {
                          handleAddUserToProject(user._id);
                        }}
                      >
                        <i className="fa fa-check " aria-hidden="true"></i>{" "}
                        Assign
                      </button>

                      {/* <button
                        className="btn-glow margin-right btn-color"
                        to={{
                          pathname: "/rating",
                        }}
                        state={{ userId: user._id }}
                      >
                        Add Rating
                      </button> */}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {usersList?.length ? (
          <CustomPagination
            getAndSetAllUsers={getAndSetAllUsers}
            pageDetails={pageDetails}
            setPageDetails={setPageDetails}
          />
        ) : (
          <h6 className="text-center">No User Found</h6>
        )}

        {loading ? <Loader /> : null}
        {toaster && (
          <Toaster
            message={toasterMessage}
            show={toaster}
            close={() => showToaster(false)}
          />
        )}
        

        <Modals
          modalShow={modalShow}
          modalBody={<GetModalBody />}
          heading="Assign Project"
          onHide={() => setModalShow(false)}
          submitBtnDisabled={!selectedProjectIds}
          onClick={handleAssignUserProjectSubmit}
        />


<Modal
        show={confirmModalShow}
        onHide={() => {
          setConfirmModalShow(false);
          
        }}
        animation={false}
        className="confirmation-popup"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="delete-popup">
          <h6>
            Are you sure you want to delete this user ?
          </h6>

          <div className="button-center-corformain">
           
              <Button
                style={{ marginLeft: "16px" }}
                className="btn btn-danger mb-3 mr-3"
                onClick={() => handleDeleteUser()}
              >
                Delete
              </Button>
       
           
            <Button
              style={{ marginLeft: "16px" }}
              className="btn mb-3 mr-3"
              onClick={() => {
                setConfirmModalShow(false);
                
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>




      </div>
    </>
  );
}
