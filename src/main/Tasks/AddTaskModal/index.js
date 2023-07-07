/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import AttachmentUploader from "./attachment";
import {
  getAllProjects,
  createTask,
  updateTaskDetails,
  getProjectById,
  getLeadsUsingProjectId,
  getUserUsingProjectId,
  deleteTaskDetails,
  updateTaskStatusById,
} from "../../../services/user/api";

import { CONSTANTS } from "../../../constants";
import TextEditor from "./textEditor";
import { useAuth } from "../../../auth/AuthProvider";
import Loader from "../../../components/Loader";
import Offcanvas from "react-bootstrap/Offcanvas";
import { toast } from "react-toastify";

export default function AddTaskModal(props) {
  const {
    selectedProjectFromTask,
    getNewTasks,
    showAddTask,
    closeModal,
    selectedTask,
    handleProjectId,

    // onInit
  } = props;
  // // console.log(selectedTask)
  const statusList = CONSTANTS.statusList;
  const priorityList = CONSTANTS.priorityList;
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [validated, setValidated] = useState(false);
  const [leadLists, setLeadList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { userDetails } = useAuth();
  const miscTypeArray = CONSTANTS.MISCTYPE;
  const [showMiscType, setShowMiscType] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [isResetAttachment, setIsResetAttachment] = useState(false);

  const uploadedAttachmentsArray = (uploadedFiles) => {
    setUploadedFiles(uploadedFiles);
  };

  useEffect(() => {
    setCategoryList([]);
    setLeadList([]);
    localStorage.removeItem("addTaskModal");
  }, [localStorage.getItem("addTaskModal")]);

  const taskFormFields = {
    projectId: "",
    section: "",
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    completedDate: "",
    priority: priorityList[0],
    status: statusList[0],
    attachments: [],
    tasklead: "",
    miscType: "",
    defaultTaskTime: {
      hours: 0,
      minutes: 0,
    },
  };
  const [taskFormValue, setTaskFormValue] = useState(taskFormFields);

  
  
  const [selectedLeads, setSelectedLeads] = useState();

  useEffect(() => {
    getProjectList();
  }, []);

  useEffect(() => {
    if (taskFormValue.projectId && taskFormValue.leads) {
      if (
        leadLists.find((el) => el._id === taskFormValue?.leads)?.role ===
        "ADMIN"
      ) {
        getUserListUsingProjectId(
          taskFormValue?.projectId,
          taskFormValue?.leads
        );
      } else {
        getUserListUsingProjectId(taskFormValue?.projectId);
      }
    }
  }, [taskFormValue.projectId, taskFormValue.leads]);

  useEffect(() => {
    if (showAddTask) {
      getProjectList();
      patchFormForAdd();
      setShowAddTaskModal(true);
    }
  }, [showAddTask]);

  const patchFormForAdd = () => {
    if (selectedProjectFromTask) {
      console.log("selectedProjectFromTask", selectedProjectFromTask);
      getProjectByIdFunc(selectedProjectFromTask._id);
      getLeadsListUsingProjectId(selectedProjectFromTask?._id);
      setTaskFormValue({
        ...taskFormValue,
        projectId: selectedProjectFromTask?._id,
        section: selectedProjectFromTask?.section,
      });

      if (selectedProjectFromTask?.sectionName === "Misc") {
        setShowMiscType(true);
      } else {
        setShowMiscType(false);
      }
    } else if (selectedTask) {
      console.log("project", projectList);
      getProjectByIdFunc(selectedTask?.projectId);

      // console.log("selectedTask", selectedTask);
      // let project = projectList?.filter(
      //   (item) => item?._id === selectedTask?.projectId
      // );
      // console.log('project', project)
      // setCategoryList(project[0]?.sections);

      getLeadsListUsingProjectId(selectedTask?.projectId);
      let dueDateData = new Date(selectedTask?.dueDate?.split("T")[0]);
      let completedDateData = new Date(selectedTask?.completedDate);
      if (selectedTask?.completedDate) {
        completedDateData =
          completedDateData.getFullYear() +
          "-" +
          (completedDateData.getMonth() + 1 <= 9
            ? "0" + (completedDateData.getMonth() + 1)
            : completedDateData.getMonth() + 1) +
          "-" +
          (completedDateData.getDate() <= 9
            ? "0" + completedDateData.getDate()
            : completedDateData.getDate());
      } else {
        completedDateData = "";
      }
      dueDateData =
        dueDateData.getFullYear() +
        "-" +
        (dueDateData.getMonth() + 1 <= 9
          ? "0" + (dueDateData.getMonth() + 1)
          : dueDateData.getMonth() + 1) +
        "-" +
        (dueDateData.getDate() <= 9
          ? "0" + dueDateData.getDate()
          : dueDateData.getDate());

      // console.log('selectedTask', selectedTask)
      setShowMiscType(false);

      if (selectedTask?.miscType) {
        setShowMiscType(true);
      } else {
        setShowMiscType(false);
      }
      setTaskFormValue({
        projectId: selectedTask?.projectId,
        section: selectedTask?.section,
        miscType: selectedTask?.miscType,
        leads: selectedTask?.lead[0]?._id || selectedTask?.lead[0],
        title: selectedTask?.title,
        defaultTaskTime: {
          hours: selectedTask?.defaultTaskTime?.hours,
          minutes: selectedTask?.defaultTaskTime?.minutes,
        },
        description: selectedTask?.description,
        assignedTo: selectedTask?.assignedTo?._id || selectedTask?.assignedTo,
        dueDate: dueDateData,
        completedDate: completedDateData ? completedDateData : "",
        priority: selectedTask?.priority,
        status: selectedTask?.status,
        attachments: selectedTask?.attachments,
      });
      setHours(selectedTask?.defaultTaskTime?.hours);
      setMinutes(selectedTask?.defaultTaskTime?.minutes);
    } else if (handleProjectId) {
      // console.log("handleProjectId", handleProjectId);
      let project = projectList?.find((item) => item?._id === handleProjectId);
      getLeadsListUsingProjectId(project?._id);
      if (leadLists.length === 1) {
        setSelectedLeads(project?.managedBy);
      }
      setCategoryList(project?.sections);
      setTaskFormValue({
        ...taskFormValue,
        projectId: handleProjectId,
      });
      // console.log(handleProjectId, '=======================handle project id')
      getProjectByIdFunc(handleProjectId);
    } else if (userDetails.role === "CONTRIBUTOR") {
      setTaskFormValue({ ...taskFormValue, assignedTo: userDetails?.id });
    } else {
      resetFormValue();
    }
  };

  const getProjectList = async () => {
    console.log("getAllProjects form add task");

    setLoading(true);
    try {
      const projects = await getAllProjects();
      setLoading(false);
      if (projects.error) {
        return;
      } else {
        setProjectList(projects?.data);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const getProjectByIdFunc = async (id) => {
    let dataToSend = {
      projectId: id,
    };
    setLoading(true);
    try {
      const projects = await getProjectById(dataToSend);
      setLoading(false);
      if (projects.error) {
        return;
      } else {
        setCategoryList(projects?.data);
        // console.log(projects, "-------------------------------");
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const getLeadsListUsingProjectId = async (id) => {
    let dataToSend = {
      projectId: id,
    };
    setLoading(true);
    try {
      const leads = await getLeadsUsingProjectId(dataToSend);
      setLoading(false);
      if (leads.error) {
      } else {
        setLeadList(leads?.data);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const getUserListUsingProjectId = async (id, lead) => {
    let dataToSend = {
      projectId: id,
    };
    if (lead) {
      dataToSend.selectedLeadRole = "ADMIN";
    }
    setLoading(true);
    try {
      const users = await getUserUsingProjectId(dataToSend);
      setLoading(false);
      if (users.error) {
      } else {
        setUserList(users?.data);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  function formDateNightTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999));
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    // console.log("==========", localTimeString);
    // console.log(localTimeString);
    return localTimeString;
  }

  const onchangeSelectedProject = (e) => {
    console.log(e.target.value, "====================");
    let project = projectList.find((el) => el._id === e.target.value);
    setTaskFormValue({
      ...taskFormValue,
      projectId: project?._id,
      section: "",
      miscType: "",
    });
    // fix misc type and set value to null
    setShowMiscType(false);
    getProjectByIdFunc(project?._id);
    getLeadsListUsingProjectId(project._id);
    updateTaskFormValue(e);
  };

  const updateTaskFormValue = (e) => {
    let updateValue = { ...taskFormValue };

    updateValue[e.target.name] = e.target.value;
    if (e.target.name === "status" && !(e.target.value === "COMPLETED")) {
      updateValue["completedDate"] = null;
    }
    if (e.target.name === "status" && e.target.value === "COMPLETED") {
      let today = new Date();
      let patchDateValue =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1 <= 9
          ? "0" + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        "-" +
        (today.getDate() <= 9 ? "0" + today.getDate() : today.getDate());
      updateValue["completedDate"] = patchDateValue;
    }
    if (hours >= 0) updateValue.defaultTaskTime.hours = hours;
    if (minutes >= 0) updateValue.defaultTaskTime.minutes = minutes;

    categoryList?.forEach((item) => {
      if (item._id === e.target.value && item.name === "Misc") {
        setShowMiscType(true);
      } else if (item._id === e.target.value && item.name !== "Misc") {
        setShowMiscType(false);
        updateValue.miscType = "";
      }
    });
    setTaskFormValue(updateValue);
  };

  const updateTaskDescriptionValue = (description) => {
    setTaskFormValue({ ...taskFormValue, description });
  };

  const submitTask = async () => {
    setValidated(true);
    if (
      !taskFormValue.projectId ||
      !taskFormValue.section ||
      !taskFormValue.title ||
      !taskFormValue.leads ||
      (!hours && !minutes)
    ) {
      console.log("returning");
      return;
    }
    setLoading(true);
    try {
      let {
        projectId,
        section,
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status,
        leads,
        attachments,
        miscType,
        defaultTaskTime,
      } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      section && (dataToSend["section"] = section);
      miscType && (dataToSend["miscType"] = miscType);
      title && (dataToSend["title"] = title);
      description && (dataToSend["description"] = description);
      assignedTo && (dataToSend["assignedTo"] = assignedTo);
      dueDate && (dataToSend["dueDate"] = formDateNightTime(dueDate));
      priority && (dataToSend["priority"] = priority);
      status && (dataToSend["status"] = status);
      leads && (dataToSend["tasklead"] = [leads]);
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      uploadedFiles && (dataToSend["attachments"] = uploadedFiles);
      defaultTaskTime && (dataToSend["defaultTaskTime"] = defaultTaskTime);

      const taskRes = await createTask(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        toast.dismiss()
      toast.info(taskRes?.message || "Error while creating Task");
        // set
        return;
      } else {
        setValidated(false);
        setSelectedLeads("");
        setCategoryList([]);
        toast.dismiss()
      toast.info("Task Created Succesfully !!");
        // set
        resetFormValue();
        closeModal()
        setTimeout(() => {
          setShowAddTaskModal(false);
        }, 500);
        getNewTasks(projectId);

        // onInit();
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const submitTaskAnother = async () => {
    setValidated(true);
    if (
      !taskFormValue.projectId ||
      !taskFormValue.section ||
      !taskFormValue.title ||
      !taskFormValue.leads ||
      (!hours && !minutes)
    ) {
      console.log("returning");
      return;
    }
    setLoading(true);
    try {
      let {
        projectId,
        section,
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status,
        leads,
        completedDate,
        attachments,
        miscType,
        defaultTaskTime,
      } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      section && (dataToSend["section"] = section);
      title && (dataToSend["title"] = title);
      description && (dataToSend["description"] = description);
      assignedTo && (dataToSend["assignedTo"] = assignedTo);
      dueDate && (dataToSend["dueDate"] = formDateNightTime(dueDate));
      priority && (dataToSend["priority"] = priority);
      status && (dataToSend["status"] = status);
      leads && (dataToSend["tasklead"] = [leads]);
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      completedDate && (dataToSend["completedDate"] = completedDate);
      uploadedFiles && (dataToSend["attachments"] = uploadedFiles);
      miscType && (dataToSend["miscType"] = miscType);
      defaultTaskTime && (dataToSend["defaultTaskTime"] = defaultTaskTime);

      const taskRes = await createTask(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        toast.dismiss()
      toast.info(taskRes?.message || "Error while creating Task");
        // set
        return;
      } else {
        toast.dismiss()
      toast.info("Task Created Succesfully");
        // set
        resetFormValue();
        closeModal()
        setValidated(false);
        setSelectedLeads("");
        setCategoryList([]);

        getNewTasks(projectId);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  const onLeadChange = (e) => {
    setTaskFormValue({
      ...taskFormFields,
      projectId: taskFormValue?.projectId,
      section: taskFormValue?.section,
      miscType: taskFormValue?.miscType,
      title: taskFormValue?.title,
      description: taskFormValue?.description,
      dueDate: taskFormValue?.dueDate,
      priority: taskFormValue?.priority,
      status: taskFormValue?.status,
      leads: e.target.value,
    });
  };

  const resetModalData = () => {
    closeModal();
    setValidated(false);
    resetFormValue();
    setCategoryList([]);
    setShowMiscType(false);
    setHours("");
    setMinutes("");
    setShowAddTaskModal(false);
  };
  const resetFormValue = () => {
    setHours("");
    setMinutes("");
    setTaskFormValue({
      projectId: "",
      section: "",
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      completedDate: "",
      priority: priorityList[0],
      status: statusList[0],
      attachments: [],
      leads: "",
      miscType: "",
      defaultTaskTime: {
        hours: 0,
        minutes: 0,
      },
    });
    setUploadedFiles([]);
    uploadedAttachmentsArray([]);
    setIsResetAttachment(!isResetAttachment);
    // reset all the props

    // setTimeout(() => {
    //   document.getElementById("handleresetbuttonid")?.click();
    // }, 500);
  };

  const updateTaskStatus = async (dataToSend) => {
    try {
      const res = await updateTaskStatusById(dataToSend);
      if (res.error) {
        toast.dismiss()
      toast.info(res?.message || "Something Went Wrong");
        // set
      } else {
        // console.log(res);
      }
    } catch (error) {
      toast.dismiss()
      toast.info(error?.error?.message || "Something Went Wrong");
      // set
      return error.message;
    }
  };

  const updateTask = async () => {
    setValidated(true);
    if (
      !taskFormValue.projectId ||
      !taskFormValue.section ||
      !taskFormValue.title ||
      !taskFormValue.leads ||
      (!hours && !minutes)
    ) {
      console.log("returning");
      return;
    }

    setLoading(true);
    try {
      if (hours >= 0) taskFormValue.defaultTaskTime.hours = hours;
      if (minutes >= 0) taskFormValue.defaultTaskTime.minutes = minutes;
      let {
        projectId,
        section,
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status,
        leads,
        completedDate,
        miscType,
        defaultTaskTime,
      } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      section && (dataToSend["section"] = section);
      dataToSend["miscType"] = miscType;
      title && (dataToSend["title"] = title);
      description && (dataToSend["description"] = description);
      assignedTo && (dataToSend["assignedTo"] = assignedTo);
      dataToSend["dueDate"] = formDateNightTime(dueDate);
      priority && (dataToSend["priority"] = priority);
      status && (dataToSend["status"] = status);
      leads && (dataToSend["tasklead"] = [leads]);
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      completedDate && (dataToSend["completedDate"] = completedDate);
      uploadedFiles && (dataToSend["attachments"] = uploadedFiles);
      defaultTaskTime && (dataToSend["defaultTaskTime"] = defaultTaskTime);

      const taskRes = await updateTaskDetails(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        toast.dismiss()
      toast.info(taskRes?.message || "Error while updating Task");
        // set
        return;
      } else {
        if(selectedTask?.status !== dataToSend?.status){
        updateTaskStatus({
          status: dataToSend?.status,
          taskId: dataToSend?.taskId,
        });}
        setSelectedLeads("");
        setTaskFormValue({
          ...taskFormValue,
          title: "",
          description: "",
          assignedTo: "",
          dueDate: "",
          completedDate: "",
          priority: "",
          status: "",
          attachments: [],
          miscType: "",
        });
        setValidated(false);
        setShowAddTaskModal(false);
        getNewTasks(projectId);
        toast.dismiss()
        toast.info("Task Updated Succesfully !!");
        closeModal()
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
      return error.message;
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    try {
      let { projectId } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      const taskRes = await deleteTaskDetails(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        toast.dismiss()
      toast.info(taskRes?.message || "Error while deleting Task");
        // set
        return;
      } else {
        setSelectedLeads("");
        setTaskFormValue({
          ...taskFormValue,
          title: "",
          description: "",
          assignedTo: "",
          dueDate: "",
          completedDate: "",
          priority: "",
          status: "",
          attachments: [],
          miscType: "",
        });

        setValidated(false);
        setShowAddTaskModal(false);
        getNewTasks(projectId);
        toast.dismiss()
      toast.info("Task Deleted Succesfully !!");
        // set
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
      return error.message;
    }
  };

  return (
    <>
      <Offcanvas
        className="Offcanvas-modal"
        style={{ width: "800px" }}
        show={showAddTaskModal}
        placement="end"
        onHide={() => resetModalData()}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {" "}
            {selectedTask ? "Edit Task" : "Add Task"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="dv-50">
            <Form noValidate validated={validated}>
              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Project </Form.Label>
                  <Form.Control
                    size="lg"
                    required
                    as="select"
                    type="select"
                    onChange={onchangeSelectedProject}
                    value={taskFormValue?.projectId}
                    name="projectId"
                    disabled={
                      selectedTask || handleProjectId || selectedProjectFromTask
                    }
                  >
                    <option value="" disabled>
                      Select Project
                    </option>
                    {projectList?.map((project, index) => (
                      <option value={project?._id} key={index}>
                        {project?.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Project is required !!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Section</Form.Label>
                  <Form.Control
                    size="lg"
                    required
                    as="select"
                    type="select"
                    name="section"
                    placeholder="Select Section"
                    onChange={updateTaskFormValue}
                    value={taskFormValue?.section}
                  >
                    <option value="" selected disabled>
                      Select Section
                    </option>

                    {categoryList?.map((section, index) => (
                      <option value={section?._id} key={index}>
                        {section?.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Section is required !!
                  </Form.Control.Feedback>
                </Form.Group>
                {/*  */}

                {/* if taskFormValue.section ==="" */}

                {showMiscType && (
                  <Form.Group as={Col} md="6">
                    <Form.Label>Misc Type</Form.Label>
                    <Form.Control
                      size="lg"
                      required
                      as="select"
                      type="select"
                      name="miscType"
                      placeholder="Select Misc Type"
                      onChange={updateTaskFormValue}
                      value={taskFormValue?.miscType}
                    >
                      <option selected value="" disabled>
                        Select Category
                      </option>

                      {miscTypeArray?.map((miscType, index) => (
                        <option value={miscType} key={index}>
                          {miscType}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Misc Type is required !!
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                {/*  */}
                <Form.Group as={Col} md="12">
                  <Form.Label>Lead</Form.Label>
                  <Form.Control
                    size="lg"
                    required
                    as="select"
                    type="select"
                    onChange={onLeadChange}
                    value={taskFormValue?.leads}
                    name="leadId"
                    disabled={
                      selectedTask && taskFormValue?.status === "COMPLETED"
                    }
                  >
                    <option value="">Select Lead</option>
                    {leadLists?.map((project, index) => (
                      <option value={project?._id} key={index}>
                        {project?.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Lead is required !!
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="7">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Title"
                    value={taskFormValue?.title}
                    name="title"
                    onChange={updateTaskFormValue}
                  />

                  <Form.Control.Feedback type="invalid">
                    Title is required !!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="5">
                  <Form.Label>Estimated Time</Form.Label>
                  <div className="d-flex flexWrap">
                    <Form.Control
                      className="timeWth"
                      required={!hours && !minutes}
                      type="number"
                      max="23"
                      min="0"
                      placeholder="Hours"
                      name="defaultTaskTime.hours" // Unique name for hours input
                      value={hours}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue.length <= 2 && inputValue >= 0) {
                          setHours(inputValue);
                        }
                      }}
                    />
                    <span className="mx-2 centerColon">:</span>
                    <Form.Control
                      className="timeWth"
                      required={!hours && !minutes}
                      type="number"
                      max="59"
                      min="0"
                      placeholder="Minutes"
                      name="defaultTaskTime.minutes" // Unique name for minutes input
                      value={minutes}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          inputValue.length <= 2 &&
                          inputValue <= 59 &&
                          inputValue >= 0
                        ) {
                          setMinutes(inputValue);
                        }
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Estimated time is required!!
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <TextEditor
                  width="100%"
                  placeholder="Enter Description"
                  value={taskFormValue?.description}
                  onChange={updateTaskDescriptionValue}
                />
              </Row>
              <Row className="mt-5">
                <AttachmentUploader
                  uploadedAttachmentsArray={uploadedAttachmentsArray}
                  taskAttachments={selectedTask?.attachments || []}
                  isResetAttachment={isResetAttachment}
                />
              </Row>

              <Row className="mb-3 mt-5">
                <Form.Group as={Col} md="3">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control
                    as="select"
                    type="select"
                    name="assignedTo"
                    onChange={updateTaskFormValue}
                    value={taskFormValue?.assignedTo}
                  >
                    <option value="">Select User</option>
                    {userList?.map((module, index) => (
                      <option value={module?._id} key={index}>
                        {module?.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    placeholder="Due date"
                    disabled={
                      selectedTask && taskFormValue?.status === "COMPLETED"
                    }
                    name="dueDate"
                    value={taskFormValue?.dueDate}
                    onChange={updateTaskFormValue}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    type="select"
                    name="priority"
                    onChange={updateTaskFormValue}
                    value={taskFormValue?.priority}
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    {priorityList.map((priority, index) => (
                      <option value={priority} key={index}>
                        {priority}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} md="3" className="ps-0">
                  <Form.Label>Status</Form.Label>

                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>Update task status after adding task.</Tooltip>
                    }
                  >
                    <Form.Control
                      required
                      as="select"
                      type="select"
                      name="status"
                      onChange={updateTaskFormValue}
                      value={taskFormValue?.status || statusList[0]}
                      disabled={taskFormValue?.status === "COMPLETED"}
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {statusList?.map((status, index) => (
                        <option
                          value={status}
                          disabled={status !== "NOT_STARTED" && !selectedTask}
                          key={index}
                        >
                          {status}
                        </option>
                      ))}
                    </Form.Control>
                  </OverlayTrigger>
                </Form.Group>
                {taskFormValue?.status === "COMPLETED" && (
                  <Form.Group as={Col} md="4">
                    <Form.Label>Completed Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Completed date"
                      name="completedDate"
                      onChange={updateTaskFormValue}
                      value={taskFormValue?.completedDate}
                      disabled={taskFormValue?.status === "COMPLETED"}
                    />
                  </Form.Group>
                )}
              </Row>

              <div className="addFormBtn">
                {!selectedTask && (
                  <Button
                    className="btn btn-primary"
                    type="button"
                    onClick={submitTask}
                  >
                    Create
                  </Button>
                )}
                {selectedTask && (
                  <div>
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={updateTask}
                    >
                      Update
                    </Button>
                    <Button
                      className="btn btn-danger"
                      style={{ marginLeft: "10px" }}
                      type="button"
                      onClick={deleteTask}
                    >
                      Delete Task
                    </Button>
                  </div>
                )}
                {!selectedTask &&
                  !selectedProjectFromTask &&
                  !(
                    selectedTask ||
                    handleProjectId ||
                    selectedProjectFromTask
                  ) && (
                    <Button
                      className="btn btn-primary"
                      style={{ marginLeft: "10px" }}
                      type="button"
                      onClick={submitTaskAnother}
                    >
                      Create And Add Another
                    </Button>
                  )}
              </div>
            </Form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {loading ? <Loader /> : null}
    </>
  );
}
