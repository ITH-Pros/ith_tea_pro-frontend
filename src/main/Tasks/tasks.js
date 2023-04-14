/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./tasks.css";
// import {
//   Accordion,
//   AccordionBody,
//   AccordionHeader,
//   AccordionItem,
// } from "react-headless-accordion";
import {
  addSectionApi,
  archiveSectionApi,
  deleteSectionApi,
  getProjectsTask,
  updateSection,
  updateTaskStatusById,
} from "../../services/user/api";
import Loader from "../../components/Loader";
import Toaster from "../../components/Toaster";
import FilterModal from "./FilterModal";
import AddTaskModal from "./AddTaskModal";
import {
  Accordion,
  ProgressBar,
  Dropdown,
  Badge,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  Row, Col
} from "react-bootstrap";
import moment from "moment";
import { useAuth } from "../../auth/AuthProvider";
import { useParams } from "react-router-dom";
import ViewTaskModal from "./view-task";
import { Truncate } from "../../helpers/truncate";
import UserIcon from "../Projects/ProjectCard/profileImage";
import Offcanvas from "react-bootstrap/Offcanvas";

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [sectionEditMode, setSectionEditMode] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [showViewTask, setShowViewTask] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [deleteSectionModal, setDeleteSectionModal] = useState(false);
  const [isArchive, setIsArchive] = useState(false);
  const [taskInfo, setTaskInfo] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [archiveSectionModal, setArchiveSectionModal] = useState(false);
  const { userDetails } = useAuth();
  const params = useParams();
  useEffect(() => {
    if (localStorage.getItem("showTaskToaster")) {
      setTimeout(() => {
        setToasterMessage(localStorage.getItem("showTaskToaster"));
        setShowToaster(true);
        localStorage.removeItem("showTaskToaster");
      }, 500);
    }
  }, [localStorage.getItem("showTaskToaster")]);

  useEffect(() => {
    getTasksDataUsingProjectId();
    let paramsData;

    if (params?.projectId) {
      paramsData = JSON.parse(params?.projectId);
      localStorage.setItem("tasksParamsData", params?.projectId);
    }

    if (paramsData?.projectId) {
      setSelectedProjectId(paramsData?.projectId);
    }
    if (paramsData?.isArchive) {
      setIsArchive(paramsData?.isArchive);
    }
  }, [isArchive]);

  // useEffectOnce(() => {
  //   console.log('useEffectOnce has run!');
  //   return () => {
  //   };
  // });

  const handleProgressBarHover = (project) => {
    const completedTasks = project.completedTasks || 0;
    const totalTasks = project.totalTasks || 0;
    const pendingTasks = totalTasks - completedTasks;
    setTaskInfo({ completedTasks, pendingTasks });
  };

  const deleteConFirmation = (sectionId) => {
    setSelectedSectionId(sectionId?._id);
    setDeleteSectionModal(true);
  };

  const deleteSection = async () => {
    let dataToSend = {
      sectionId: selectedSectionId,
    };
    try {
      const res = await deleteSectionApi(dataToSend);
      if (res.status === 200) {
        setToasterMessage("Section deleted successfully");
        setShowToaster(true);
        setDeleteSectionModal(false);
        closeModal();
        getTasksDataUsingProjectId();
        let paramsData;
        if (params?.projectId) {
          paramsData = JSON.parse(params?.projectId);
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      } else {
        setToasterMessage(res?.message);
        setShowToaster(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const archiveSection = async () => {
    let dataToSend = {
      sectionId: selectedSectionId,
      isArchived: true,
    };
    try {
      const res = await archiveSectionApi(dataToSend);
      if (res.status === 200) {
        setToasterMessage("Section archived successfully");
        setShowToaster(true);
        setArchiveSectionModal(false);
        closeModal();
        getTasksDataUsingProjectId();
        let paramsData;
        if (params?.projectId) {
          paramsData = JSON.parse(params?.projectId);
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      } else {
        setToasterMessage(res?.message);
        setShowToaster(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const editSection = (sectionId, projectId) => {
    setSelectedProjectId(sectionId?.projectId);
    setSectionName(sectionId?.section);
    setSelectedSectionId(sectionId?._id);
    setModalShow(true);
    setSectionEditMode(true);
  };

  const sectionUpdate = async () => {
    let dataToSend = {
      name: sectionName,
      projectId: selectedProjectId,
      sectionId: selectedSectionId,
    };
    try {
      const res = await updateSection(dataToSend);
      if (res.status === 200) {
        setToasterMessage("Section updated successfully");
        setSectionEditMode(false);
        setShowToaster(true);
        setModalShow(false);
        closeModal();
        getTasksDataUsingProjectId();
        let paramsData;
        if (params?.projectId) {
          paramsData = JSON.parse(params?.projectId);
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      } else {
        setToasterMessage(res?.message);
        setShowToaster(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleViewDetails = (taskId) => {
    setSelectedTaskId(taskId);
    setShowViewTask(true);
  };

  const closeViewTaskModal = () => {
    setShowViewTask(false);
    setSelectedTaskId(null);
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
        getTasksDataUsingProjectId();
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const showAddSectionModal = (isTrue) => {
    setSectionName("");
    setModalShow(isTrue);
  };

  const addSection = async () => {
    if (sectionEditMode) {
      sectionUpdate();
      return;
    } else {
      setLoading(true);
      try {
        let dataToSend = {
          name: sectionName,
          projectId: selectedProjectId,
        };

        const res = await addSectionApi(dataToSend);
        setLoading(false);
        if (res.error) {
          setToasterMessage(res?.message || "Something Went Wrong");
          setShowToaster(true);
        } else {
          setToasterMessage(res?.message || "Something Went Wrong");
          setShowToaster(true);
          setModalShow(false);
          closeModal();
          getTasksDataUsingProjectId();
          let paramsData;
          if (params?.projectId) {
            paramsData = JSON.parse(params?.projectId);
          }
          if (paramsData?.projectId) {
            setSelectedProjectId(paramsData?.projectId);
          }
          // getProjectList();
        }
      } catch (error) {
        setToasterMessage(error?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setLoading(false);
        return error.message;
      }
    }
  };

  const getTasksDataUsingProjectId = async () => {
    let paramsData;
    if (params?.projectId) {
      paramsData = JSON.parse(params?.projectId);
    }
    setLoading(true);
    try {
      let data = {
        groupBy: "default",
      };
      if (isArchive) {
        data.isArchived = true;
      }
      if (params?.projectId) {
        data.projectId = paramsData?.projectId;
      }

      if (localStorage.getItem("taskFilters")) {
        let filterData = JSON.parse(localStorage.getItem("taskFilters"));
        let selectedFilter = localStorage.getItem("selectedFilter");
        console.log(selectedFilter, "selectedFilter");
        console.log(filterData);
        if (filterData?.projectIds) {
          data.projectIds = JSON.stringify(filterData?.projectIds);
        }
        if (filterData?.createdBy) {
          data.createdBy = JSON.stringify(filterData?.createdBy);
        }
        if (filterData?.assignedTo && filterData?.assignedTo.length > 0) {
          data.assignedTo = JSON.stringify(filterData?.assignedTo);
        }
        if (filterData?.category) {
          data.sections = JSON.stringify(filterData?.category);
        }
        if (filterData?.priority) {
          data.priority = JSON.stringify(filterData?.priority);
        }
        if (filterData?.status) {
          data.status = JSON.stringify(filterData?.status);
        }
        if (filterData?.sortType) {
          data.sortType = filterData?.sortType;
        }
        if (filterData?.sortOrder) {
          data.sortOrder = filterData?.sortOrder;
        }
        if (
          filterData?.fromDate &&
          filterData?.fromDate !== filterData?.toDate &&
          selectedFilter !== "Today" &&
          selectedFilter !== "Tomorrow"
        ) {
          data.fromDate = filterData?.fromDate;
        }
        if (
          filterData?.toDate &&
          filterData?.fromDate !== filterData?.toDate &&
          selectedFilter !== "Today" &&
          selectedFilter !== "Tomorrow"
        ) {
          data.toDate = filterData?.toDate;
        }
        if (selectedFilter === "Today" || selectedFilter === "Tomorrow") {
          data.fromDate = filterData?.fromDate;
          data.toDate = filterData?.toDate;
        }
      }
      const tasks = await getProjectsTask(data);
      setLoading(false);
      if (tasks.error) {
        setToasterMessage(tasks?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        let allTask = tasks?.data;
        allTask?.forEach((item, i) => {
          item?.tasks?.map((task, j) => {
            if (task?.dueDate) {
              let dateMonth = task?.dueDate?.split("T")[0];
              let today = new Date();

              today =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1 <= 9
                  ? "0" + (today.getMonth() + 1)
                  : today.getMonth() + 1) +
                "-" +
                (today.getDate() <= 9
                  ? "0" + today.getDate()
                  : today.getDate());
              if (dateMonth === today) {
                task.dueToday = true;
              } else if (
                new Date().getTime() > new Date(task?.dueDate).getTime()
              ) {
                task.dueToday = true;
              } else {
                task.dueToday = false;
              }
              if (
                task?.completedDate &&
                new Date(task?.completedDate).getTime() >
                  new Date(task?.dueDate).getTime()
              ) {
                task.dueToday = true;
              }
              if (
                task?.completedDate &&
                dateMonth === task?.completedDate?.split("T")[0]
              ) {
                task.dueToday = false;
              }
            }
          });
          allTask[i].tasks = item?.tasks;
        });
        setProjects(allTask);
        let paramsData;
        if (params?.projectId) {
          paramsData = JSON.parse(params?.projectId);
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  const getNewTasks = (id) => {
    closeModal();
    getTasksDataUsingProjectId();
  };

  const getTaskFilters = () => {
    getTasksDataUsingProjectId();
  };

  const closeModal = () => {
    setShowAddTask(false);
    setSelectedProject();
    setSelectedTask();
  };

  return (
    <>
      <div className="rightDashboard" style={{ marginTop: "7%" }}>
        <Row>
          <Col lg={6}>
          <h1 className="h1-text mt-0">
          <i className="fa fa-list-ul" aria-hidden="true"></i>Task
      
        </h1>
          </Col>
          <Col lg={6}>
          <div className="text-end">
            {!isArchive && (
              <button
                className="addTaskBtn"
                style={{
                  float: "right",
                }}
                onClick={() => {
                  setSelectedTask();
                  setSelectedProject();
                  setShowAddTask(true);
                  
                }}
              >
             <i class="fa fa-plus-circle" aria-hidden="true"></i>   Add Task
              </button>
            )}

            {projects?.length !== 0 &&
              userDetails?.role !== "CONTRIBUTOR" &&
              !isArchive &&
              selectedProjectId && (
                <button
                  className="addTaskBtn addSectionBtn"
                
                  onClick={() => {
                    showAddSectionModal(true);
                  }}
                >
                <i class="fa fa-plus-circle" aria-hidden="true"></i>  Add Section
                </button>
              )}
              <button className="filter_btn">
                 <FilterModal
          handleProjectId={selectedProjectId}
          getTaskFilters={getTaskFilters}
          isArchive={isArchive}
        />
              </button>
                  
          </div>
          </Col>
        </Row>
     

   

        <AddTaskModal
          selectedProjectFromTask={selectedProject}
          selectedTask={selectedTask}
          getNewTasks={getNewTasks}
          showAddTask={showAddTask}
          closeModal={closeModal}
          handleProjectId={selectedProjectId}
        />

        <ViewTaskModal
          showViewTask={showViewTask}
          closeViewTaskModal={closeViewTaskModal}
          selectedTaskId={selectedTaskId}
          getTasksDataUsingProjectId={getTasksDataUsingProjectId}
        />
        
        <Accordion alwaysOpen="true">
          {!projects?.length &&
            params?.projectId &&
            !isArchive &&
            userDetails?.role !== "CONTRIBUTOR" && (
              <div className="add-section-center">
                <button
                  style={{ border: "0px" }}
                  onClick={() => {
                    showAddSectionModal(true);
                  }}
                >
                  <i
                    className="fa fa-plus-circle fa-3x addBtn-section"
                    title="Add Project"
                    aria-hidden="true"
                  >
                    {" "}
                    Add Section
                  </i>
                </button>
              </div>
            )}
          {!projects?.length && !selectedProjectId && (
            <h6 style={{textAlign:'center'}} >No Tasks Found</h6>
          )}

{projects.map((project, index) => (
  project?.tasks?.length > 0 && ( // check if tasks array has data
    <Accordion.Item key={index} eventKey={index}>
      {project?._id?.projectId && project?._id?.section && (
        <Accordion.Header>
          {project?._id?.projectId} / {project?._id?.section}
        </Accordion.Header>
              )}

              <div className="d-flex rightTags">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {taskInfo && (
                        <div>
                          <div>Completed Tasks: {taskInfo.completedTasks}</div>
                          <div>Pending Tasks: {taskInfo.pendingTasks}</div>
                        </div>
                      )}
                    </Tooltip>
                  }
                >
                  <div
                    onMouseEnter={() => handleProgressBarHover(project)}
                    onMouseLeave={() => setTaskInfo(null)}
                  >
                    {parseFloat(
                      (Number(project?.completedTasks || 0) /
                        Number(project?.totalTasks || 1)) *
                        100
                    ).toFixed(2) + " % "}
                    <ProgressBar>
                      <ProgressBar
                        variant="success"
                        now={
                          100 *
                          (Number(project?.completedTasks || 0) /
                            Number(project?.totalTasks || 1))
                        }
                        key={1}
                      />
                    </ProgressBar>
                  </div>
                </OverlayTrigger>
                <div>
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                      <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {!isArchive && (
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedTask();
                            setShowAddTask(true);
                            setSelectedProject({
                              _id: project?.projectId,
                              section: project?.sectionId,
                            });
                          }}
                        >
                          <i
                            className="fa fa-plus-circle"
                            aria-hidden="true"
                          ></i>{" "}
                          Add Task
                        </Dropdown.Item>
                      )}

                      {(userDetails.role === "SUPER_ADMIN" ||
                        userDetails.role === "ADMIN") && (
                        <>
                          {!isArchive && (
                            <Dropdown.Item
                              onClick={() =>
                                editSection({
                                  section: project?._id?.section,
                                  projectId: project?.projectId,
                                  _id: project?.sectionId,
                                })
                              }
                            >
                              <i
                                className="fa fa-pencil-square"
                                aria-hidden="true"
                              ></i>{" "}
                              Edit Section
                            </Dropdown.Item>
                          )}
                          {!isArchive && (
                            <Dropdown.Item>
                              <i
                                className="fa fa-files-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Copy/Move
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item
                            disabled={project?.tasks?.length > 0}
                            onClick={() =>
                              deleteConFirmation({ _id: project?.sectionId })
                            }
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>{" "}
                            Delete Section
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <Accordion.Body>
                <ul className="mb-0">
                  {project?.tasks?.map((task) => (
                    <li key={task?._id} className="share-wrapper-ui">
                      
                      <div
                        className="clickLabelArea"
                        
                      >
                        <Row className="align-items-center justify-content-start">
                          <Col lg={5} className="align-items-center"> 
                          <Row>
                            <Col  lg={1}>
                            <div>
                          {(userDetails.id === task?.assignedTo?._id ||
                      (userDetails.role === "LEAD" &&
                        (userDetails.id === task?.assignedTo?._id ||
                          task?.lead?.includes(userDetails.id) ||
                          userDetails.id === task?.createdBy?._id)) ||
                      userDetails.role === "SUPER_ADMIN" ||
                      userDetails.role === "ADMIN")&& (
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
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

                          {task.status !== "COMPLETED" && (
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
                          )}
                        </Dropdown>
                      )}
                          </div>
                            </Col>
                            <Col  lg={11}>
                            <p
                          className={
                            task?.status === "COMPLETED" ? "line-strics" : ""
                          }
                          // onClick={() => handleViewDetails(task?._id)}
                        >
                         <p onClick={() => handleViewDetails(task?._id)} className="text-truncate">{task?.title}</p> 
                        </p>
                            </Col>
                          </Row>
                       
                        </Col>
                         
                          <Col lg={3}>
                          {task?.status === "NOT_STARTED" && (
                          <Badge bg="secondary">NOT STARTED</Badge>
                        )}
                        {task?.status === "ONGOING" && (
                          <Badge bg="warning">ONGOING</Badge>
                        )}
                        {task?.status === "COMPLETED" && (
                          <Badge bg="success">
                            completed{" "}
                            {moment(task?.completedDate?.split("T")[0]).format(
                              "MMM DD,YYYY"
                            )}
                          </Badge>
                        )}
                        {task?.status === "ONHOLD" && (
                          <Badge bg="primary">ON HOLD</Badge>
                        )}
                        {task?.priority === "LOW" && (
                          <Badge bg="primary">LOW</Badge>
                        )}
                        {task?.priority === "REPEATED" && (
                          <Badge bg="warning">REPEATED</Badge>
                        )}
                        {task?.priority === "MEDIUM" && (
                          <Badge bg="warning">MEDIUM</Badge>
                        )}
                        {task?.priority === "HIGH" && (
                          <Badge bg="danger">HIGH</Badge>
                        )}
                          </Col>
                          <Col lg={3} className="align-items-center justify-content-start">
                          {!task?.assignedTo?.profilePicture&&task?.assignedTo?.name && (
                          <div className="nameTag">
                            <UserIcon
                              key={index}
                              firstName={task?.assignedTo?.name||''}
                            />
                          </div>
                        )}
                        {task?.assignedTo?.profilePicture && (
                          <div className="nameTag" style={{display:'contents'}}>
                            <img
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                              }}
                              src={`${task?.assignedTo?.profilePicture}`}
                              alt="profile"
                            ></img>
                          </div>
                        )}
                        <span> {task?.assignedTo?.name}</span>
                        {!task?.assignedTo?.name && <span> NOT ASSIGNED </span>}
                          </Col>
                          <Col lg={1}>
                            
                        {task?.dueDate && (
                          <Badge bg={task?.dueToday ? "danger" : "primary"}>
                            Due{" "}
                            {moment(task?.dueDate?.split("T")[0]).format(
                              "MMM DD,YYYY"
                            )}
                          </Badge>
                          // onClick={() => handleViewDetails(task?._id)}
                        )}
                          </Col>
                          
                        </Row>
                       

                       
                     

                      </div>
                      {(userDetails.id === task?.assignedTo?._id ||
                        (userDetails.role === "LEAD" &&
                          (userDetails.id === task?.assignedTo?._id ||
                            task?.lead?.includes(userDetails.id) ||
                            userDetails.id === task?.createdBy?._id)) ||
                        userDetails.role === "SUPER_ADMIN" ||
                        userDetails.role === "ADMIN") &&
                        !isArchive && (
                          <a
                            style={{
                              float: "right",
                              color: "#6c757d",
                              cursor: "pointer",
                              marginRight: "10px",
                              position: "relative",
                              top: "10px",
                            }}
                            onClick={() => {
                              setSelectedProject();
                              setShowAddTask(true);
                              setSelectedTask(task);
                            }}
                          >
                            <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </a>
                        )}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>)
))}
          {projects && projects.length === 0 && (
            <p> {isArchive ? "No Task archived." : ""} </p>
          )}
        </Accordion>

        {/* <div id="multi_accrodian">
          <Accordion>
            <AccordionItem>
              <AccordionHeader>
                <h3>Recru 2.0</h3>
              </AccordionHeader>

              <AccordionBody>
                <div className="accordion-body">
                  <AccordionItem>
                    <AccordionHeader>
                      <h3 className={`accordion-title`}>Ad-hoc</h3>
                    </AccordionHeader>

                    <AccordionBody>
                      <div className="accordion-body">
                        Lorem ipsum dolor sit amet.
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                </div>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader>
                <h3 className="">Title 2</h3>
              </AccordionHeader>

              <AccordionBody>
                <div className="accordion-body">
                  Lorem ipsum dolor sit amet.
                </div>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </div> */}

        {/* <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              {sectionEditMode ? "Update Section" : "Add section"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
           
          </Modal.Body>
        </Modal> */}

        {/* ////// */}
        <Offcanvas
          className="Offcanvas-modal"
          style={{ height: "100vh" }}
          show={modalShow}
          placement="end"
          onHide={() => setModalShow(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {" "}
              {sectionEditMode ? "Update Section" : "Add section"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="form-group">
              <label>Section</label>
              <input
                required
                type="text"
                className="form-control"
                maxLength={40}
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
              />
            </div>
            <div className="text-right">
              {selectedProjectId && sectionName && (
                <Button
                  style={{ marginLeft: "10px" }}
                  className="btn btn-danger mr-3"
                  onClick={() => addSection()}
                >
                  {sectionEditMode ? "Update Section" : "Add section"}
                </Button>
              )}

              <Button
                style={{ marginLeft: "5px", color:'#fff' }}
                className="btn btn-light"
                onClick={() => setModalShow(false)}
              >
                Cancel
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        {/* /// */}

        <Modal
          className="confirmation-popup"
          show={deleteSectionModal}
          onHide={() => setDeleteSectionModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Section</Modal.Title>
          </Modal.Header>
          <Modal.Body className="body_ui">
            Are you sure you want to delete this section
          </Modal.Body>
          <Modal.Footer
            className="footer_ui"
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "inherit",
              width: "auto",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setDeleteSectionModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => deleteSection()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="confirmation-popup"
          show={archiveSectionModal}
          onHide={() => setArchiveSectionModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Archive Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to Archive this section</Modal.Body>
          <Modal.Footer
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Button
              variant="secondary"
              onClick={() => setArchiveSectionModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => archiveSection()}>
              Save Changes
            </Button>
          </Modal.Footer>
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
    </>
  );
};

export default Tasks;
