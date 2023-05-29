/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "./dashboard.css";
import Col from "react-bootstrap/Col";
import Loader from "../../components/Loader";
import { editLogedInUserDetails, getAllUsers } from "../../services/user/api";
import Toaster from "../../components/Toaster";
import avtar from "../../assests/img/avtar.png";
import leadAvatar from "../../assests/img/leadAvatar.jpeg";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../Tasks/AddTaskModal";
import AddRatingModal from "../Rating/add-rating-modal";
import UserForm from "../edit-profile";
import { useAuth } from "../../auth/AuthProvider";
import AddRating from "../Rating/add-rating";
import ViewTaskModal from "../Tasks/view-task";
import Offcanvas from 'react-bootstrap/Offcanvas';

import {
  BsChevronDoubleLeft,
  BsChevronLeft,
  BsChevronDoubleRight,
  BsChevronRight,
  BsPersonAdd,
} from "react-icons/bs";
import {
  getAllMyWorks,
  getAllPendingRating,
  getAllProjects,
  getTeamWork,
  updateTaskStatusById,
  getOverDueTaskListData,
} from "../../services/user/api";
import {
  Row,
  Container,
  Nav,
  Dropdown,
  Card,
  Button,
  Badge,
  Modal,
  Popover,
  Form,
} from "react-bootstrap";
import CustomCalendar from "./custom-calender";
import ResetPassword from "../../auth/resetPassword";

export default function Dashboard(props) {
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectListValue] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [myWorkList, setMyWorkList] = useState();
  const [overdueWorkList, setOverdueWorkList] = useState();
  const [selectedTask, setSelectedTask] = useState({});
  const [pendingRatingList, setPendingRatingList] = useState();
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showModalOnLogin, setShowModalOnLogin] = useState(true);
  const [teamWorkList, setTeamWorkList] = useState([]);
  const [showViewTask, setShowViewTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const { userDetails } = useAuth();
  const setShowToaster = (param) => showToaster(param);
  const [isChange, setIsChange] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    
    setShowModalOnLogin(
      localStorage.getItem("profileCompleted") === "false" ? true : false
    );


    onInit();
  
  }, []);

  function onInit() {
    getAndSetAllProjects();
    if (userDetails?.role === "SUPER_ADMIN" || userDetails?.role === "ADMIN") {
      getOverDueTaskList();
    }
    if (userDetails?.role !== "SUPER_ADMIN" || userDetails?.role !== "ADMIN") {
      getMyWork();
    }

   
    getPendingRating();

    

    if (userDetails?.role !== "CONTRIBUTOR") {
      getAndSetAllUsers();
    }
 
  }

  const handleProfileModalClose = () => {

    setShowModalOnLogin(false);
    localStorage.removeItem("profileCompleted");
    
  };

  const handleToRedirectTask = (projectId, isArchive) => {
    navigate(
      `/task/${JSON.stringify({
        projectId: projectId,
        isArchive: isArchive,
      })}/}`
    );
  };

  const handleTaskReopen = async (taskId) => {
    let dataToSend = {
      taskId: taskId,
      status: "OPEN",
    };
    // setLoading(true);
    // try {
    //   const tasks = await updateTaskStatusById(dataToSend);
    //   setLoading(false);
    //   if (tasks.error) {
    //     setToasterMessage(
    //       tasks?.message || "Something Went Wrong While Updating Task Status"
    //     );
    //     setShowToaster(true);
    //   } else {
    //     setToasterMessage("Task Reopened Successfully");
    //     setShowToaster(true);
    //     onInit();
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   setToasterMessage(
    //     error?.message || "Something Went Wrong While Updating Task Status"
    //   );
    //   setShowToaster(true);
    // }
  };

  const handleShowAllProjects = () => {
    navigate("/project/all");
  };
  function formDateNightTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; 
    }
    console.log(dateString,'-----------------------------------------------')
    let utcTime = new Date(dateString );
    utcTime = new Date(utcTime.setUTCHours(23,59,59,999))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes *  60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    console.log("==========", localTimeString)
    console.log(localTimeString)
    return localTimeString
  }

  const getMyWork = async function () {
    let dataToSend={
      currentDate:formDateNightTime(new Date())
    }
    setLoading(true);
    try {
      const tasks = await getAllMyWorks(dataToSend);
      setLoading(false);
      if (tasks.error) {
        setToasterMessage(
          tasks?.message || "Something Went Wrong While Fetching My Work Data"
        );
        setShowToaster(true);
      } else {
        let allTask = tasks?.data;
        allTask?.map((item) => {
          let dateMonth = item?.dueDate?.split("T")[0];
          let today = new Date();
          today =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1 <= 9
              ? "0" + (today.getMonth() + 1)
              : today.getMonth() + 1) +
            "-" +
            (today.getDate() <= 9 ? "0" + today.getDate() : today.getDate());
          if (dateMonth === today) {
            item.dueToday = true;
          } else if (new Date().getTime() > new Date(item?.dueDate).getTime()) {
            item.dueToday = true;
          } else {
            item.dueToday = false;
          }
        });
        setMyWorkList(allTask);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const getOverDueTaskList = async function () {
    setLoading(true);
    try {
      const tasks = await getOverDueTaskListData();
      setLoading(false);
      if (tasks.error) {
        setToasterMessage(
          tasks?.error?.message ||
            "Something Went Wrong While Fetching Overdue Tasks Data"
        );
        setShowToaster(true);
      } else {
        let allTask = tasks?.data;
        allTask?.map((item) => {
          let dateMonth = item?.dueDate?.split("T")[0];
          let today = new Date();
          today =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1 <= 9
              ? "0" + (today.getMonth() + 1)
              : today.getMonth() + 1) +
            "-" +
            (today.getDate() <= 9 ? "0" + today.getDate() : today.getDate());
          if (dateMonth === today) {
            item.dueToday = true;
          } else if (new Date().getTime() > new Date(item?.dueDate).getTime()) {
            item.dueToday = true;
          } else {
            item.dueToday = false;
          }
        });
        setOverdueWorkList(allTask);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };


  const getAndSetAllUsers = async function () {

    let options = {
      currentPage: 1,
      rowsPerPage: 50,
    };
   
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
        setTeamMembers(projects?.data?.users || []);
        
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };




  const getPendingRating = async function (e) {
    setLoading(true);
    let dataToSend={
      // filterByTeamMember : e
      memberId : e
    }

    try {
      const tasks = await getAllPendingRating(dataToSend);
      setLoading(false);
      if (tasks.error) {
        setToasterMessage(
          tasks?.message ||
            "Something Went Wrong while fetching Pending Ratings Data"
        );
        setShowToaster(true);
      } else {
        let allTask = tasks?.data;
        allTask?.map((item) => {
          let dateMonth = item?.dueDate?.split("T")[0];
          let today = new Date();
          today =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1 <= 9
              ? "0" + (today.getMonth() + 1)
              : today.getMonth() + 1) +
            "-" +
            (today.getDate() <= 9 ? "0" + today.getDate() : today.getDate());
          if (dateMonth === today) {
            item.dueToday = true;
          } else if (new Date().getTime() > new Date(item?.dueDate).getTime()) {
            item.dueToday = true;
          } else {
            item.dueToday = false;
          }
        });
        setPendingRatingList(allTask);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const getAndSetAllProjects = async function () {
    setLoading(true);
    try {
      const projects = await getAllProjects();
      setLoading(false);
      if (projects.error) {
        setToasterMessage(projects?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setProjectListValue(projects.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  const getNewTasks = (data) => {
    closeModal();
    getAndSetAllProjects();
  };

  const closeModal = () => {
    setShowAddTask(false);
    setSelectedProject();
    setSelectedTask();
    onInit();
    if (userDetails?.role !== "CONTRIBUTOR") {
      // getTeamWorkList();
      setIsChange(!isChange);
    }
  };

  const openAddtask = (project) => {
    setSelectedTask();
    setSelectedProject(project);
    setShowAddTask(true);
  };

  const handleStatusChange = (e, taskId, status) => {
    const newStatus = status;

    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    };
    updateTaskStatus(dataToSend);
  };

  const updateTaskStatus = async (dataToSend) => {
    try {
      const res = await updateTaskStatusById(dataToSend);
      if (res.error) {
        setToasterMessage(res?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setToasterMessage(res?.message || "Something Went Wrong");
        setShowToaster(true);

        onInit();
        if (userDetails?.role !== "CONTRIBUTOR") {
          // getTeamWorkList();
          setIsChange(!isChange);
        }
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  // const getTeamWorkList = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await getTeamWork();
  //     setLoading(false);

  //     if (res.error) {
  //       setToasterMessage(res?.message || "Something Went Wrong");
  //       setShowToaster(true);
  //     } else {
  //       setTeamWorkList(res?.data);
  //     }
  //   } catch (error) {
  //     setToasterMessage(error?.message || "Something Went Wrong");
  //     setShowToaster(true);
  //     setLoading(false);
  //     return error.message;
  //   }
  // };

  function formatDate(date) {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Subtract one day from the provided date
    const dayBefore = new Date(date);
    dayBefore.setDate(dayBefore.getDate() );

    // Get the day of the week and day of the month for the updated date
    const dayOfWeek = days[dayBefore.getDay()];
    const dayOfMonth = dayBefore.getDate();

    return (
      <span>
        <p>{dayOfWeek} - <span>{dayOfMonth}</span></p>
       
      </span>
    );
  }

  function daysSince(dateStr) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const currentDate = new Date();
    const date = new Date(dateStr);
    const diffDays = Math?.round(Math?.abs((currentDate - date) / oneDay));
    return diffDays;
  }

  const skipReminder = async (event) => {
    event.preventDefault();
    const dataToSend = {
      profileCompleted: true,
    };

    try {
      setLoading(true);
      const response = await editLogedInUserDetails(dataToSend);
      setLoading(false);

      if (response.error) {
        showToaster(true);
        setToasterMessage("Something Went Wrong While Skipping the Reminder");
        return;
      } else {
        showToaster(true);
        setToasterMessage("Profile Update Skipped Succesfully");
        handleProfileModalClose();
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const closeViewTaskModal = () => {
    setShowViewTask(false);
    setSelectedTaskId(null);
  };

  const handleViewDetails = (taskId) => {
    setSelectedTaskId(taskId);
    setShowViewTask(true);
  };






  return (
    <div className="dashboard_camp  rightDashboard">
      <Container>
        <Row>
          <Col lg={6} className="px-0">
            {props.showBtn && (
              <h1 className="h1-text">
                <i className="fa fa fa-home" aria-hidden="true"></i>My Dashboard
              </h1>
            )}
          </Col>
          <Col lg={6} id="nav-filter" className="px-0">
            <Nav className="justify-content-end" activeKey="/home">
              <Nav.Item>
                <Nav.Link eventKey="link-1" className="px-0">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="secondary"
                      size="lg"
                      onClick={handleShowAllProjects}
                      id="dropdown-basic"
                    >
                      Show All Project
                    </Dropdown.Toggle>
                  </Dropdown>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {userDetails.role !== "GUEST" && projectList?.length !== 0 && (
          <Row className="row-bg " > 

          {projectList
            .slice(0, showAllProjects ? projectList.length : 2)
            .map((project) => (
              <Col lg={6}>
                <Card
                  onClick={() => {
                    handleToRedirectTask(project?._id, project?.isArchived);
                  }}
                  id={`card-${project.id}`}
                  key={project?.id}
                >
                  <Row className="d-flex justify-content-start">
                    <Col lg={6} className="middle">
                      <Avatar name={project.name} size={40} round="20px" />{" "}
                      {/* <h5 className="text-truncate">{project?.name}</h5> */}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{project?.name}</Tooltip>}
                      >
                        <h5 className="text-truncate" style={{cursor:'pointer'}}>{project?.name}</h5>
                      </OverlayTrigger>
                    </Col>
                    <Col lg={4} className="middle">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{project?.description || "--"}</Tooltip>
                        }
                      >
                        <p className="text-truncate">
                          {project?.description || "--"}
                        </p>
                      </OverlayTrigger>
                    </Col>
                    <Col
                      lg={2}
                      className="text-end middle"
                      style={{ justifyContent: "end" }}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        style={{
                          float: "right", padding:'4px 7px', fontSize:'10px'
                        }}
                        onClick={() => {
                          openAddtask(project);
                        }}
                      >
                        Add Task
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}

          <AddTaskModal
            selectedProjectFromTask={selectedProject}
            selectedTask={selectedTask}
            getNewTasks={getNewTasks}
            showAddTask={showAddTask}
            closeModal={closeModal}
            // onInit={() => onInit()}
          />
          <button
            className="expend"
            onClick={() => setShowAllProjects(!showAllProjects)}
          >
            {showAllProjects ? (
              <i className="fas fa-expand"></i>
            ) : (
              <i className="fas fa-expand-alt"></i>
            )}
          </button>
        </Row>
        )
          }

       

        <Row className="mt-3">
          {(userDetails?.role === "SUPER_ADMIN" ||
            userDetails?.role === "ADMIN") && (
            <Col lg={6} style={{ paddingLeft: "0px" }}>
              <Row className="mb-3">
                <Col lg={6} className="left-add pb-1">
                  <span>OVERDUE WORK</span>

                  {/* {<i
                    onClick={() => {
                      setSelectedTask();
                      setShowAddTask(true);
                      setSelectedProject();
                    }}
                    className="fa fa-plus-circle"
                  ></i>} */}
                </Col>
                <Col lg={6} className="right-filter"></Col>
              </Row>
              <Row>
                <Col lg={12} className="mt-3">
                  <Card
                    id="card-task"
                    className={
                      !overdueWorkList?.length ? "alig-nodata" : "px-3"
                    }
                  >
                    {overdueWorkList && overdueWorkList?.length === 0 && (
                      <p className="text-center">No task found.</p>
                    )}
                    {overdueWorkList &&
                      overdueWorkList?.length > 0 &&
                      overdueWorkList?.map((task) => (
                        <Row className="d-flex justify-content-start list_task w-100 mx-0">
                          <Col lg={4} className="middle">
                            {((userDetails.role === "LEAD" &&
                              (userDetails.id === task?.assignedTo?._id ||
                                task?.lead?.includes(userDetails.id) ||
                                userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                  style={{ padding: "0" }}
                                >
                                  {task.status === "NOT_STARTED" && (
                                    <i
                                      className="fa fa-check-circle secondary"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "ONGOING" && (
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "COMPLETED" && (
                                    <i
                                      className="fa fa-check-circle success"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "ONHOLD" && (
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "NOT_STARTED"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle secondary"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Not Started
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "ONGOING"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Ongoing
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "COMPLETED"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle success"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Completed
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "ONHOLD"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    On Hold
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}

                            {/* <h5 className="text-truncate">{task?.title}</h5> */}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>{task?.title}</Tooltip>}
                            >
                              <h5
                                onClick={() => handleViewDetails(task?._id)}
                                className="text-truncate"
                              >
                                {task?.title}
                              </h5>
                            </OverlayTrigger>
                          </Col>
                          <Col lg={2} className="middle">
                            {task?.status !== "COMPLETED" && (
                              <small>
                                <Badge
                                  bg={task?.dueToday ? "danger" : "primary"}
                                >
                                  {daysSince(task?.dueDate?.split("T")[0]) +
                                    " Day ago"}
                                  {/* {moment(task?.dueDate?.split("T")[0]).format(
                                    "DD/MM/YYYY"
                                  )} */}
                                </Badge>
                              </small>
                            )}
                            {task?.status === "COMPLETED" && (
                              <small>
                                <Badge bg="success">
                                  {moment(
                                    task?.completedDate?.split("T")[0]
                                  ).format("DD/MM/YYYY")}
                                </Badge>
                              </small>
                            )}
                          </Col>
                          <Col lg={3} className="middle">
                            <>
                              {["top"].map((placement) => (
                                <OverlayTrigger
                                  key={placement}
                                  placement={placement}
                                  overlay={
                                    <Tooltip id={`tooltip-${placement}`}>
                                      {task?.assignedTo?.name}
                                    </Tooltip>
                                  }
                                >
                                  <Button className="tooltip-button br0">
                                    {task?.assignedTo?.name && (
                                      <span
                                        className="nameTag"
                                        title="Assigned To"
                                      >
                                        <img src={avtar} alt="userAvtar" />{" "}
                                        {task?.assignedTo?.name.split(" ")[0] +
                                          " "}
                                        {task?.assignedTo?.name.split(" ")[1] &&
                                          task?.assignedTo?.name
                                            .split(" ")[1]
                                            ?.charAt(0) + "."}
                                      </span>
                                    )}
                                  </Button>
                                </OverlayTrigger>
                              ))}
                            </>
                          </Col>
                          <Col
                            lg={2}
                            className="text-end middle"
                            style={{ justifyContent: "end" }}
                          >
                            <small>
                              {task?.status === "NOT_STARTED" && (
                                <Badge bg="primary">NOT STARTED</Badge>
                              )}
                              {task?.status === "ONGOING" && (
                                <Badge bg="warning">ONGOING</Badge>
                              )}
                              {task?.status === "COMPLETED" && (
                                <Badge bg="success">COMPLETED</Badge>
                              )}
                              {task?.status === "ONHOLD" && (
                                <Badge bg="secondary">ON HOLD</Badge>
                              )}
                            </small>
                          </Col>
                          <Col
                            lg={1}
                            id="dropdown_action"
                            className="text-end middle"
                          >
                            {((userDetails.role === "LEAD" &&
                              (userDetails.id === task?.assignedTo?._id ||
                                task?.lead?.includes(userDetails.id) ||
                                userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="defult"
                                  id="dropdown-basic"
                                >
                                  <i className="fa fa-ellipsis-v"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setSelectedProject();
                                      setShowAddTask(true);
                                      setSelectedTask(task);
                                    }}
                                  >
                                    <i
                                      className="fa fa-pencil-square"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Edit Task
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
              </Row>
            </Col>
          )}

          {(userDetails?.role === "CONTRIBUTOR" ||
            userDetails?.role === "LEAD") && (
            <Col lg={6} style={{ paddingLeft: "0px" }}>
              <Row>
                <Col lg={6} className="left-add">
                  <span>MY WORK</span>
                  <i
                    onClick={() => {
                      setSelectedTask();
                      setShowAddTask(true);
                      setSelectedProject();
                    }}
                    className="fa fa-plus-circle"
                    style={{ cursor: "pointer" }}
                  ></i>
                </Col>
                <Col lg={6} className="right-filter"></Col>
              </Row>
              <Row>
                <Col lg={12} className="mt-3">
                  <Card
                    id="card-task"
                    className={
                      myWorkList?.length === 0 ? "alig-nodata" : "px-3"
                    }
                  >
                    {myWorkList && myWorkList?.length === 0 && (
                     <Row>
                      <Col lg="12"><p>No task found.</p></Col>
                     </Row>
                    )}
                    {myWorkList &&
                      myWorkList?.length > 0 &&
                      myWorkList?.map((task) => (
                        <Row className="d-flex justify-content-start list_task w-100 mx-0">
                          <Col lg={4} className="middle">
                            {(userDetails.id === task?.assignedTo?._id ||
                              userDetails.role === "CONTRIBUTOR") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                  style={{ padding: "0" }}
                                >
                                  {task.status === "NOT_STARTED" && (
                                    <i
                                      className="fa fa-check-circle secondary"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "ONGOING" && (
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "COMPLETED" && (
                                    <i
                                      className="fa fa-check-circle success"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "ONHOLD" && (
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "NOT_STARTED"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle secondary"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Not Started
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "ONGOING"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Ongoing
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "COMPLETED"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle success"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Completed
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "ONHOLD"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    On Hold
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>{task?.title}</Tooltip>}
                            >
                              <h5
                                onClick={() => handleViewDetails(task?._id)}
                                className="text-truncate"
                              >
                                {task?.title}
                              </h5>
                            </OverlayTrigger>
                          </Col>
                          <Col lg={4} className="middle">
                            {task?.status !== "COMPLETED" && (
                              <small>
                                <Badge
                                  bg={task?.dueToday ? "danger" : "primary"}
                                >
                                  {moment(task?.dueDate?.split("T")[0]).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Badge>
                              </small>
                            )}
                            {task?.status === "COMPLETED" && (
                              <small>
                                <Badge bg="success">
                                  {moment(
                                    task?.completedDate?.split("T")[0]
                                  ).format("DD/MM/YYYY")}
                                </Badge>
                              </small>
                            )}
                          </Col>
                          <Col
                            lg={2}
                            className="text-end middle"
                            style={{ justifyContent: "end" }}
                          >
                            <small>
                              {task?.status === "NOT_STARTED" && (
                                <Badge bg="primary">NOT STARTED</Badge>
                              )}
                              {task?.status === "ONGOING" && (
                                <Badge bg="warning">ONGOING</Badge>
                              )}
                              {task?.status === "COMPLETED" && (
                                <Badge bg="success">COMPLETED</Badge>
                              )}
                              {task?.status === "ONHOLD" && (
                                <Badge bg="secondary">ON HOLD</Badge>
                              )}
                            </small>
                          </Col>
                          <Col
                            lg={1}
                            id="dropdown_action"
                            className="text-end middle"
                          >
                            {((userDetails.role === "LEAD" &&
                              (userDetails.id === task?.assignedTo?._id ||
                                task?.lead?.includes(userDetails.id) ||
                                userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="defult"
                                  id="dropdown-basic"
                                >
                                  <i className="fa fa-ellipsis-v"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setSelectedProject();
                                      setShowAddTask(true);
                                      setSelectedTask(task);
                                    }}
                                  >
                                    <i
                                      className="fa fa-pencil-square"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Edit Task
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
              </Row>
            </Col>
          )}
          { userDetails?.role !== "GUEST" && ( 
          <Col lg={6} style={{ paddingRight: "0px" }}>
            <Row>
              <Col lg={6} className="left-add">
                <span>PENDING RATINGS</span>
              </Col>
              <Col lg={6} className="right-filter">
              {/* select box and lable name team member  */}
              {(userDetails?.role === "SUPER_ADMIN" || userDetails?.role === "ADMIN") && (
                <Form.Group controlId="formBasicEmail" className="team-member-select mb-0">
                  <Form.Label>Team Member</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) => {
                      getPendingRating(event.target.value);
                    }}
                  >
                    <option value="">All</option>
                    {teamMembers &&
                      teamMembers.map((member) => (
                        <option value={member?._id}>{member?.name}</option>
                      ))}
                  </Form.Control>
                </Form.Group>
              )}



              </Col>
            </Row>
            <Row>
              <Col lg={12} className="mt-3">
                <Card
                  id="card-task"
                  className={
                    pendingRatingList?.length === 0 ? "alig-nodata" : "px-3"
                  }
                >
                  {pendingRatingList && pendingRatingList?.length === 0 && (
                    <p>No task found.</p>
                  )}
                  {pendingRatingList &&
                    pendingRatingList?.length > 0 &&
                    pendingRatingList?.map((task) => (
                      <Row className="d-flex justify-content-start list_task w-100 mx-0">
                        <Col lg={5} className="middle">
                          <span
                            style={{ fontSize: "20PX", marginRight: "10px" }}
                            round="20px"
                          >
                            {task?.status === "COMPLETED" && (
                              <i
                                className="fa fa-check-circle"
                                aria-hidden="true"
                              ></i>
                            )}
                          </span>
                          {/* <h5 className="text-truncate">{task?.title}</h5> */}
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{task?.title}</Tooltip>}
                          >
                            <h5
                              onClick={() => handleViewDetails(task?._id)}
                              className="text-truncate"
                            >
                              {task?.title}
                            </h5>
                          </OverlayTrigger>
                        </Col>
                        <Col lg={2} className="middle">
                          {task?.status !== "COMPLETED" && (
                            <small>
                              <Badge bg={task?.dueToday ? "danger" : "primary"}>
                                {moment(task?.dueDate?.split("T")[0])}
                              </Badge>
                            </small>
                          )}
                          {task?.status === "COMPLETED" && (
                            <small>
                              {" "}
                              <Badge bg="success">
                                {moment(
                                  task?.completedDate?.split("T")[0]
                                ).format("DD/MM/YYYY")}
                              </Badge>
                            </small>
                          )}
                        </Col>
                        <Col
                          lg={3}
                          className="text-end middle ps-0"
                          style={{ justifyContent: "end" }}
                        >
                          <small>
                            {task?.status === "NOT_STARTED" && (
                              <Badge bg="primary">NOT STARTED</Badge>
                            )}
                            {task?.status === "ONGOING" && (
                              <Badge bg="warning">ONGOING</Badge>
                            )}
                            {task?.status === "COMPLETED" && (
                              // <Badge bg="success">COMPLETED</Badge>
                              <>
                                <>
                                  {["top"].map((placement) => (
                                    <OverlayTrigger
                                      key={placement}
                                      placement={placement}
                                      overlay={
                                        <Tooltip id={`tooltip-${placement}`}>
                                          {task?.lead[0]?.name}
                                        </Tooltip>
                                      }
                                    >
                                      <Button className="tooltip-button">
                                        {task?.lead[0]?.name && (
                                          <span
                                            className="nameTag"
                                            title="Lead"
                                          >
                                            <img
                                              src={leadAvatar}
                                              alt="userAvtar"
                                            />{" "}
                                            {task?.lead[0]?.name
                                              .split(" ")[0]
                                              ?.charAt(0)}
                                            {task?.lead[0]?.name
                                              .split(" ")[1]
                                              ?.charAt(0)}
                                          </span>
                                        )}
                                      </Button>
                                    </OverlayTrigger>
                                  ))}
                                </>

                                <>
                                  {["top"].map((placement) => (
                                    <OverlayTrigger
                                      key={placement}
                                      placement={placement}
                                      overlay={
                                        <Tooltip id={`tooltip-${placement}`}>
                                          {task?.assignedTo?.name}
                                        </Tooltip>
                                      }
                                    >
                                      <Button className="tooltip-button br0">
                                        {task?.assignedTo?.name && (
                                          <span
                                            className="nameTag"
                                            title="Assigned To"
                                          >
                                            <img src={avtar} alt="userAvtar" />{" "}
                                            {task?.assignedTo?.name
                                              .split(" ")[0]
                                              ?.charAt(0)}
                                            {task?.assignedTo?.name
                                              .split(" ")[1]
                                              ?.charAt(0)}
                                          </span>
                                        )}
                                      </Button>
                                    </OverlayTrigger>
                                  ))}
                                </>
                              </>
                            )}
                            {task?.status === "ONHOLD" && (
                              <Badge bg="secondary">ON HOLD</Badge>
                            )}
                          </small>
                        </Col>
                        <Col
                          lg={2}
                          className="text-end middle px-0"
                          style={{ justifyContent: "end" }}
                        >
                          {userDetails?.role !== "CONTRIBUTOR" && (
                            <AddRating
                              taskFromDashBoard={task}
                              onInit={onInit}
                              setIsChange={setIsChange}
                              isChange={isChange}
                            />
                          )}
                        </Col>
                      </Row>
                    ))}
                </Card>
              </Col>
            </Row>
          </Col>
        )}
        </Row>
      </Container>

      {userDetails?.role !== "CONTRIBUTOR" && (
        <Container>
          <Row className="mt-3">
            {/* <Col lg={6} style={{ paddingLeft: "0px" }}>
              <Row>
                <Col lg={6} className="left-add">
                  <span>TEAM WORK</span>

                  <i
                    onClick={() => {
                      setSelectedTask();
                      setShowAddTask(true);
                      setSelectedProject();
                    }}
                    className="fa fa-plus-circle"
                    style={{ cursor: "pointer" }}
                  ></i>
                </Col>
                <Col lg={6} className="right-filter"></Col>
              </Row>
              <Row>
                <Col lg={12} className="mt-3">
                  <Card
                    id="card-task"
                    className={
                      teamWorkList?.length === 0 ? "alig-nodata" : "px-3"
                    }
                  >
                    {teamWorkList && teamWorkList?.length === 0 && (
                      <p>No task found.</p>
                    )}
                    {teamWorkList &&
                      teamWorkList?.length > 0 &&
                      teamWorkList?.map((task) => (
                        <Row className="d-flex justify-content-start list_task w-100 mx-0">
                          <Col lg={4} className="middle">
                            {(
                              (userDetails.role === "LEAD" &&
                                (userDetails.id === task?.assignedTo?._id ||
                                  task?.lead?.includes(userDetails.id) ||
                                  userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                  style={{ padding: "0" }}
                                >
                                  {task.status === "NOT_STARTED" && (
                                    <i
                                      className="fa fa-check-circle secondary"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "ONGOING" && (
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "COMPLETED" && (
                                    <i
                                      className="fa fa-check-circle success"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                  {task.status === "ONHOLD" && (
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "NOT_STARTED"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle secondary"
                                      aria-hidden="true"
                                    ></i>
                                    Not Started
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "ONGOING"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                    Ongoing
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "COMPLETED"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle success"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Completed
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) =>
                                      handleStatusChange(
                                        event,
                                        task?._id,
                                        "ONHOLD"
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    On Hold
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}

                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>{task?.title}</Tooltip>}
                            >
                              <h5
                                onClick={() => handleViewDetails(task?._id)}
                                className="text-truncate"
                              >
                                {task?.title}
                              </h5>
                            </OverlayTrigger>
                          </Col>
                          <Col lg={2} className="middle">
                            {task?.status !== "COMPLETED" && (
                              <small>
                                <Badge
                                  bg={task?.dueToday ? "danger" : "primary"}
                                >
                                  {moment(task?.dueDate?.split("T")[0]).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Badge>
                              </small>
                            )}
                            {task?.status === "COMPLETED" && (
                              <small>
                                <Badge bg="success">
                                  {moment(
                                    task?.completedDate?.split("T")[0]
                                  ).format("DD/MM/YYYY")}
                                </Badge>
                              </small>
                            )}
                          </Col>
                          <Col lg={3} className="middle">
                            <>
                              {["top"].map((placement) => (
                                <OverlayTrigger
                                  key={placement}
                                  placement={placement}
                                  overlay={
                                    <Tooltip id={`tooltip-${placement}`}>
                                      {task?.assignedTo?.name}
                                    </Tooltip>
                                  }
                                >
                                  <Button className="tooltip-button br0">
                                    {task?.assignedTo?.name && (
                                      <small
                                        className="nameTag text-truncate"
                                        title="Assigned To"
                                      >
                                        <img src={avtar} alt="userAvtar" />{" "}
                                        {task?.assignedTo?.name.split(" ")[0] +
                                          " "}
                                        {task?.assignedTo?.name.split(" ")[1] &&
                                          task?.assignedTo?.name
                                            .split(" ")[1]
                                            ?.charAt(0) + "."}
                                      </small>
                                    )}
                                  </Button>
                                </OverlayTrigger>
                              ))}
                            </>
                          </Col>
                          <Col
                            lg={2}
                            className="text-end middle"
                            style={{ justifyContent: "end" }}
                          >
                            <small>
                              {task?.status === "NOT_STARTED" && (
                                <Badge bg="primary">NOT STARTED</Badge>
                              )}
                              {task?.status === "ONGOING" && (
                                <Badge bg="warning">ONGOING</Badge>
                              )}
                              {task?.status === "COMPLETED" && (
                                <Badge bg="success">COMPLETED</Badge>
                              )}
                              {task?.status === "ONHOLD" && (
                                <Badge bg="secondary">ON HOLD</Badge>
                              )}
                            </small>
                          </Col>
                          <Col
                            lg={1}
                            id="dropdown_action"
                            className="text-end "
                            style={{ position: "absolute", right: "0px" }}
                          >
                            {(
                              (userDetails.role === "LEAD" &&
                                (userDetails.id === task?.assignedTo?._id ||
                                  task?.lead?.includes(userDetails.id) ||
                                  userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="defult"
                                  id="dropdown-basic"
                                  style={{ padding: "0px", textAlign: "end" }}
                                >
                                  <i className="fa fa-ellipsis-v"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setSelectedProject();
                                      setShowAddTask(true);
                                      setSelectedTask(task);
                                    }}
                                  >
                                    Edit
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
              </Row>
            </Col> */}
            <Col lg={12} style={{ paddingLeft: "0px" }}>
              <Row>
                <Col lg={6} className="left-add">
                  <span>Team Work</span>
                  {userDetails?.role !== "GUEST" && (
                  <i
                    onClick={() => {
                      setSelectedTask();
                      setShowAddTask(true);
                      setSelectedProject();
                    }}
                    className="fa fa-plus-circle"
                    style={{ cursor: "pointer" }}
                  ></i>
      )}
                </Col>
                <Col lg={6} className="right-filter"></Col>
              </Row>
              <Row>
                <Col lg={12} className="mt-3">
                  <Card id="card-task" style={{ overflowX: "hidden", paddingTop:'0px', height:'auto'  }}>
                    {/* <Row id="agenda">
                      <Col lg={4}>
                        <Button variant="light" size="sm" className="left-btn">
                          <BsChevronDoubleLeft /> Week
                        </Button>
                        <Button variant="light" size="sm" className="right-btn">
                          <BsChevronLeft /> Day
                        </Button>
                      </Col>
                      <Col lg={4}>
                        <h4 className="text-center">April</h4>
                      </Col>
                      <Col lg={4} className="text-end">
                        <Button variant="light" size="sm" className="left-btn">
                          Day <BsChevronRight />
                        </Button>
                        <Button variant="light" size="sm" className="right-btn">
                          Week <BsChevronDoubleRight />
                        </Button>
                      </Col>
                    </Row> */}
                    <CustomCalendar
                      setTeamWorkList={setTeamWorkList}
                      isChange={isChange}
                    />
                    <div className="mt-3" style={{ height:'90vh', overflowY:'auto', overflowX:'hidden' }}>
                    <div id="list_ui" className="mt-2">
                     
                        <Row
                          className={
                            teamWorkList?.length === 0 ? "alig-nodata" : "px-0"
                          }
                        >
                          {teamWorkList && teamWorkList?.length === 0 && (
                            <p>No task found.</p>
                          )}
                          {teamWorkList &&
                            teamWorkList?.length > 0 &&
                            teamWorkList?.map((task, taskIndex) => (
                              <>
                                {(taskIndex === 0 ||
                                  task.dueDate !==
                                  teamWorkList[taskIndex - 1].dueDate) ? (
                                    <Col lg={1} className="border-top day v-align completed_task">
                                    {formatDate(task.dueDate)}
                                  </Col>
                                ) :
                                <Col lg={1} className="v-align " >
                                 
                              </Col>
                                }
                                <Col lg={11} className="border-start border-bottom d-flex justify-content-start px-0">
                                <Row className="d-flex justify-content-start list_task w-100 mx-0 mb-0 px-2">
                                  <Col lg={4} className="middle">
                                    {((userDetails.role === "LEAD" &&
                                      (userDetails.id ===
                                        task?.assignedTo?._id ||
                                        task?.lead?.includes(userDetails.id) ||
                                        userDetails.id ===
                                          task?.createdBy?._id)) ||
                                      userDetails.role === "SUPER_ADMIN" ||
                                      userDetails.role === "ADMIN") && (
                                      <Dropdown>
                                        <Dropdown.Toggle
                                          variant="success"
                                          id="dropdown-basic"
                                          style={{ padding: "0" }}
                                        >
                                          {task.status === "NOT_STARTED" && (
                                            <i
                                              className="fa fa-check-circle secondary"
                                              aria-hidden="true"
                                            ></i>
                                          )}
                                          {task.status === "ONGOING" && (
                                            <i
                                              className="fa fa-check-circle warning"
                                              aria-hidden="true"
                                            ></i>
                                          )}
                                          {task.status === "COMPLETED" && (
                                            <i
                                              className="fa fa-check-circle success"
                                              aria-hidden="true"
                                            ></i>
                                          )}
                                          {task.status === "ONHOLD" && (
                                            <i
                                              className="fa fa-check-circle warning"
                                              aria-hidden="true"
                                            ></i>
                                          )}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={(event) =>
                                              handleStatusChange(
                                                event,
                                                task?._id,
                                                "NOT_STARTED"
                                              )
                                            }
                                          >
                                            <i
                                              className="fa fa-check-circle secondary"
                                              aria-hidden="true"
                                            ></i>
                                            Not Started
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={(event) =>
                                              handleStatusChange(
                                                event,
                                                task?._id,
                                                "ONGOING"
                                              )
                                            }
                                          >
                                            <i
                                              className="fa fa-check-circle warning"
                                              aria-hidden="true"
                                            ></i>
                                            Ongoing
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={(event) =>
                                              handleStatusChange(
                                                event,
                                                task?._id,
                                                "COMPLETED"
                                              )
                                            }
                                          >
                                            <i
                                              className="fa fa-check-circle success"
                                              aria-hidden="true"
                                            ></i>{" "}
                                            Completed
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={(event) =>
                                              handleStatusChange(
                                                event,
                                                task?._id,
                                                "ONHOLD"
                                              )
                                            }
                                          >
                                            <i
                                              className="fa fa-check-circle warning"
                                              aria-hidden="true"
                                            ></i>{" "}
                                            On Hold
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    )}

                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>{task?.title}</Tooltip>}
                                    >
                                      <h5
                                        onClick={() =>
                                          handleViewDetails(task?._id)
                                        }
                                        className="text-truncate"
                                      >
                                        {task?.title}
                                      </h5>
                                    </OverlayTrigger>
                                  </Col>
                                  <Col lg={2} className="middle">
                                    {task?.status !== "COMPLETED" && (
                                      <small>
                                        <Badge
                                          bg={
                                            task?.dueToday
                                              ? "danger"
                                              : "primary"
                                          }
                                        >
                                          {moment(
                                            task?.dueDate?.split("T")[0]
                                          ).format("DD/MM/YYYY")}
                                        </Badge>
                                      </small>
                                    )}
                                    {task?.status === "COMPLETED" && (
                                      <small>
                                        <Badge bg="success">
                                          {moment(
                                            task?.completedDate?.split("T")[0]
                                          ).format("DD/MM/YYYY")}
                                        </Badge>
                                      </small>
                                    )}
                                  </Col>
                                  <Col lg={3} className="middle">
                                    <>
                                      {["top"].map((placement) => (
                                        <OverlayTrigger
                                          key={placement}
                                          placement={placement}
                                          overlay={
                                            <Tooltip
                                              id={`tooltip-${placement}`}
                                            >
                                              {task?.assignedTo?.name}
                                            </Tooltip>
                                          }
                                        >
                                          <Button className="tooltip-button br0">
                                            {task?.assignedTo?.name && (
                                              <small
                                                className="nameTag text-truncate pt-2"
                                                title="Assigned To"
                                              >
                                                <img
                                                  src={avtar}
                                                  alt="userAvtar"
                                                />{" "}
                                                {task?.assignedTo?.name.split(
                                                  " "
                                                )[0] + " "}
                                                {task?.assignedTo?.name.split(
                                                  " "
                                                )[1] &&
                                                  task?.assignedTo?.name
                                                    .split(" ")[1]
                                                    ?.charAt(0) + "."}
                                              </small>
                                            )}
                                          </Button>
                                        </OverlayTrigger>
                                      ))}
                                    </>
                                  </Col>
                                  <Col
                                    lg={2}
                                    className="text-end middle"
                                    style={{ justifyContent: "end" }}
                                  >
                                    <small>
                                      {task?.status === "NOT_STARTED" && (
                                        <Badge bg="primary">NOT STARTED</Badge>
                                      )}
                                      {task?.status === "ONGOING" && (
                                        <Badge bg="warning">ONGOING</Badge>
                                      )}
                                      {task?.status === "COMPLETED" && (
                                        <Badge bg="success">COMPLETED</Badge>
                                      )}
                                      {task?.status === "ONHOLD" && (
                                        <Badge bg="secondary">ON HOLD</Badge>
                                      )}
                                    </small>
                                  </Col>
                                  <Col
                                    lg={1}
                                    id="dropdown_action"
                                    className="text-end "
                                    style={{
                                      position: "absolute",
                                      right: "20px",
                                    }}
                                  >
                                    {((userDetails.role === "LEAD" &&
                                      (userDetails.id ===
                                        task?.assignedTo?._id ||
                                        task?.lead?.includes(userDetails.id) ||
                                        userDetails.id ===
                                          task?.createdBy?._id)) ||
                                      userDetails.role === "SUPER_ADMIN" ||
                                      userDetails.role === "ADMIN") && (
                                      <Dropdown>
                                        <Dropdown.Toggle
                                          variant="defult"
                                          id="dropdown-basic"
                                          style={{
                                            padding: "0px",
                                            textAlign: "end",
                                          }}
                                        >
                                          <i className="fa fa-ellipsis-v"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              setSelectedProject();
                                              setShowAddTask(true);
                                              setSelectedTask(task);
                                            }}
                                          >
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={() =>
                                              handleTaskReopen(task?._id)
                                            }
                                          >
                                            Reopen task
                                          </Dropdown.Item>
                                          <Dropdown.Item>
                                            Add Subtask
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    )}
                                  </Col>
                                </Row>
                                </Col>
                              </>
                            ))}
                        </Row>
                    
                    </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      )}

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRatingModal />
        </Modal.Body>
      </Modal>

      <ViewTaskModal
        showViewTask={showViewTask}
        closeViewTaskModal={closeViewTaskModal}
        selectedTaskId={selectedTaskId}
        onInit={onInit}
        setIsChange={setIsChange}
        isChange={isChange}
      />

      {/* <Modal
        className="profile-modal"
        show={showModalOnLogin}
        onHide={() => {
          handleProfileModalClose();
        }}
        animation={false}
      >
        <Modal.Header>
          <Modal.Title>Profile Details</Modal.Title>
          <button onClick={skipReminder} className="skip-button">
            SKIP
          </button>
        </Modal.Header>
        <Modal.Body
          style={{ height: "78vh", overflowY: "scroll", overflowX: "hidden" }}
        >
          <UserForm handleModalClose={handleProfileModalClose} />
        </Modal.Body>
      </Modal> */}

      <Offcanvas  
        className="Offcanvas-modal profile-modal"
        style={{width:'600px'}}
        
        placement="end"
        show={showModalOnLogin}
        onHide={() => {
          handleProfileModalClose();
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> Profile Details</Offcanvas.Title>
          <button onClick={skipReminder} className="skip-button">
            SKIP
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ height: "78vh", overflowY: "scroll", overflowX: "hidden" }} >


        <UserForm handleModalClose={handleProfileModalClose} />
        


      

        </Offcanvas.Body>
      </Offcanvas>

      {loading ? <Loader /> : null}
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
    </div>
  );
}
