import React, { useState, useEffect, useRef } from "react";
import "./tasks.css";
import {
  addSectionApi,
  archiveSectionApi,
  deleteSectionApi,
  getAllProjects,
  getProjectsTask,
  updateSection,
  updateTaskStatusById,
} from "../../services/user/api";
import Loader from "../../components/Loader";
import Toaster from "../../components/Toaster";
import FilterModal from "./FilterModal";
import AddTaskModal from "./AddTaskModal";
import TaskModal from "./ShowTaskModal";
import {
  Accordion,
  ProgressBar,
  Row,
  Col,
  Dropdown,
  Badge,
  Modal,
  Button,
  Overlay,
  Popover,
} from "react-bootstrap";
import avtar from "../../assests/img/avtar.png";
import moment from "moment";
import { useAuth } from "../../auth/AuthProvider";
import { useParams } from "react-router-dom";
import ViewTaskModal from "./view-task";
import { truncateString } from "../../helpers/truncet";

const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [taskFilters, setTaskFilters] = useState({});
  const [selectedProject, setSelectedProject] = useState({});

  const [taskData, setTaskData] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [sectionEditMode, setSectionEditMode] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const { userDetails } = useAuth();

  const [showViewTask, setShowViewTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [deleteSectionModal, setDeleteSectionModal] = useState(false);



//   ///////////////////////////  confirmation-popup  ///////////////////////////

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
	  console.log("res", res);
	  if (res.status === 200) {
		setToasterMessage("Section deleted successfully");
		setShowToaster(true);
		setDeleteSectionModal(false);
		closeModal();
		getTasksDataUsingProjectId();
		if (params?.projectId) {
			setSelectedProjectId(params?.projectId);
		  }
	  } else {
		setToasterMessage(res?.message);
		setShowToaster(true);
	  }
	} catch (error) {
	  console.log("error", error);
	}
	  };

 

// ///////////////////////////  confirmation-popup  ///////////////////////////

///////////////////////////  archiveConFirmation  ///////////////////////////

const [archiveSectionModal, setArchiveSectionModal] = useState(false);


const archiveConFirmation = (sectionId) => {
	setSelectedSectionId(sectionId?._id);
	setArchiveSectionModal(true);
	 };

	 const archiveSection = async () => {
		let dataToSend = {
		  sectionId: selectedSectionId,
		  isArchived: true,
		};
		try {
		  const res = await archiveSectionApi(dataToSend);
		  console.log("res", res);
		  if (res.status === 200) {
			setToasterMessage("Section archived successfully");
			setShowToaster(true);
			setArchiveSectionModal(false);
			closeModal();
			getTasksDataUsingProjectId();
			if (params?.projectId) {
				setSelectedProjectId(params?.projectId);
			  }
		  } else {
			setToasterMessage(res?.message);
			setShowToaster(true);
		  }
		} catch (error) {
		  console.log("error", error);
		}
		  };


///////////////////////////  archiveConFirmation  ///////////////////////////


  const editSection = (sectionId, projectId) => {
    console.log("sectionId", sectionId);
    console.log("projectId", projectId);
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
      console.log("res", res);
      if (res.status === 200) {
        setToasterMessage("Section updated successfully");
        setSectionEditMode(false);
        setShowToaster(true);
        setModalShow(false);
        closeModal();
        // getAndSetAllProjects();
        getTasksDataUsingProjectId();
        // window.location.reload();
        if (params?.projectId) {
          setSelectedProjectId(params?.projectId);
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
    console.log(
      "showViewTask-----------------------------------------------------------",
      showViewTask
    );
    setSelectedTaskId(taskId);
    setShowViewTask(true);
    console.log("showViewTask =====================", showViewTask);
  };

  const closeViewTaskModal = () => {
    setShowViewTask(false);
    setSelectedTaskId(null);

    console.log("closeViewTaskModal");
  };

  //   console.log("userDetails +++++++++++++++++++++++++++", userDetails.id);
  const params = useParams();
  console.log("params", params);
  console.log("selectedProjectId", selectedProjectId);

  const setShowToaster = (param) => showToaster(param);

  const [showStatusSelect, setShowStatusSelect] = useState(false);

  //   const handleTaskItemClick = () => {
  //     setShowStatusSelect(!showStatusSelect);
  //   };

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
        getTasksDataUsingProjectId();
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  useEffect(() => {
    getTasksDataUsingProjectId();
    if (params?.projectId) {
      setSelectedProjectId(params?.projectId);
    }
  }, []);

  const [projectList, setProjectListValue] = useState([]);
  const [sectionName, setSectionName] = useState("");

  const showAddSectionModal = (isTrue) => {
    setSectionName("");
    // setSelectedProjectId("");
    getAndSetAllProjects();
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

        //   if(sectionEditMode){
        // 	dataToSend.sectionId = sectionId;
        //   }

        const res = await addSectionApi(dataToSend);
        setLoading(false);
        if (res.error) {
          setToasterMessage(res?.error?.message || "Something Went Wrong");
          setShowToaster(true);
        } else {
          setToasterMessage(res?.message || "Something Went Wrong");
          setShowToaster(true);
          setModalShow(false);
          closeModal();
          // getAndSetAllProjects();
          getTasksDataUsingProjectId();
          // window.location.reload();
          if (params?.projectId) {
            setSelectedProjectId(params?.projectId);
          }
        }
      } catch (error) {
        setToasterMessage(error?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setLoading(false);
        return error.message;
      }
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

  const getTasksDataUsingProjectId = async () => {
    setLoading(true);
    try {
      let data = {
        groupBy: "default",
        // user
      };
      if (params?.projectId) {
        data.projectId = params?.projectId;
      }

      if (localStorage.getItem("taskFilters")) {
        let filterData = JSON.parse(localStorage.getItem("taskFilters"));
        console.log("filterData", filterData);
        if (filterData?.projectIds) {
          data.projectIds = JSON.stringify(filterData?.projectIds);
        }
        if (filterData?.createdBy) {
          data.createdBy = JSON.stringify(filterData?.createdBy);
        }
        if (filterData?.assignedTo) {
          data.assignedTo = JSON.stringify(filterData?.assignedTo);
        }
        if (filterData?.section) {
          data.section = JSON.stringify(filterData?.section);
        }
        if (filterData?.priority) {
          data.priority = JSON.stringify(filterData?.priority);
        }
        if (filterData?.status) {
          data.status = JSON.stringify(filterData?.status);
        }
        if (filterData?.sortType) {
          data.sortType =filterData?.sortType;
        }
        if (filterData?.sortOrder) {
          data.sortOrder = filterData?.sortOrder;
        }
        if (filterData?.fromDate) {
          data.fromDate = filterData?.fromDate;
        }
        if (filterData?.toDate) {
          data.toDate = filterData?.toDate;
        }
        // data = filterData;
        // data.groupBy = "default";
        console.log(data, "filter data");
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
              if (dateMonth == today) {
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
                dateMonth == task?.completedDate?.split("T")[0]
              ) {
                task.dueToday = false;
              }
            }
          });
          allTask[i].tasks = item?.tasks;
        });
        setProjects(allTask);
        console.log(allTask);
        if (params.projectId) {
          setSelectedProject();
        }
        // if (!allTask?.length && params?.projectId && userDetails?.role !=='CONTRIBUTOR' ) {
        // 	setModalShow(true);
        // }

        console.log(allTask, "allTask");
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
      <div className="rightDashboard">
        <h1 className="h1-text">
          <i className="fa fa-list-ul" aria-hidden="true"></i>Task
        </h1>

        <button
          className="addTaskBtn"
          style={{
            float: "right",
          }}
          onClick={() => {
            setSelectedTask();
            setShowAddTask(true);
            setSelectedProject();
          }}
        >
          Add Task
        </button>

        {projects?.length !== 0 &&
          userDetails?.role !== "CONTRIBUTOR" &&
          selectedProjectId && (
            <button
              className="addTaskBtn addSectionBtn"
              style={{
                float: "right",
              }}
              onClick={() => {
                showAddSectionModal(true);
              }}
            >
              Add Section
            </button>
          )}

        <FilterModal
          handleProjectId={selectedProjectId}
          getTaskFilters={getTaskFilters}
        />

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
        />

        <Accordion alwaysOpen="true">
          {!projects?.length &&
            params?.projectId &&
            userDetails?.role !== "CONTRIBUTOR" && (
              <div className="add-section-center">
                <div className="project-card-section">
                  <a
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
                  </a>
                </div>
              </div>
            )}

          {projects.map((project, index) => (
            <Accordion.Item key={index} eventKey={index}>
              {project?._id?.projectId && project?._id?.section && (
                <Accordion.Header>
                  <p style={{ marginBottom: "0" }}>
                    {project?._id?.projectId} / {project?._id?.section}{" "}
                  </p>
                </Accordion.Header>
              )}

              <div className="d-flex rightTags">
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
                <div>
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
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
                        Add Task
                      </Dropdown.Item>

                      {(userDetails.role == "SUPER_ADMIN" ||
                        userDetails.role == "ADMIN") && (
                        <>
                          <Dropdown.Item
                            onClick={() =>
                              editSection({
                                section: project?._id?.section,
                                projectId: project?.projectId,
                                _id: project?.sectionId,
                              })
                            }
                          >
                            Edit Section
                          </Dropdown.Item>
                          <Dropdown.Item onClick={()=>archiveConFirmation({ _id: project?.sectionId})} >Archive Section</Dropdown.Item>
                          <Dropdown.Item>Copy/Move</Dropdown.Item>
                            <Dropdown.Item
							disabled={project?.tasks?.length > 0}
							 onClick={()=>deleteConFirmation({ _id: project?.sectionId})} >Delete Section</Dropdown.Item>
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
                      {/* {(userDetails.id === task?.assignedTo?._id || userDetails.role =='SUPER_ADMIN' || userDetails.role =='ADMIN') && (
                      <select
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
                      <i
                        className={
                          task?.status === "COMPLETED" ? "line-strics" : ""
                        }
                        onClick={() => handleViewDetails(task?._id)}
                      >
                        { truncateString(task?.title , 20) }
                      </i>

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
                      {/* {task?.priority === 'None' &&  <Badge  bg="secondary">None</Badge>} */}
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
                      <span className="nameTag">
                        {" "}
                        <img src={avtar} alt="userAvtar" />{" "}
                        {task?.assignedTo?.name}
                      </span>
                      {task?.dueDate && (
                        <Badge bg={task?.dueToday ? "danger" : "primary"}>
                          Due{" "}
                          {moment(task?.dueDate?.split("T")[0]).format(
                            "MMM DD,YYYY"
                          )}
                        </Badge>
                      )}
                      {/* {(userDetails.id === task?.assignedTo?._id ||
                        userDetails.role == "SUPER_ADMIN" ||
                        userDetails.role == "ADMIN") && (
                        <a
                          style={{
                            float: "right",
                            color: "#8602ff",
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setSelectedProject();
                            setShowAddTask(true);
                            setSelectedTask(task);
                          }}
                        >
                          Edit
                        </a>
                        
                       
                      )} */}
                      <div className="task-hover"> <a > <i className="fa fa-pencil-square-o" aria-hidden="true"></i> </a> </div>
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
              {/* <div className="collpase">collapsed</div> */}
              {/* <div className="addtask">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                Add Task
              </div> */}
            </Accordion.Item>
          ))}
        </Accordion>

        <Modal
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
            <div className="form-group">
              <label>Section</label>
              <input
                required
                type="text"
                className="form-control"
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
              style={{ marginLeft: "5px" }}
              className="btn"
              onClick={() => setModalShow(false)}
            >
              Cancel
            </Button>
            </div>
           
          </Modal.Body>
        </Modal>

		
		<Modal className="confirmation-modal" show={deleteSectionModal} onHide={() =>setDeleteSectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this section
		</Modal.Body>
        <Modal.Footer style={{alignItems:'center', justifyContent:'center'}}>
          <Button variant="secondary" onClick={() =>setDeleteSectionModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>deleteSection()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

	  <Modal className="confirmation-modal" show={archiveSectionModal} onHide={() =>setArchiveSectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Archive Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Archive this section
		</Modal.Body>
        <Modal.Footer style={{alignItems:'center', justifyContent:'center'}}>
          <Button variant="secondary" onClick={() =>setArchiveSectionModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>archiveSection()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
	

		{/*  */}

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
