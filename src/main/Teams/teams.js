/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllUsers,
  getAllProjects,
  getUserAssignedProjects,
  resendActivationLinkApi,
  getUserAnalytics,
  assignUserToProjectByIds,
  deleteUserById,
  getAllManager,
  assignManagerTOUserByIds,
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
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

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

  const [assignManagerModalShow, setAssignManagerModalShow] = useState(false);

  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");

  const [confirmModalShow, setConfirmModalShow] = useState(false);

  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const [managerList, setManagerList] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);

  const openAssignManagerModal = (userId) => {
    setSelectedManagers([]);
    setManagerList([]);

    setUserId(userId);
    // Fetch manager list
    getManagerList(userId);

    // Show the modal
    setAssignManagerModalShow(true);
  };

  const getManagerList = async (userId) => {
    setLoading(true);
    console.log("userId", userId);
    // Make an API call or perform any necessary operations to fetch the manager list

    try {
      const resp = await getAllManager();
      if (resp.error) {
        console.log(resp.error);
        setLoading(false);
      } else {
        setLoading(false);
        usersList.map((user) => {
          if (user?._id === userId) {
            if(user?.manager?.length > 0){
            setSelectedManagers(user?.manager);

            } else {
              setSelectedManagers([]);
            }
            console.log("user.manager", user?.manager);
          }
        });

        // if(user.role === "C")

        setManagerList(resp?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleManagerSelection = (managerId) => {
    // Update the selected managers array based on the checkbox selection
    const index = selectedManagers.indexOf(managerId);
    if (index > -1) {
      // Manager already selected, remove from the array
      setSelectedManagers((prevState) =>
        prevState.filter((manager) => manager !== managerId)
      );
    } else {
      // Manager not selected, add to the array
      setSelectedManagers((prevState) => [...prevState, managerId]);
    }
  };

  const assignManagers = async () => {
    // Perform any necessary actions with the selected managers
    console.log("Selected Managers:", selectedManagers);

    let data = {
      managerId: selectedManagers,
      userId: userId,
    };
    try {
      const resp = await assignManagerTOUserByIds(data);
      if (resp.error) {
        console.log(resp.error);
      } else {
        setAssignManagerModalShow(false);
        onInit();
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    if (!options?.currentPage) {
      return;
    }
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
                      setSelectedProjectIds(
                        selectedProjectIds.filter((id) => id !== project._id)
                      );
                    } else {
                      setSelectedProjectIds([
                        ...selectedProjectIds,
                        project._id,
                      ]);
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
        userId: userId,
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
      let pageNumber = parseInt(e.target.value);
      if (pageNumber < 1 || pageNumber > pageDetails.totalPages) {
        return;
      }
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
          onChange={(e) => handleOnChange(e)}
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
  const resendActivationLink = async (userId) => {
    setLoading(true);
    try {
      let dataToSend = {
        userId: userId,
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
  };
  const redirectToTeamReport = (user) => {
    if (userDetails.role === "CONTRIBUTOR") {
      return;
    }
    let data = {
      label: user?.name,
      value: user?._id,
    };
    console.log(data);
    localStorage.setItem("selectedOptions", JSON.stringify(data));
    navigate("/team-report");
  };

  return (
    <>
      <div className="rightDashboard" style={{ marginTop: "7%" }}>
        <h1 className="h1-text">
          <i className="fa fa-users" aria-hidden="true"></i>Team Members
          <div className="projects-button">
            {(userDetails.role === "SUPER_ADMIN" ||
              userDetails.role === "ADMIN") && (
              <Link
                style={{ float: "right" }}
                to={{
                  pathname: "/user/add",
                }}
              >
                <Button variant="primary" size="md">
                  <span
                    className="fa fa-user-plus"
                    title="Add User"
                    aria-hidden="true"
                    style={{ marginRight: "5px" }}
                  >
                    {" "}
                  </span>
                  Add Team{" "}
                </Button>
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

                  {(userDetails.role === "SUPER_ADMIN" ||
                    userDetails.role === "ADMIN") &&
                    !user?.isDeleted && (
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
                              setConfirmModalShow(true);
                              setUserId(user._id);
                            }}
                            icon="pi pi-check"
                            label="Confirm"
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

                          {/* Assign manager  */}
                          {}
                          <a
                            onClick={() => {
                              openAssignManagerModal(user._id);
                            }}
                            icon="pi pi-check"
                            label="Confirm"
                            // onClick={() => {
                            //   handleEdit();
                            // }}
                          >
                            {" "}
                            <i
                              className="fa fa-pencil-square"
                              aria-hidden="true"
                            ></i>{" "}
                            Assign Manager
                          </a>
                          {/* Assign manager  */}
                        </div>
                      </button>
                    )}
                  <div className="content">
                    <>
                      {!user?.credentials &&
                        (userDetails?.role === "SUPER_ADMIN" ||
                          userDetails?.role === "ADMIN") && (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>Resend Password Setup Link</Tooltip>
                            }
                          >
                            <div className="contents">
                              <img
                                onClick={() => resendActivationLink(user?._id)}
                                src={require("../../assests/img/resend-icon.jpg")}
                                alt="resend"
                                title="Resend Password Setup Link"
                              ></img>
                            </div>
                          </OverlayTrigger>
                        )}
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
                      <span
                        onClick={() => redirectToTeamReport(user)}
                        style={{ cursor: "pointer" }}
                      >
                        <strong style={{ FontSize: "14px", color: "#673AB7" }}>
                          {user.name} ({user.role})
                        </strong>
                        {user.designation && <p>{user?.designation}</p>}
                        <p>{user.email}</p>
                      </span>
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

                  {userDetails.role === "SUPER_ADMIN" &&
                    "ADMIN" &&
                    user?.role !== "ADMIN" && (
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
          <p className="alig-nodata">No User Found</p>
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
          <Modal.Body className="text-center">
            <h6>Are you sure you want to delete this user ?</h6>

            <div className="button-center-corformain mt-3">
              <Button
                variant="light"
                size="sm"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setConfirmModalShow(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteUser()}
              >
                Delete
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={assignManagerModalShow}
          onHide={() => {
            setAssignManagerModalShow(false);
          }}
          animation={false}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h2>Assign Manager</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="search-container">
              <div className="manager-list-container">
                {managerList.map((manager) => (
                  <label key={manager.id} className="manager-label">
                    <input
                      type="checkbox"
                      value={manager._id}
                      checked={selectedManagers.includes(manager._id)}
                      onChange={() => handleManagerSelection(manager._id)}
                    />
                    <span className="checkmark"></span>
                    <span className="manager-name">{manager.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="light"
              size="sm"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setAssignManagerModalShow(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              size="sm"
              className="confirm-button"
              style={{ marginRight: "10px" }}
              onClick={() => {
                assignManagers();
              }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
