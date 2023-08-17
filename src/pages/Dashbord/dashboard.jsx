/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "./dashboard.css";
import Col from "react-bootstrap/Col";
import Loader from "@components/Shared/Loader";
import avtar from "@assets/img/avtar.png";
import {
  editLogedInUserDetails,
  getAllUsers,
  reopenTaskById,
  verifyTaskById,
  getAllMyWorks,
  getAllPendingRating,
  getAllProjects,
  updateTaskStatusById,
  getOverDueTaskListData,
} from "@services/user/api";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "@components/AddTaskModal";
import AddRatingModal from "@components/add-rating-modal";
import UserForm from "../edit-profile";
// import { useAuth } from '../../auth/AuthProvider'
import ViewTaskModal from "@components/view-task";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Row,
  Container,
  Nav,
  Dropdown,
  Card,
  Button,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import CustomCalendar from "@components/CustomCalender/custom-calender";
import ProjectGrid from "@components/FreeResource/projectGrid";
import { toast } from "react-toastify";
import TaskVerificationComponent from "@components/TaskVerificationComponent/TaskVerificationComponent";
import OverdueWorkComponent from "@components/OverdueWorkComponent/OverdueWorkComponent";
import MyWorkComponent from "@components/MyWorkComponent/MyWorkComponent";
import { useAuth } from "../../utlis/AuthProvider";

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
});

export default function Dashboard(props) {
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
  // need to change
  const { userDetails } = useAuth();

  const [isChange, setIsChange] = useState(undefined);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [verifyTaskId, setVerifyTaskId] = useState("");
  const [isReOpen, setIsReOpen] = useState(false);
  const [showUserGrid, setShowUserGrid] = useState(false);
  const [verifyTeamMember, setVerifyTeamMember] = useState("");
  const verifyTaskNotAllowedRoles = ["CONTRIBUTOR", "GUEST"];

  const setToasterMessageToDashboard = (message) => {
    toast.dismiss();
    toast.info(message);
    // set
  };

  const openVerifyModal = (taskId) => {
    setVerifyTaskId(taskId);
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      formik.resetForm(); // Reset form values when the modal is opened
    }
  }, [showModal]);

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const dataToSend = {
          taskId: verifyTaskId,
          status: 'VERIFIED',
          verificationsComments: values.comment,
        };
        setLoading(true); // You need to define setLoading
        const tasks = await verifyTaskById(dataToSend); // You need to define verifyTaskById
        setLoading(false);

        if (tasks.error) {
          toast.info(tasks?.message || 'Something Went Wrong While Updating Task Status');
        } else {
          toast.info('Task Verified Successfully');
          onInit();
          setShowModal(false);
        }
      } catch (error) {
        setLoading(false);
        toast.info(error?.message || 'Something Went Wrong While Updating Task Status');
      }
    },
  });

  useEffect(() => {
    setShowModalOnLogin(
      localStorage.getItem("profileCompleted") === "false" ? true : false
    );
    onInit();
  }, []);

  function onInit() {
    setLoading(true);
    Promise.allSettled([
      getMyWork(),
      getOverDueTaskList(),
      getAndSetAllUsers(),
      getPendingRating(verifyTeamMember),
      getAndSetAllProjects(),
    ]).then((results) => {
      const rejectedPromises = results.filter(
        ({ status }) => status === "rejected"
      );
      const errorMessages = rejectedPromises.map(({ reason }) => reason);
      console.log(errorMessages, "error");
      console.log(rejectedPromises, "rejected");
    });
    setLoading(false);
  }

  useEffect(() => {
    getPendingRating(verifyTeamMember);
  }, [verifyTeamMember]);

  const handleProfileModalClose = () => {
    setShowModalOnLogin(false);
    localStorage.removeItem("profileCompleted");
  };

  const handleToRedirectTask = (projectId) => {
    navigate(`/task/${projectId}`);
  };

  const handleShowAllProjects = () => {
    navigate("/project/all");
  };
  function formDateNightTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    // // console.log(dateString, '-----------------------------------------------')
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999));
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    // // console.log('==========', localTimeString)
    // // console.log(localTimeString)
    return localTimeString;
  }

  const getMyWork = async function () {
    if (userDetails?.role !== "SUPER_ADMIN" || userDetails?.role !== "ADMIN") {
      let dataToSend = {
        currentDate: formDateNightTime(new Date()),
      };
      // setLoading(true)
      try {
        const tasks = await getAllMyWorks(dataToSend);
        // setLoading(false)
        if (tasks.error) {
          toast.dismiss();
          toast.info(
            tasks?.message || "Something Went Wrong While Fetching My Work Data"
          );
          // set
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
            } else if (
              new Date().getTime() > new Date(item?.dueDate).getTime()
            ) {
              item.dueToday = true;
            } else {
              item.dueToday = false;
            }
          });
          setMyWorkList(allTask);
        }
      } catch (error) {
        // setLoading(false)
        return error.message;
      }
    } else {
      return;
    }
  };

  const getOverDueTaskList = async function () {
    if (userDetails?.role === "SUPER_ADMIN" || userDetails?.role === "ADMIN") {
      // setLoading(true)
      try {
        const tasks = await getOverDueTaskListData();
        // setLoading(false)
        if (tasks.error) {
          toast.dismiss();
          toast.info(
            tasks?.error?.message ||
              "Something Went Wrong While Fetching Overdue Tasks Data"
          );
          // set
        } else {
          let allTask = tasks?.data;
          // console.log('object1', allTask)
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
            } else if (
              new Date().getTime() > new Date(item?.dueDate).getTime()
            ) {
              item.dueToday = true;
            } else {
              item.dueToday = false;
            }
          });
          setOverdueWorkList(allTask);
          // console.log('object2', allTask)
        }
      } catch (error) {
        // setLoading(false)
        return error.message;
      }
    } else {
      return;
    }
  };

  const getAndSetAllUsers = async function () {
    if (userDetails?.role !== "CONTRIBUTOR") {
      let options = {
        currentPage: 1,
        rowsPerPage: 50,
      };

      // setLoading(true)
      try {
        let params = {
          limit: options?.rowsPerPage,
          currentPage: options?.currentPage,
        };

        const projects = await getAllUsers({ params });
        // setLoading(false)
        if (projects.error) {
          toast.dismiss();
          toast.info(projects?.message || "Something Went Wrong");
          // set
        } else {
          setTeamMembers(projects?.data?.users || []);
        }
      } catch (error) {
        // setLoading(false)
        toast.dismiss();
        toast.info(error?.error?.message || "Something Went Wrong");
        // set
        return error.message;
      }
    } else {
      return;
    }
  };

  const getPendingRating = async function (e) {
    // setLoading(true)
    let dataToSend = {
      // filterByTeamMember : e
      memberId: e,
    };

    try {
      const tasks = await getAllPendingRating(dataToSend);
      // setLoading(false)
      if (tasks.error) {
        toast.dismiss();
        toast.info(
          tasks?.message ||
            "Something Went Wrong while fetching Pending Ratings Data"
        );
        // set
      } else {
        // console.log(tasks, 'tasks')
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
      // setLoading(false)
      return error.message;
    }
  };

  const getAndSetAllProjects = async function () {
    // setLoading(true)
    try {
      const projects = await getAllProjects();
      // setLoading(false)
      if (projects.error) {
        toast.dismiss();
        toast.info(projects?.message || "Something Went Wrong");
        // set
      } else {
        setProjectListValue(projects.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      // set
      // setLoading(false)
      return error.message;
    }
  };

  const getNewTasks = (data) => {
    // closeModal()
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

  const reOpenTask = (task) => {
    setSelectedProject();
    // setShowAddTask(true);
    setSelectedTask(task);
    setIsReOpen(true);
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
        toast.dismiss();
        toast.info(res?.message || "Something Went Wrong");
        // set
      } else {
        toast.dismiss();
        toast.info(res?.message || "Something Went Wrong");
        // set

        onInit();
        if (userDetails?.role !== "CONTRIBUTOR") {
          // getTeamWorkList();
          setIsChange(!isChange);
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
      // set
      return error.message;
    }
  };

  function formatDate(date) {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Subtract one day from the provided date
    const dayBefore = new Date(date);
    dayBefore.setDate(dayBefore.getDate());

    // Get the day of the week and day of the month for the updated date
    const dayOfWeek = days[dayBefore.getDay()];
    const dayOfMonth = dayBefore.getDate();

    return (
      <span>
        <p>
          {dayOfWeek} - <span>{dayOfMonth}</span>
        </p>
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
        toast.dismiss();
        toast.info("Something Went Wrong While Skipping the Reminder");
        return;
      } else {
        toast.dismiss();
        toast.info("Profile Update Skipped Succesfully");
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

  const handleViewDetails = (taskId, param) => {
    if (param === "isVerified") {
      // add a new status in task that is VERIFIED in the task status array
      // update the task status
    }

    setSelectedTaskId(taskId);
    setShowViewTask(true);
  };

  // Reopen Task
  const [reopenTaskModal, setReopenTaskModal] = useState(false);
  const [newDueDate, setNewDueDate] = useState("");
  const [showNewDueDateField, setShowNewDueDateField] = useState(false);
  const [reopenTaskId, setReopenTaskId] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);

  const openReopenTaskModal = (taskId) => {
    // console.log(taskId)
    setReopenTaskId(taskId._id);
    // setTaskDetails(taskId);
    setReopenTaskModal(true);
  };

  const closeReopenTaskModal = () => {
    setReopenTaskModal(false);
    setReopenTaskId(null);
    setShowNewDueDateField(false);
    setNewDueDate("");
  };

  const handleReopenConfirmation = () => {
    reOpenTask(taskDetails);
    setShowNewDueDateField(true);
  };

  const handleNewDueDate = (e) => {
    const selectedDueDate = e.target.value;
    setNewDueDate(selectedDueDate);
  };

  const handleSubmit = async () => {
    // console.log(newDueDate) // Access the new due date from the state

    // ... Perform any additional actions upon submitting the new due date
    if (newDueDate === "") {
      toast.dismiss();
      toast.info("Please Select New Due Date");
      // set
      return;
    }

    let dataToSend = {
      taskId: reopenTaskId,
      dueDate: newDueDate,
    };

    try {
      const res = await reopenTaskById(dataToSend);
      if (res.error) {
        toast.dismiss();
        toast.info(res?.message || "Something Went Wrong");
        // set
      } else {
        toast.dismiss();
        toast.info(res?.message || "Something Went Wrong");
        // set
        onInit();
        if (userDetails?.role !== "CONTRIBUTOR") {
          // getTeamWorkList();
          setIsChange(!isChange);
        }
        closeReopenTaskModal();
        setIsReOpen(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
      // set
      return error.message;
    }
  };

  return (
    <div className="dashboard_camp  rightDashboard">
      <Container>
        <Row>
          <Col lg={6} className="px-0">
            {props.showBtn && (
              <h1 className="h1-text">
                <i className="fa fa fa-home" aria-hidden="true"></i>
                My Dashboard
              </h1>
            )}
          </Col>
          <Col lg={6} id="nav-filter" className="px-0">
            <Nav className="justify-content-end" activeKey="/home">
              {(userDetails?.role === "SUPER_ADMIN" ||
                userDetails?.role === "ADMIN") && (
                <Nav.Item>
                  <Nav.Link eventKey="link-1" className="px-3">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                          setShowUserGrid(!showUserGrid);
                        }}
                        id="dropdown-basic"
                      >
                        User analytics
                      </Dropdown.Toggle>
                    </Dropdown>
                  </Nav.Link>
                </Nav.Item>
              )}
              <Nav.Item>
                <Nav.Link eventKey="link-2" className="px-0">
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
        {(userDetails?.role === "SUPER_ADMIN" ||
          userDetails?.role === "ADMIN") &&
          showUserGrid && <ProjectGrid />}

        {userDetails.role !== "GUEST" && projectList?.length !== 0 && (
          <Row className="row-bg ">
            {projectList
              ?.slice(0, showAllProjects ? projectList.length : 2)
              .map((project) => (
                <Col lg={6}>
                  <Card id={`card-${project.id}`} key={project?.id}>
                    <Row className="d-flex justify-content-start">
                      <Col lg={6} className="middle">
                        <Avatar name={project.name} size={40} round="20px" />{" "}
                        {/* <h5 className="text-truncate">{project?.name}</h5> */}
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>{project?.name}</Tooltip>}
                        >
                          <h5
                            className="text-truncate"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleToRedirectTask(project?._id);
                            }}
                          >
                            {project?.name}
                          </h5>
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
                            float: "right",
                            padding: "4px 7px",
                            fontSize: "10px",
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

            {showAddTask && (
              <AddTaskModal
                selectedProjectFromTask={selectedProject?._id}
                selectedTask={selectedTask}
                getNewTasks={getNewTasks}
                showAddTask={showAddTask}
                closeModal={closeModal}
                handleSubmitReopen={handleSubmit}
                setToasterMessageToDashboard={setToasterMessageToDashboard}
              />
            )}

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
        )}

        <Row className="mt-3">
          {(userDetails?.role === "SUPER_ADMIN" ||
            userDetails?.role === "ADMIN") && (
            <OverdueWorkComponent
              overdueWorkList={overdueWorkList}
              userDetails={userDetails}
              handleViewDetails={handleViewDetails}
              handleStatusChange={handleStatusChange}
              daysSince={daysSince}
            />
          )}

          {(userDetails?.role === "CONTRIBUTOR" ||
            userDetails?.role === "LEAD") && (
            <MyWorkComponent
              myWorkList={myWorkList}
              userDetails={userDetails}
              handleViewDetails={handleViewDetails}
              handleStatusChange={handleStatusChange}
              setSelectedProject={setSelectedProject}
              setShowAddTask={setShowAddTask}
              setSelectedTask={setSelectedTask}
            />
          )}

          {userDetails?.role !== "GUEST" && (
            <TaskVerificationComponent
              pendingRatingList={pendingRatingList}
              userDetails={userDetails}
              handleViewDetails={handleViewDetails}
              openVerifyModal={openVerifyModal}
              verifyTaskNotAllowedRoles={verifyTaskNotAllowedRoles}
              teamMembers={teamMembers}
              setVerifyTeamMember={setVerifyTeamMember}
            />
          )}
        </Row>
      </Container>
      {/* Task verification */}
      {userDetails?.role !== "CONTRIBUTOR" && (
        <Container>
          <Row className="mt-3">
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
                  <Card
                    id="card-task"
                    style={{
                      overflowX: "hidden",
                      paddingTop: "0px",
                      height: "auto",
                    }}
                  >
                    <CustomCalendar
                      setTeamWorkList={setTeamWorkList}
                      isChange={isChange}
                    />
                    <div
                      className="mt-3"
                      style={{
                        height: "90vh",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
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
                                {taskIndex === 0 ||
                                task.dueDate !==
                                  teamWorkList[taskIndex - 1].dueDate ? (
                                  <Col
                                    lg={1}
                                    className="border-top day v-align completed_task"
                                  >
                                    {formatDate(task.dueDate)}
                                  </Col>
                                ) : (
                                  <Col lg={1} className="v-align "></Col>
                                )}
                                <Col
                                  lg={11}
                                  className="border-start border-bottom d-flex justify-content-start px-0"
                                >
                                  <Row className="d-flex justify-content-start list_task w-100 mx-0 mb-0 px-2">
                                    {/* {task?.isReOpen && (
                                      <div className="d-flex align-items-center">
                                        <div className="red-flag">
                                          <i
                                            className="fa fa-retweet"
                                            aria-hidden="true"
                                          ></i>
                                        </div>
                                      </div>
                                    )} */}

                                    <Col lg={4} className="middle">
                                      {((userDetails.role === "LEAD" &&
                                        (userDetails.id ===
                                          task?.assignedTo?._id ||
                                          task?.lead?.includes(
                                            userDetails.id
                                          ) ||
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
                                                className="fa fa-check-circle primary"
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
                                                className="fa fa-check-circle  secondary "
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
                                                className="fa fa-check-circle primary "
                                                aria-hidden="true"
                                              ></i>{" "}
                                              On Hold
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      )}

                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>{task?.title}</Tooltip>
                                        }
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
                                      {task?.isReOpen && (
                                        <div className="red-flag">
                                          <OverlayTrigger
                                            placement="top"
                                            overlay={
                                              <Tooltip>Re-opened</Tooltip>
                                            }
                                          >
                                            <i
                                              className="fa fa-retweet"
                                              aria-hidden="true"
                                            ></i>
                                          </OverlayTrigger>
                                        </div>
                                      )}
                                      {task?.isDelayTask && (
                                        <div className="red-flag">
                                          <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Overdue</Tooltip>}
                                          >
                                            <i
                                              className="fa fa-flag"
                                              aria-hidden="true"
                                            ></i>
                                          </OverlayTrigger>
                                        </div>
                                      )}
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
                                          <Badge bg=" secondary">
                                            NOT STARTED
                                          </Badge>
                                        )}
                                        {task?.status === "ONGOING" && (
                                          <Badge bg="warning">ONGOING</Badge>
                                        )}
                                        {task?.status === "COMPLETED" && (
                                          <Badge bg="success">COMPLETED</Badge>
                                        )}
                                        {task?.status === "ONHOLD" && (
                                          <Badge bg="primary">ON HOLD</Badge>
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
                                          task?.lead?.includes(
                                            userDetails.id
                                          ) ||
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
                                            {task?.status === "COMPLETED" && (
                                              <Dropdown.Item
                                                onClick={() => {
                                                  openReopenTaskModal(task);
                                                }}
                                              >
                                                Reopen task
                                              </Dropdown.Item>
                                            )}
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
      {/* modal for re-open task */}
      <Modal centered show={reopenTaskModal} onHide={closeReopenTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "scroll", overflowX: "hidden" }}>
          <div className="p-3">
            {!showNewDueDateField && (
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <p>Are you sure you want to reopen this task?</p>
                  </div>
                </div>
              </div>
            )}

            {showNewDueDateField && (
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>New Due Date</label>
                    {"  "}
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      max="9999-12-31"
                      className="form-control"
                      value={newDueDate}
                      onChange={handleNewDueDate}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="row text-right">
              <div className="col-md-12">
                {!showNewDueDateField && (
                  <>
                    <Button onClick={handleReopenConfirmation}>Yes</Button>
                    <Button
                      variant="secondary"
                      className="ms-2"
                      onClick={closeReopenTaskModal}
                    >
                      No
                    </Button>
                  </>
                )}
                {showNewDueDateField && (
                  <>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                    <Button
                      variant="secondary"
                      className="ms-2"
                      onClick={closeReopenTaskModal}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* ///// */}
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

      {/* Component call for view task  */}

      {showViewTask && (
        <ViewTaskModal
          showViewTask={showViewTask}
          closeViewTaskModal={closeViewTaskModal}
          selectedTaskId={selectedTaskId}
          onInit={onInit}
          setIsChange={setIsChange}
          isChange={isChange}
        />
      )}

      <Offcanvas
        className="Offcanvas-modal profile-modal"
        style={{ width: "600px" }}
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
        <Offcanvas.Body
          style={{ height: "78vh", overflowY: "scroll", overflowX: "hidden" }}
        >
          <UserForm handleModalClose={handleProfileModalClose} />
        </Offcanvas.Body>
      </Offcanvas>
      {/* verify */}
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Verify Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="commentForm">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.comment && formik.errors.comment}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.comment}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>
          Verify
        </Button>
      </Modal.Footer>
    </Modal>
      {loading ? <Loader /> : null}
    </div>
  );
}
