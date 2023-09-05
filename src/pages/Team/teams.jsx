import React from "react";
import { useState } from "react";
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
} from "@services/user/api";
import "./teams.css";
import Loader from "@components/Shared/Loader";
import { Link } from "react-router-dom";
import Modals from "@components/Shared/modal";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Modal,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import ViewTeamList from "@components/Team-list/team-list";
import { toast } from "react-toastify";
import UserIcon from "@components/ProfileImage/profileImage";
import resend from "@assets/img/resend-icon.jpg";
import { useAuth } from "../../utlis/AuthProvider";
import { useMutation, useQuery } from "react-query";

export default function Teams() {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [projectList, setProjectListValue] = useState([]);
  const [userAssignedProjects, setUserAssignedProjects] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [pageDetails, setPageDetails] = useState({
    currentPage: 1,
    rowsPerPage: 10,
    totalPages: 1,
  });
  const [assignManagerModalShow, setAssignManagerModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [managerList, setManagerList] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);

  const openAssignManagerModal = (userId) => {
    setSelectedManagers([]);
    setManagerList([]);
    setUserId(userId);
    setAssignManagerModalShow(true);
  };

  /* ************* Get All Users ************* */

  const {
    data: usersList,
    error: usersError,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useQuery(
    ["allUsersList", pageDetails.currentPage, pageDetails.rowsPerPage],
    () =>
      getAllUsers({
        params: {
          limit: pageDetails?.rowsPerPage,
          currentPage: pageDetails?.currentPage,
        },
      }),
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
      onSuccess: (data) => {
        let totalPages = Math.ceil(data?.totalCount / pageDetails?.rowsPerPage);
        console.log("totalPages", data);
        setPageDetails({
          currentPage: Math.min(pageDetails?.currentPage, totalPages),
          rowsPerPage: pageDetails?.rowsPerPage,
          totalPages,
        });
      },
      onError: (err) => {
        throw new Error(err);
      },
    }
  );

  /* *************  Get All manager *************** 
  /* @ param: options
  /* Desc: Get all managers and set the managerList state
  /* ******************************************* */

  const { isLoading: isManagerLoading } = useQuery(
    ["managerList", userId],
    () => getAllManager(),
    {
      refetchOnWindowFocus: false,
      enabled: assignManagerModalShow,
      onSuccess: (data) => {
        const updatedManagerList = data.data.filter(
          (manager) => manager._id !== userId
        );
        setManagerList(updatedManagerList);
        usersList?.users?.forEach((user) => {
          if (user?._id === userId) {
            if (user?.managerIds?.length > 0) {
              setSelectedManagers(user?.managerIds);
            } else {
              setSelectedManagers([]);
            }
          }
        });
      },
    }
  );

  const handleManagerSelection = (managerIds) => {
    // Update the selected managers array based on the checkbox selection
    const index = selectedManagers.indexOf(managerIds);
    if (index > -1) {
      // Manager already selected, remove from the array
      setSelectedManagers((prevState) =>
        prevState.filter((manager) => manager !== managerIds)
      );
    } else {
      // Manager not selected, add to the array
      setSelectedManagers((prevState) => [...prevState, managerIds]);
    }
  };

  /* ************* Assign Manager to User ************* */

  const assignManagers = async () => {
    if (selectedManagers.length === 0) {
      toast.dismiss();
      toast.info("Please select  manager");
      return;
    } else if (selectedManagers.length > 1) {
      let data = {
        managerIds: selectedManagers,
        userId: userId,
      };
      assignManagersMutation.mutate(data);
    }
  };

  const assignManagersMutation = useMutation(assignManagerTOUserByIds, {
    onSuccess: (data) => {
      refetchUsersList();
      refetchUsers();
      toast.dismiss();
      toast.info(data?.message || "Something Went Wrong");
      setAssignManagerModalShow(false);
        },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    },
  });

  const { isLoading: isAssigningManager } = assignManagersMutation;

  /* ************* Get All Users analytics ************* */

  const { data: userAnalytics, isLoading: isLoadingUserAnalytics , refetch:refetchUsersList } = useQuery(
    ["userAnalytics", usersList],
    () => getUserAnalytics(),
    {
      refetchOnWindowFocus: false,
      enabled: usersList?.users?.length > 0,
      select: (data) => {
        return data?.data;
      },
    }
  );

  /* ************* handle add-user to project ************* */

  const handleAddUserToProject = async function (userId) {
    setSelectedProjectIds("");
    // refetchProjectList();
    let dataToSend = {
      params: { userId },
    };
    assignedUserToProjectMutation.mutate(dataToSend);
    setSelectedUserId(userId);
    setModalShow(true);
  };

  const { isLoading: projectLoading } = useQuery(
    ["allProjects", modalShow],
    () => getAllProjects(),
    {
      refetchOnWindowFocus: false,
      enabled: modalShow,
      onSuccess: (data) => setProjectListValue(data?.data),
    }
  );

  const assignedUserToProjectMutation = useMutation(getUserAssignedProjects, {
    onSuccess: (data) => {
      setUserAssignedProjects(data?.data);
    },
  });

  const GetModalBody = () => {
    return (
      <>
        {projectList &&
          projectList?.map((project, index) => {
            const checkAlreadyAssigned = userAssignedProjects?.find(
              (ele) => ele?._id === project?._id
            );
            const isSelected = selectedProjectIds?.includes(project?._id);
            return (
              <div key={project?._id} className="assignPro">
                <input
                  disabled={checkAlreadyAssigned}
                  checked={checkAlreadyAssigned || isSelected}
                  onChange={() => {
                    if (isSelected) {
                      setSelectedProjectIds(
                        selectedProjectIds?.filter((id) => id !== project?._id)
                      );
                    } else {
                      setSelectedProjectIds([
                        ...selectedProjectIds,
                        project?._id,
                      ]);
                    }
                  }}
                  type="checkbox"
                />
                <span>{project?.name}</span>
                {projectLoading && (
                  <Spinner animation="border" variant="primary" />
                )}
              </div>
            );
          })}
      </>
    );
  };

  /* *
   *  Handle Assign User To Project
   * */

  const assignUserToProjectMutation = useMutation(assignUserToProjectByIds, {
    onSuccess: (data) => {
      if (data.error) {
        toast.dismiss();
        toast.info(data?.message || "Something Went Wrong");
        // set
        setModalShow(false);
        return;
      } else {
        // setProjectListValue(data);
        setModalShow(false);
        toast.dismiss();
        toast.info(data?.message);
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
      // set
      setModalShow(false);
      return error.message;
    },
  });

  const handleAssignUserProjectSubmit = async () => {
    if (selectedProjectIds.length === 0) {
      toast.dismiss();
      toast.info("Please select project");
      return;
    }

    let dataToSend = {
      projectIds: selectedProjectIds,
      userId: selectedUserId,
    };
    assignUserToProjectMutation.mutate(dataToSend);
  };

  // const { isLoading: assignUserLoading } = assignUserToProjectMutation;

  /* *
   *  Delete User
   * */

  const deleteUserMutation = useMutation(deleteUserById, {
    onSuccess: (data) => {
      toast.dismiss();
      toast.info("User Deleted Successfully");
      setConfirmModalShow(false);
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    },
  });

  const handleDeleteUser = async () => {
    let dataToSend = {
      userId: userId,
    };
    deleteUserMutation.mutate(dataToSend);
  };

  const { isLoading: isDeleting } = deleteUserMutation;

  /* *
   *  Pagination
   * */

  const CustomPagination = (props) => {
    const { setPageDetails, pageDetails } = props;

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
    };

    const onChangeRowsPerPage = (e) => {
      let dataToSave = {
        ...pageDetails,
        [e.target.name]: parseInt(e.target.value),
        currentPage: 1,
      };
      setPageDetails(dataToSave);
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
          {numberOfRowsArray.map((ele) => {
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
        toast.dismiss();
        toast.info(resendLink?.message || "Something Went Wrong");
        // set
        return;
      } else {
        toast.dismiss();
        toast.info(resendLink?.message);
        // set
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      // set
      return error.message;
    }
  };
  const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
  const redirectToTeamReport = (user) => {
    if (allowedRoles.includes(userDetails?.role)) {
      let data = {
        label: user?.name,
        value: user?._id,
      };
      // console.log(data)
      localStorage.setItem("selectedOptions", JSON.stringify(data));
      navigate("/team-report");
    }
    return;
  };

  const AssignedManager = (user) => {
    const filteredManagers = managerList.filter((manager) =>
      user?.managerIds?.includes(manager._id)
    );
    const managerNames = filteredManagers.map((manager) => manager.name);

    return (
      <span>
        {managerNames.length > 0 && <>M: </>}
        {managerNames.length > 0
          ? managerNames.map((name, index) => (
              <span key={index}>
                {name}
                {index !== managerNames.length - 1 ? "," : "."}{" "}
              </span>
            ))
          : user?.credentials && (
              <Button variant="primary" size="sm" className="add_m">
                <span
                  className="fa fa-user-plus"
                  title="Assign Managers"
                  aria-hidden="true"
                  onClick={() => {
                    openAssignManagerModal(user._id);
                  }}
                ></span>
              </Button>
            )}
      </span>
    );
  };

  const [isTeamList, setIsTeamList] = useState(false);

  const getTeamListForLogginUser = () => {
    setIsTeamList(!isTeamList);
  };

  return (
    <>
      <div className="rightDashboard" style={{ marginTop: "7%" }}>
        <h1 className="h1-text">
          <i className="fa fa-users" aria-hidden="true"></i>
          Team Members
          <div className="projects-button">
            {userDetails?.role === "LEAD" && (
              <Button
                style={{ marginRight: "10px", marginLeft: "5px" }}
                onClick={getTeamListForLogginUser}
              >
                <span
                  className=""
                  aria-hidden="true"
                  style={{ marginRight: "10px", marginLeft: "5px" }}
                >
                  {" "}
                </span>
                Team List{" "}
              </Button>
            )}

            {(userDetails?.role === "SUPER_ADMIN" ||
              userDetails?.role === "ADMIN") && (
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

        {isTeamList && <ViewTeamList isTeamList={isTeamList} />}

        <div className="container-team">
          {usersList?.users &&
            usersList?.users?.map((user, index) => {
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

                  {(userDetails?.role === "SUPER_ADMIN" ||
                    userDetails?.role === "ADMIN") &&
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
                          <a
                            onClick={() => {
                              openAssignManagerModal(user._id);
                            }}
                            icon="pi pi-check"
                            label="Confirm"
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
                                src={resend}
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
                            <>
                              {(userDetails?.role === "SUPER_ADMIN" ||
                                userDetails?.role === "ADMIN") &&
                                usersList?.users?.length > 0 &&
                                AssignedManager(user)}
                            </>
                            <div className="user-analytics-item">
                              <div className="user-analytics-item-value">
                                Completed After Due Date:{" "}
                                {userAnalytics
                                  .find(
                                    (analytics) => analytics?._id === user._id
                                  )
                                  .completedAfterDueDatePercentage.toFixed(2)}
                                {isLoadingUserAnalytics && <i>loading...</i>}%
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

                  {(userDetails?.role === "SUPER_ADMIN" ||
                    userDetails?.role === "ADMIN") &&
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
                      </div>
                    )}
                </div>
              );
            })}
        </div>

        {usersList?.users?.length ? (
          <CustomPagination
            pageDetails={pageDetails}
            setPageDetails={setPageDetails}
          />
        ) : (
          <p className="alig-nodata">
            {isUsersLoading ? "Loading..." : "No User Found"}
          </p>
        )}

        {loading ? <Loader /> : null}

        <Modals
          modalShow={modalShow}
          modalBody={<GetModalBody />}
          heading="Assign Project"
          onHide={() => setModalShow(false)}
          loading={projectLoading}
          submitBtnDisabled={!selectedProjectIds}
          onClick={handleAssignUserProjectSubmit}
        />

        {isTeamList && (
          <ViewTeamList
            isTeamList={isTeamList}
            getTeamListForLogginUser={getTeamListForLogginUser}
          />
        )}

        <Modal
          centered
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
            <div className="form-group py-3">
              <p>Are you sure you want to delete this user ?</p>
            </div>

            <div className="row text-right">
              <div className="col-md-12">
                <Button
                  onClick={() => {
                    setConfirmModalShow(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => handleDeleteUser()}
                >
                  Delete
                  {isDeleting ? <Spinner animation="border" size="sm" /> : null}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          centered
          show={assignManagerModalShow}
          onHide={() => {
            setAssignManagerModalShow(false);
          }}
          animation={false}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Assign Manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="search-container">
              <div className="manager-list-container">
                {managerList?.map((manager) => (
                  <label key={manager?._id} className="manager-label">
                    <input
                      type="checkbox"
                      value={manager._id}
                      checked={selectedManagers.includes(manager?._id)}
                      onChange={() => handleManagerSelection(manager?._id)}
                    />
                    <span className="checkmark"></span>
                    <span className="manager-name">{manager?.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setAssignManagerModalShow(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              style={{ marginRight: "10px" }}
              onClick={() => {
                assignManagers();
              }}
            >
              Confirm{" "}
              {isAssigningManager ? (
                <Spinner animation="border" size="sm" />
              ) : null}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
