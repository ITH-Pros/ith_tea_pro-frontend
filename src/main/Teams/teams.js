import React from "react";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllProjects,
  getUserAssignedProjects,
  assignUserToProject,
  getUserAnalytics,
  assignUserToProjectByIds,
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
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserIcon from "../Projects/ProjectCard/profileImage";

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

  //   numberOfRowsArray

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
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
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
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
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
          userAssignedProjects?.error?.message || "Something Went Wrong"
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

const handleSelectProject =(projectId) => {
  if (selectedProjectIds.includes(projectId)) {
    setSelectedProjectIds(selectedProjectIds.filter(id => id !== projectId));
  } else {
    setSelectedProjectIds([...selectedProjectIds, projectId]);
  }
}

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
          onChange={() => handleSelectProject(project._id)}
          type="checkbox"
        />
        <span>{project.name}</span>
      </div>
    );
  })}
      </>
    );
  };
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
        setToasterMessage(assignRes?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setModalShow(false);

        return;
      } else {
        setProjectListValue(assignRes.data);
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
    // const checkEnterKey = (e) => {
    //   console.log("e.keyCode", e.key);
    //   if (e.keyCode === 13) {
    //     let pageNumber = Math.min(
    //       Math.max(e.target.value, 1),
    //       pageDetails.totalPages
    //     );
    // 	let dataToSave = { ...pageDetails, [e.target.name]: pageNumber};
    // 	setPageDetails(dataToSave);
    //     getAndSetAllUsers(dataToSave);
    //   }
    // };

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
          //   onKeyDown={checkEnterKey}
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

  return (
    <>
      <div className="rightDashboard" style={{marginTop:'7%'}}>
        <h1 className="h1-text">
          <i className="fa fa-users" aria-hidden="true"></i>Team Members

          <div className="projects-button">
          {userDetails.role === "SUPER_ADMIN" && (
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
                Add User{" "}
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
                    {/* <label className="heart"></label> */}
                  </div>
                  <div className="content">
                    {/* <div id="profileImage"> </div> */}
                    <>
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
                      <strong style={{FontSize: '14px',
    color: '#673AB7'}}>
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
    <a href={user?.githubLink} target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faGithub} />
    </a>
  )}
  
  {user?.linkedInLink && (
    <a href={user?.linkedInLink} target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faLinkedin} />
    </a>
  )}
  
  {user?.twitterLink && (
    <a href={user?.twitterLink} target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faTwitter} />
    </a>
  )}
                      </div>
   
                    </div>

                 
                    





                    {/* <FontAwesomeIcon className="brand-icon" icon={faLinkedin} />
    <FontAwesomeIcon  className="brand-icon" icon={faFacebook} />
	<FontAwesomeIcon className="brand-icon" icon={faTwitter} /> */}
                  </div>

                  {userDetails.role === "SUPER_ADMIN" && "ADMIN" && user?.role !=='ADMIN' && (
                    <div className="btn">
                      <button
                        className="btn-glow margin-right btn-color"
                        onClick={() => {
                          handleAddUserToProject(user._id);
                        }}
                      >
                        {" "}
                        <i className="fa fa-check " aria-hidden="true"></i>{" "}
                        Assign
                      </button>

                      <button
                        className="btn-glow margin-right btn-color"
                        to={{
                          pathname: "/rating",
                        }}
                        state={{ userId: user._id }}
                      >
                        Add Rating
                      </button>
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
          <h6>No User Found</h6>
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
      </div>
    </>
  );
}
