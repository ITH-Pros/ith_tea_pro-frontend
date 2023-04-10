/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import moment from "moment";
import { AiFillProject } from "react-icons/ai";
import { useState, useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "./dashboard.css";
import Col from "react-bootstrap/Col";
import Loader from "../../components/Loader";
import { editLogedInUserDetails } from "../../services/user/api";
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
} from "react-bootstrap";

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
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showModalOnLogin, setShowModalOnLogin] = useState(true);
  const [teamWorkList, setTeamWorkList] = useState([]);
  const [showViewTask, setShowViewTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const { userDetails } = useAuth();
  const setShowToaster = (param) => showToaster(param);
  const navigate = useNavigate();

  useEffect(() => {
    setShowModalOnLogin(
      localStorage.getItem("profileCompleted") === "false" ? true : false
    );
    onInit();
  }, []);

  function onInit() {
    console.log("jai shree ram")
    getAndSetAllProjects();
    if (userDetails?.role === "SUPER_ADMIN" || userDetails?.role === "ADMIN") {
      getOverDueTaskList();
    }
    if (userDetails?.role !== "SUPER_ADMIN" || userDetails?.role !== "ADMIN") {
      getMyWork();
    }
    if (userDetails?.role !== "CONTRIBUTOR") {
      getTeamWorkList();
    }
    getPendingRating();
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

  const handleShowAllProjects = () => {
    navigate("/project/all");
  };

  const getMyWork = async function () {
    setLoading(true);
    try {
      const tasks = await getAllMyWorks();
      setLoading(false);
      if (tasks.error) {
        setToasterMessage(
          tasks?.error?.message ||
            "Something Went Wrong While Fetching My Work Data"
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

  const getPendingRating = async function () {
    setLoading(true);
    try {
      const tasks = await getAllPendingRating();
      setLoading(false);
      if (tasks.error) {
        setToasterMessage(
          tasks?.error?.message ||
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
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
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
        // getMyWork();
        // getTeamWork();
        // getOverDueTaskList();
        // getPendingRating();
        onInit();
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const getTeamWorkList = async () => {
    setLoading(true);
    try {
      const res = await getTeamWork();
      setLoading(false);

      if (res.error) {
        setToasterMessage(res?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setTeamWorkList(res?.data);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

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
                <Nav.Link eventKey="link-1">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="secondary"
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

        <Row className="row-bg">
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
                      <h5 className="text-truncate">{project?.name}</h5>
                    </Col>
                    <Col lg={4} className="middle">
                      <p className="text-truncate">
                        {project?.description || "--"}
                      </p>
                    </Col>
                    <Col
                      lg={2}
                      className="text-end middle"
                      style={{ justifyContent: "end" }}
                    >
                      <button
                        className="addTaskBtn"
                        style={{
                          float: "right",
                        }}
                        onClick={() => {
                          openAddtask(project);
                        }}
                      >
                        Add Task
                      </button>
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
            // handleOnInit={onInit}
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

        <Row className="mt-3">
          {(userDetails?.role === "SUPER_ADMIN" ||
            userDetails?.role === "ADMIN") && (
            <Col lg={6} style={{ paddingLeft: "0px" }}>
              <Row>
                <Col lg={6} className="left-add">
                  <span>OVERDUE WORK</span>

                  <i
                    onClick={() => {
                      setSelectedTask();
                      setShowAddTask(true);
                      setSelectedProject();
                    }}
                    className="fa fa-plus-circle"
                  ></i>
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
                            {(userDetails.id === task?.assignedTo?._id ||
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
                                Completed:{" "}
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
                            {(userDetails.id === task?.assignedTo?._id ||
                              (userDetails.role === "LEAD" &&
                                (userDetails.id === task?.assignedTo?._id ||
                                  task?.lead?.includes(userDetails.id) ||
                                  userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && <Dropdown>
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
                              </Dropdown>}
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
                      <p>No task found.</p>
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
                                Due Date:{" "}
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
                                Completed:{" "}
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
                            {(userDetails.id === task?.assignedTo?._id ||
                        (userDetails.role === "LEAD" &&
                          (userDetails.id === task?.assignedTo?._id ||
                            task?.lead?.includes(userDetails.id) ||
                            userDetails.id === task?.createdBy?._id)) ||
                        userDetails.role === "SUPER_ADMIN" ||
                        userDetails.role === "ADMIN") &&<Dropdown>
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
                              </Dropdown>}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
              </Row>
            </Col>
          )}
          <Col lg={6} style={{ paddingRight: "0px" }}>
            <Row>
              <Col lg={6} className="left-add">
                <span>PENDING RATINGS</span>
              </Col>
              <Col lg={6} className="right-filter"></Col>
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
                              Due Date:{" "}
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
                                          <span className="nameTag">
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
                                          <span className="nameTag">
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
                            <Button
                              variant="light"
                              size="sm"
                              className="addRatingBtn"
                            >
                              <AddRating taskFromDashBoard={task} />{" "}
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {userDetails?.role !== "CONTRIBUTOR" && (
        <Container>
          <Row className="mt-3">
            <Col lg={6} style={{ paddingLeft: "0px" }}>
              <Row>
                <Col lg={6} className="left-add">
                  <span>TEAM WORK</span>

                  {/* <i
                    onClick={() => {
                      setSelectedTask();
                      setShowAddTask(true);
                      setSelectedProject();
                    }}
                    className="fa fa-plus-circle"
                  ></i> */}
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
                          <Col lg={5} className="middle">
                            {(userDetails.id === task?.assignedTo?._id ||
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
                            <h5
                              onClick={() => handleViewDetails(task?._id)}
                              className="text-truncate"
                            >
                              {task?.title}
                            </h5>
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
                                Completed:{" "}
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
                            {(userDetails.id === task?.assignedTo?._id ||
                        (userDetails.role === "LEAD" &&
                          (userDetails.id === task?.assignedTo?._id ||
                            task?.lead?.includes(userDetails.id) ||
                            userDetails.id === task?.createdBy?._id)) ||
                        userDetails.role === "SUPER_ADMIN" ||
                        userDetails.role === "ADMIN") &&
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
                                  Edit
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>}
                          </Col>
                        </Row>
                      ))}
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
      />

      <Modal
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
      </Modal>

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
