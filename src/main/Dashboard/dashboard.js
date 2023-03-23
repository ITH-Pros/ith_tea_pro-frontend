import React from "react";
import moment from "moment";
import { AiFillProject } from "react-icons/ai";
import MyCalendar from "./weekCalendra";
import { useState, useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
  getAllMyWorks,
  getAllPendingRating,
  getAllProjects,
  getRatings,
  updateTaskStatusById,
} from "../../services/user/api";
import "./dashboard.css";
import Col from "react-bootstrap/Col";
import Loader from "../../components/Loader";
import { getAllUsers } from "../../services/user/api";
import Toaster from "../../components/Toaster";
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
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../Tasks/AddTaskModal";
import AddRatingModal from "../Rating/add-rating-modal";
import UserForm from "../edit-profile";
import { useAuth } from "../../auth/AuthProvider";
import AddRating from "../Rating/add-rating";
import Tooltip from "react-bootstrap/Tooltip";
var month = moment().month();
let currentYear = moment().year();

export default function Dashboard(props) {
  const [usersArray, setTeamOptions] = useState([]);
  const [ratingsArray, setRatings] = useState([]);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectListValue] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [myWorkList, setMyWorkList] = useState();
  const [selectedTask, setSelectedTask] = useState({});
  const [pendingRatingList, setPendingRatingList] = useState();
  const [selectedRating, setSelectedRating] = useState({});
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showModalOnLogin, setShowModalOnLogin] = useState(true);
  const { userDetails } = useAuth();

  //   const { profileModalShow, setProfileModalShow } = useAuth();
  //   console.log("----",showModalOnLogin, showModalOnLogin && profileModalShow, profileModalShow);

  const setShowToaster = (param) => showToaster(param);
  const navigate = useNavigate();

  const handleProfileModalClose = () => {
    // setShowModalOnLogin(localStorage.setItem('profileCompleted',true));
    setShowModalOnLogin(false);
    localStorage.removeItem("profileCompleted");
  };

 const  handlePendingRatingList = () => {
	getPendingRating();
	  };

  useEffect(() => {
    setShowModalOnLogin(
      localStorage.getItem("profileCompleted") == "false" ? true : false
    );
    onInit();
  }, []);

  function onInit() {
    getAndSetAllProjects();
    getMyWork();
    getPendingRating();
    getUsersList();
  }

  const handleToRedirectTask = () => {
    navigate("/task");
  };

  const handleShowAllProjects = () => {
    navigate("/project/all");
  };

  const openModal = (project) => {
    console.log(project, "project");
    setSelectedRating(project);
    setModalShow(true);
  };

  let months = moment().year(Number)?._locale?._months;
  let years = [2022, 2023, 2024, 2025];

  const getUsersList = async function () {
    setLoading(true);
    try {
      const user = await getAllUsers();
      setLoading(false);

      if (user.error) {
        setToasterMessage(user?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setTeamOptions([...user.data?.users]);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  const getMyWork = async function () {
    //setloading(true);
    try {
      const tasks = await getAllMyWorks();
      //setloading(false);
      if (tasks.error) {
        // setToasterMessage(projects?.error?.message || "Something Went Wrong");
        // setShowToaster(true);
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
          if (dateMonth == today) {
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
      return error.message;
    }
  };

  const getPendingRating = async function () {
    //setloading(true);
    try {
      const tasks = await getAllPendingRating();
      //setloading(false);
      if (tasks.error) {
        // setToasterMessage(projects?.error?.message || "Something Went Wrong");
        // setShowToaster(true);
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
          if (dateMonth == today) {
            item.dueToday = true;
          } else if (new Date().getTime() > new Date(item?.dueDate).getTime()) {
            item.dueToday = true;
          } else {
            item.dueToday = false;
          }
        });
        setPendingRatingList(allTask);
        //    console.log('pendingRatingList',pendingRatingList)
      }
    } catch (error) {
      //   setToasterMessage(error?.error?.message || "Something Went Wrong");
      //   setShowToaster(true);
      //setloading(false);
      return error.message;
    }
  };

  const getAndSetAllProjects = async function () {
    //setloading(true);
    try {
      const projects = await getAllProjects();
      //setloading(false);
      if (projects.error) {
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setProjectListValue(projects.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      //setloading(false);
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
  };
  const openAddtask = (project) => {
    setSelectedTask();
    setSelectedProject(project);
    setShowAddTask(true);
  };
  const [showStatusSelect, setShowStatusSelect] = useState(false);

  const handleTaskItemClick = () => {
    setShowStatusSelect(!showStatusSelect);
  };

  const handleStatusChange = (e, taskId, status) => {
	const newStatus = status;

    console.log("newStatus", newStatus);
    // make API call to update task status with newStatus
    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    };
    console.log("dataToSend", dataToSend);

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
        // getTasksDataUsingProjectId();
        getMyWork();
		handlePendingRatingList();
        // if (params?.projectId) {
        //   setSelectedProjectId(params?.projectId);
        // }
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  return (
    <div className="dashboard_camp rightDashboard">
      <div className="my-3 d-flex justify-content-center flex-column">
        {/* {<MyCalendar />} */}
      </div>
      <Container>
        <Row>
          <Col lg={6} className="px-0">
            {" "}
            {props.showBtn && (
              <h1 className="h1-text">
                <AiFillProject className="project-icon" /> My Projects
                {/* <i className="fa fa-home" aria-hidden="true"></i> My Projects */}
              </h1>
            )}
          </Col>
          <Col lg={6} id="nav-filter" className="px-0">
            <Nav className="justify-content-end" activeKey="/home">
              <Nav.Item></Nav.Item>
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
              <Nav.Item></Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Row className="row-bg">
          {projectList
            .slice(0, showAllProjects ? projectList.length : 2)
            .map((project) => (
              <Col lg={6}>
                <Card
                  onClick={handleToRedirectTask}
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
          <Col lg={6} style={{ paddingLeft: "0px" }}>
            <Row>
              <Col lg={6} className="left-add">
                <span>My Work</span>

                <i
                  onClick={() => {
                    console.log("Clicking");
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
                <Card id="card-task" className="px-3">
                  {myWorkList &&
                    myWorkList?.map((task) => (
                      <Row className="d-flex justify-content-start list_task w-100 mx-0">
                        <Col
                          onClick={handleTaskItemClick}
                          lg={4}
                          className="middle"
                        >
                          {/* {(userDetails.id === task?.assignedTo ||
                            userDetails.role == "SUPER_ADMIN" ||
                            userDetails.role == "ADMIN") && (
                            <select
                              className="form-select"
                              defaultValue={task.status}
                              onChange={(event) =>
                                handleStatusChange(event, task?._id)
                              }
                            >
                              <option value="ONGOING">Ongoing</option>
                              <option value="NOT_STARTED">NOT STARTED</option>
                              <option value="ONHOLD">On Hold</option>
                              <option value="COMPLETED">Completed</option>
                            </select>
                          )} */}
						  {(userDetails.id === task?.assignedTo?._id ||
                        userDetails.role == "SUPER_ADMIN" ||
                        userDetails.role == "ADMIN") && (
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
                                handleStatusChange(event, task?._id, "ONGOING")
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
                                handleStatusChange(event, task?._id, "ONHOLD")
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

                          {/* <span
                            style={{ fontSize: "20PX", marginRight: "10px" }}
                            round="20px"
                          >
                            {task?.status === "ONGOING" && (
                              <i
                                className="fa fa-check-circle warning"
                                aria-hidden="true"
                              ></i>
                            )}
                            {task?.status === "NOT_STARTED" && (
                              <i
                                className="fa fa-check-circle secondary"
                                aria-hidden="true"
                              ></i>
                            )}
                            {task?.status === "ONHOLD" && (
                              <i
                                className="fa fa-check-circle primary"
                                aria-hidden="true"
                              ></i>
                            )}
                          </span> */}
                          <h5 className="text-truncate">{task?.title}</h5>
                        </Col>
                        <Col lg={4} className="middle">
                          {task?.status != "COMPLETED" && (
                            <small>
                              Due Date:{" "}
                              <Badge bg={task?.dueToday ? "danger" : "primary"}>
                                {moment(task?.dueDate?.split("T")[0]).format("DD/MM/YYYY")}
                              </Badge>
                            </small>
                          )}
                          {task?.status == "COMPLETED" && (
                            <small>
                              Completed:{" "}
                              <Badge bg="success">
                                {moment(task?.completedDate?.split("T")[0]).format(
                                  "DD/MM/YYYY"
                                )}
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
                            {task?.status == "NOT_STARTED" && (
                              <Badge bg="primary">NOT STARTED</Badge>
                            )}
                            {task?.status == "ONGOING" && (
                              <Badge bg="warning">ONGOING</Badge>
                            )}
                            {task?.status == "COMPLETED" && (
                              <Badge bg="success">COMPLLETED</Badge>
                            )}
                            {task?.status == "ONHOLD" && (
                              <Badge bg="secondary">ON HOLD</Badge>
                            )}
                          </small>
                        </Col>
                        <Col
                          lg={1}
                          id="dropdown_action"
                          className="text-end middle"
                        >
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
                          </Dropdown>
                        </Col>
                      </Row>
                    ))}
                </Card>
              </Col>
            </Row>
          </Col>
          <Col lg={6} style={{ paddingRight: "0px" }}>
            <Row>
              <Col lg={6} className="left-add">
                <span>Pending Ratings</span>
              </Col>
              <Col lg={6} className="right-filter"></Col>
            </Row>
            <Row>
              <Col lg={12} className="mt-3">
                <Card id="card-task" className="px-3">
                  {pendingRatingList &&
                    pendingRatingList?.map((task) => (
                      <Row className="d-flex justify-content-start list_task w-100 mx-0">
                        <Col lg={4} className="middle">
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
                          <h5 className="text-truncate">{task?.title}</h5>
                        </Col>
                        <Col lg={4} className="middle">
                          {task?.status != "COMPLETED" && (
                            <small>
                              Due Date:{" "}
                              <Badge bg={task?.dueToday ? "danger" : "primary"}>
                                {moment(task?.dueDate?.split("T")[0]).format("DD/MM/YYYY")}
                              </Badge>
                            </small>
                          )}
                          {task?.status == "COMPLETED" && (
                            <small>
                              Completed:{" "}
                              <Badge bg="success">
                                {moment(task?.completedDate?.split("T")[0]).format(
                                  "DD/MM/YYYY"
                                )}
                              </Badge>
                            </small>
                          )}
                        </Col>
                        <Col
                          lg={2}
                          className="text-end middle ps-0"
                          style={{ justifyContent: "end" }}
                        >
                          <small>
                            {task?.status == "NOT_STARTED" && (
                              <Badge bg="primary">NOT STARTED</Badge>
                            )}
                            {task?.status == "ONGOING" && (
                              <Badge bg="warning">ONGOING</Badge>
                            )}
                            {task?.status == "COMPLETED" && (
                              <Badge bg="success">COMPLLETED</Badge>
                            )}
                            {task?.status == "ONHOLD" && (
                              <Badge bg="secondary">ON HOLD</Badge>
                            )}
                          </small>
                        </Col>
                        <Col
                          lg={2}
                          className="text-end middle px-0"
                          style={{ justifyContent: "end" }}
                        >
						{userDetails?.role !=="CONTRIBUTOR" && (
							<Button  variant="light"
                            size="sm" className="addRatingBtn"><AddRating
							taskFromDashBoard={task}
							 /> </Button>
						)}
						

                             

                          {/* <Button
                            onClick={() => openModal(task)}
                            variant="light"
                            size="sm"
                            className="addRatingBtn"
                          >
                            Add Rating
                          </Button> */}
                        </Col>
                      </Row>
                    ))}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
	  


      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRatingModal selectedRating={selectedRating} />
        </Modal.Body>
        {/* <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button> */}
      </Modal>

      <Modal
        className="profile-modal"
        show={showModalOnLogin}
        onHide={() => {
          handleProfileModalClose();
        }}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <UserForm
		handleModalClose = {handleProfileModalClose}
		   />
        </Modal.Body>
        <Button
          className="skip-button"
          variant="secondary"
          onClick={() => handleProfileModalClose()}
        >
          Skip
        </Button>
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
