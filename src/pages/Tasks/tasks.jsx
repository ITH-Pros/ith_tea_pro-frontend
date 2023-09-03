import React, { useState, useEffect } from "react";
import "./tasks.css";
import {
  addSectionApi,
  archiveSectionApi,
  deleteSectionApi,
  downloadExcel,
  getProjectsTask,
  updateSection,
  updateTaskStatusById,
} from "@services/user/api";

import FilterModal from "@components/FilterModal/index";
import AddTaskModal from "@components/AddTaskModal/index";
import { Modal, Button, Row, Col } from "react-bootstrap";
import ViewTaskModal from "@components/view-task/index";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../utlis/AuthProvider";
import TaskList from "@components/task-List/tasklist";
import { useMutation, useQuery } from "react-query";
import { convertToUTCDay, convertToUTCNight } from "@helpers/index";

const Tasks = () => {
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedSection, setSelectedSection] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [sectionEditMode, setSectionEditMode] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [showViewTask, setShowViewTask] = useState(false);
  // const [projects, setProjects] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [deleteSectionModal, setDeleteSectionModal] = useState(false);
  const [isArchive, setIsArchive] = useState(false);
  const [taskInfo, setTaskInfo] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [archiveSectionModal, setArchiveSectionModal] = useState(false);
  const { userDetails } = useAuth();
  const params = JSON.parse(localStorage.getItem("project_details"));
  const { projectId } = useParams();

  useEffect(() => {
    if (localStorage.getItem("showTaskToaster")) {
      setTimeout(() => {
        toast.dismiss();
        toast.info(localStorage.getItem("showTaskToaster"));
        // set
        localStorage.removeItem("showTaskToaster");
      }, 500);
    }
  }, [localStorage.getItem("showTaskToaster")]);

  const handleAddTaskFromSection = (project) => {
    console.log("section", project);
    setSelectedTask();
    // localStorage.setItem("addTaskModal", true);
    setShowAddTask(true);

    setSelectedSection({
      _id: project?.projectId,
      section: project?.sectionId,
      sectionName: project?._id.section,
    });
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("taskFilters");
      localStorage.removeItem("selectedFilterTypes");
      localStorage.removeItem("selectedLead");
      localStorage.removeItem("fromDate");
      localStorage.removeItem("toDate");
      localStorage.removeItem("sortOrder");
      localStorage.removeItem("sortType");
      localStorage.removeItem("selectedFilter");
      localStorage.removeItem("dueDate");
    };
  }, []);

  useEffect(() => {
    // fetchTasks(projectId);
    let paramsData;
    if (params?.projectId) {
      paramsData = params?.projectId;
    }

    if (paramsData?.projectId) {
      setSelectedProjectId(paramsData?.projectId);
    }
    if (paramsData?.isArchive) {
      setIsArchive(paramsData?.isArchive);
    }
  }, [isArchive]);

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

  /*  @delete section */

  const deleteSection = () => {
    let dataToSend = {
      sectionId: selectedSectionId,
    };
    deleteMutation.mutate(dataToSend);
  };

  const deleteMutation = useMutation(deleteSectionApi, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.dismiss();
        toast.info("Section deleted successfully");
        // set
        setDeleteSectionModal(false);
        closeModal();
        getAllTasksForListing();
        let paramsData;
        if (params?.projectId) {
          paramsData = params?.projectId;
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      } else {
        toast.dismiss();
        toast.info(res?.message);
        // set
      }
    },
    onError: (error) => {
      console.log("error in deleteSection", error);
    },
  });

  /*  @archive section */

  const archiveSection = async () => {
    let dataToSend = {
      sectionId: selectedSectionId,
      isArchived: true,
    };
    archiveSectionMutation.mutate(dataToSend);
  };

  const archiveSectionMutation = useMutation(archiveSectionApi, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.dismiss();
        toast.info("Section archived successfully");
        setArchiveSectionModal(false);
        closeModal();
        getAllTasksForListing();
        let paramsData;
        if (params?.projectId) {
          paramsData = params?.projectId;
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      } else {
        toast.dismiss();
        toast.info(res?.message);
      }
    },
    onError: (error) => {
      console.log("error in archiveSection", error);
    },
  });

  /* @update section */

  const editSection = (sectionId, projectId) => {
    setSelectedProjectId(sectionId?.projectId);
    setSectionName(sectionId?.section);
    setSelectedSectionId(sectionId?._id);
    setModalShow(true);
    setSectionEditMode(true);
    sectionUpdate();
  };

  const sectionUpdate = async () => {
    let dataToSend = {
      name: sectionName,
      projectId: selectedProjectId,
      sectionId: selectedSectionId,
    };
    updateSectionMutation.mutate(dataToSend);
  };

  const updateSectionMutation = useMutation(updateSection, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.info("Section updated successfully");
        toast.dismiss();
        setSectionEditMode(false);
        setModalShow(false);
        closeModal();
        getAllTasksForListing();
        let paramsData;
        if (params?.projectId) {
          paramsData = params?.projectId;
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      } else {
        toast.info(res?.message);
        toast.dismiss();
      }
    },
    onError: (error) => {
      console.log("error in updateSection", error);
    },
  });

  /* @update task status */

  const handleStatusChange = (e, taskId, status) => {
    const newStatus = status;
    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    };
    updateTaskStatusMutation.mutate(dataToSend);
  };

  const updateTaskStatusMutation = useMutation(updateTaskStatusById, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.dismiss();
        toast.info("Task status updated successfully");
        getAllTasksForListing();
      } else {
        toast.dismiss();
        toast.info(res?.message);
      }
    },
    onError: (error) => {
      console.log("error in updateTaskStatusMutation", error);
    },
  });

  const handleViewDetails = (taskId) => {
    setSelectedTaskId(taskId);
    setShowViewTask(true);
  };

  const closeViewTaskModal = () => {
    setShowViewTask(false);
    setSelectedTaskId(null);
  };

  const showAddSectionModal = (isTrue) => {
    setSectionName("");
    setModalShow(isTrue);
  };

  /* @add section */

  const addSection = async () => {
    let dataToSend = {
      name: sectionName,
      projectId: selectedProjectId,
    };
    addSectionMutation.mutate(dataToSend);
  };

  const addSectionMutation = useMutation(addSectionApi, {
    onSuccess: (res) => {
      if (res.error) {
        toast.dismiss();
        toast.info(res?.message || "Something Went Wrong in add section");
      } else {
        toast.dismiss();
        toast.info(res?.message || "Response in add section");
        setModalShow(false);
        closeModal();
        getAllTasksForListing();
        let paramsData;
        if (params?.projectId) {
          paramsData = params?.projectId;
        }
        if (paramsData?.projectId) {
          setSelectedProjectId(paramsData?.projectId);
        }
      }
    },
    onError: (error) => {
      console.log("error in addSection", error);
    },
  });

  /*  @fecth tasks */
  const fetchTasks = () => {
    let paramsData = projectId || null;
    let data = {
      groupBy: "default",
      isArchived: isArchive || false,
      projectId: paramsData,
    };
    if (localStorage.getItem("selectedLead")) {
      let leads = JSON.parse(localStorage.getItem("selectedLead"));
      if (leads && leads.length > 0) {
        data.leads = JSON.stringify(leads);
      }
    }
    if (localStorage.getItem("taskFilters")) {
      let filterData = JSON.parse(localStorage.getItem("taskFilters"));
      let selectedFilter = localStorage.getItem("selectedFilterTypes");
      console.log(filterData);
      if (filterData?.projectIds && filterData.projectIds.length > 0) {
        data.projectIds = JSON.stringify(
          filterData.projectIds.map((item) => item._id)
        );
      }
      if (filterData?.createdBy && filterData?.createdBy?.length > 0) {
        data.createdBy = JSON.stringify(
          filterData.createdBy.map((item) => item._id)
        );
      }
      if (filterData?.selectedLead && filterData.selectedLead.length > 0) {
        data.leads = JSON.stringify(
          filterData.selectedLead.map((item) => item._id)
        );
      }
      if (filterData?.assignedTo && filterData.assignedTo.length > 0) {
        data.assignedTo = JSON.stringify(
          filterData.assignedTo.map((item) => item._id)
        );
      }
      if (filterData?.category && filterData.category.length > 0) {
        data.sections = JSON.stringify(
          filterData.category.map((item) => item._id)
        );
      }
      if (filterData?.priority && filterData.priority?.length > 0) {
        data.priority = JSON.stringify(filterData.priority);
      }
      if (filterData?.status && filterData.status?.length > 0) {
        data.status = JSON.stringify(filterData.status);
      }
      if (filterData?.sortType) {
        data.sortType = JSON.stringify(filterData.sortType);
      }
      if (filterData?.sortOrder) {
        data.sortOrder = JSON.stringify(filterData.sortOrder);
      }
      if (
        filterData?.fromDate &&
        selectedFilter &&
        selectedFilter !== "null" &&
        selectedFilter !== "Today" &&
        selectedFilter !== "Tomorrow"
      ) {
        data.fromDate = convertToUTCDay(filterData.fromDate);
      }
      if (
        filterData?.toDate &&
        selectedFilter &&
        selectedFilter !== "null" &&
        selectedFilter !== "Today" &&
        selectedFilter !== "Tomorrow"
      ) {
        data.toDate = convertToUTCNight(filterData.toDate);
      }
      if (selectedFilter === "Today" || selectedFilter === "Tomorrow") {
        data.fromDate = convertToUTCDay(filterData.fromDate);
        data.toDate = convertToUTCNight(filterData.toDate);
      }
    }
    return data;
    // taskMutation.mutate(data);
  };

  const {
    data: projects,
    refetch: getAllTasksForListing,
    isLoading,
    isFetching,
  } = useQuery(["getAllTasks"], () => getProjectsTask(fetchTasks()), {
    enabled: true,
    refetchOnWindowFocus: false,
    select: (data) => {
      if (data?.error) {
        toast.dismiss();
        toast.info(data?.message);
      } else {
        let allTasks = data?.data;
        allTasks.forEach((item) => {
          item.tasks.forEach((task) => {
            if (task.dueDate) {
              let today = new Date().toISOString().split("T")[0];

              if (
                task.dueDate.split("T")[0] === today ||
                new Date(task.dueDate).getTime() < new Date().getTime()
              ) {
                task.dueToday = true;
              } else {
                task.dueToday = false;
              }

              if (
                task.completedDate &&
                new Date(task.completedDate).getTime() >
                  new Date(task.dueDate).getTime()
              ) {
                task.dueToday = true;
              }

              if (
                task.completedDate &&
                task.completedDate.split("T")[0] === task.dueDate.split("T")[0]
              ) {
                task.dueToday = false;
              }
            }
          });
        });
        return allTasks;
      }
    },
    onSuccess: () => {
      let paramsData = projectId || null;
      if (paramsData) {
        setSelectedProjectId(paramsData);
      }
    },
  });

  /*  @downloadExportData */

  const downloadExportData = () => {
    let paramsData;
    if (params?.projectId) {
      paramsData = params?.projectId;
    }
    let data = {
      groupBy: "default",
    };
    if (isArchive) {
      data.isArchived = true;
    }
    if (params?.projectId) {
      data.projectId = paramsData;
    }
    if (localStorage.getItem("selectedLead")) {
      let leadsToSend = localStorage.getItem("selectedLead");
      let leads = JSON.parse(localStorage.getItem("selectedLead"));
      if (leads?.length) {
        data.leads = leadsToSend;
      }
    }

    if (localStorage.getItem("taskFilters")) {
      let filterData = JSON.parse(localStorage.getItem("taskFilters"));
      let selectedFilter = localStorage.getItem("selectedFilter");
      if (filterData?.projectIds && filterData.projectIds.length > 0) {
        data.projectIds = JSON.stringify(filterData?.projectIds);
      }
      if (filterData?.createdBy) {
        data.createdBy = JSON.stringify(filterData?.createdBy);
      }
      if (filterData?.assignedTo && filterData?.assignedTo.length > 0) {
        data.assignedTo = JSON.stringify(filterData?.assignedTo);
      }
      if (filterData?.category?.length) {
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
        selectedFilter &&
        selectedFilter !== "null" &&
        selectedFilter !== "Today" &&
        selectedFilter !== "Tomorrow"
      ) {
        // // console.log(selectedFilter, '----------------')

        data.fromDate = convertToUTCDay(filterData?.fromDate);
      }
      if (
        filterData?.toDate &&
        selectedFilter &&
        selectedFilter !== "null" &&
        selectedFilter !== "Today" &&
        selectedFilter !== "Tomorrow"
      ) {
        // // console.log(selectedFilter, '----------------')

        data.toDate = convertToUTCNight(filterData?.toDate);
      }
      if (selectedFilter === "Today" || selectedFilter === "Tomorrow") {
        // // console.log(selectedFilter, '----------------')

        data.fromDate = convertToUTCDay(filterData?.fromDate);
        data.toDate = convertToUTCNight(filterData?.toDate);
      }
    }
    exportDataMutation.mutate(data);
  };

  const exportDataMutation = useMutation(downloadExcel, {
    onSuccess: (data) => {
      if (data?.error) {
        toast.dismiss();
        toast.info(data?.message || "Something Went Wrong in download excel");
      } else {
        const blob = new Blob([data], {
          type: ".xlsx",
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${Date.now()}.xlsx`);

        document.body.appendChild(link);
        link.click();

        link.remove();
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(
        error?.message || "Something Went Wrong in download excel error"
      );
    },
  });

  const getNewTasks = (id) => {
    closeModal();
    getAllTasksForListing();
  };

  const getTaskFilters = () => {
    getAllTasksForListing();
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
              <i className="fa fa-list-ul" aria-hidden="true"></i>
              Task
            </h1>
          </Col>
          <Col lg={6}>
            <div className="text-end">
              {!isArchive && (
                <Button
                  className="addTaskBtn"
                  style={{
                    float: "right",
                  }}
                  onClick={() => {
                    setSelectedTask();
                    setSelectedProject();
                    // localStorage.setItem("addTaskModal", true);
                    setShowAddTask(true);
                  }}
                >
                  <i className="fa fa-plus-circle" aria-hidden="true"></i> Add
                  Task
                </Button>
              )}

              {projects?.length !== 0 &&
                userDetails?.role !== "CONTRIBUTOR" &&
                !isArchive &&
                projectId && (
                  <button
                    className="addTaskBtn addSectionBtn"
                    onClick={() => {
                      showAddSectionModal(true);
                    }}
                  >
                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add
                    Section
                  </button>
                )}
              <button className="filter_btn">
                <FilterModal
                  handleProjectId={selectedProjectId}
                  getTaskFilters={getTaskFilters}
                  isArchive={isArchive}
                  downloadExportData={downloadExportData}
                  projectId={params?.projectId}
                  projects={projects}
                />
              </button>
            </div>
          </Col>
        </Row>

        {showAddTask && (
          <AddTaskModal
            selectedProjectFromTask={selectedProject?._id}
            selectedTask={selectedTask}
            getNewTasks={getNewTasks}
            showAddTask={showAddTask}
            closeModal={closeModal}
            handleProjectId={selectedProjectId}
            selectedSection={selectedSection}
            projectList={projects}
          />
        )}
        {showViewTask && (
          <ViewTaskModal
            showViewTask={showViewTask}
            closeViewTaskModal={closeViewTaskModal}
            selectedTaskId={selectedTaskId}
            getTasksDataUsingProjectId={() => getAllTasksForListing()}
          />
        )}

        <TaskList
          projects={projects}
          isFetching={isFetching}
          isLoading={isLoading}
          selectedProjectId={selectedProjectId}
          isArchive={isArchive}
          userDetails={userDetails}
          taskInfo={taskInfo}
          handleProgressBarHover={handleProgressBarHover}
          setTaskInfo={setTaskInfo}
          handleAddTaskFromSection={handleAddTaskFromSection}
          editSection={editSection}
          deleteConFirmation={deleteConFirmation}
          handleViewDetails={handleViewDetails}
          handleStatusChange={handleStatusChange}
          setSelectedProject={setSelectedProject}
          setShowAddTask={setShowAddTask}
          setSelectedTask={setSelectedTask}
        />

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
                style={{ marginLeft: "5px", color: "#fff" }}
                className="btn btn-light"
                onClick={() => setModalShow(false)}
              >
                Cancel
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

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
              Cancel
            </Button>
            <Button variant="primary" onClick={() => deleteSection()}>
              Delete
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
            <Button
              variant="primary"
              onClick={() => archiveSection()}
              className="text-white"
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Tasks;
