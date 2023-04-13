/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import AttachmentUploader from "./attachment";
import {
  getAllProjects,
  createTask,
  updateTaskDetails,
  getLeadsUsingProjectId,
  getUserUsingProjectId,
  deleteTaskDetails,
} from "../../../services/user/api";
import Toaster from "../../../components/Toaster";
import { CONSTANTS } from "../../../constants";
import TextEditor from "./textEditor";
import { useAuth } from "../../../auth/AuthProvider";
import Loader from "../../../components/Loader";
import Offcanvas from 'react-bootstrap/Offcanvas';
// import {useEffectOnce} from './useEffectOnce';

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
  const statusList = CONSTANTS.statusList;
  const priorityList = CONSTANTS.priorityList;
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState();
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [validated, setValidated] = useState(false);
  const [leadLists, setLeadList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { userDetails } = useAuth();

  const uploadedAttachmentsArray = (uploadedFiles) => {
    setUploadedFiles(uploadedFiles);
  };


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
  };
  const [taskFormValue, setTaskFormValue] = useState(taskFormFields);
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");
  const [selectedLeads, setSelectedLeads] = useState();

  // useEffectOnce(() => {
  //   console.log('useEffectOnce has run!');
  //   setToasterMessage('')
  //   setShowToaster(false);
  //   return () => {
  //     setToasterMessage('')
  //     setShowToaster(false);
  //   };
  // });

  useEffect(() => {
  
    getProjectList();
  }, []);

  useEffect(() => {
    setCategoryList(projectList[0]?.sections)
  
    
  }, [projectList]);

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
      setShowAddTaskModal(true);
      getProjectList();
      patchFormForAdd();
    }
  }, [showAddTask]);

  

 


  const patchFormForAdd = () => {
    if (selectedProjectFromTask) {
      // console.log("selectedProjectFromTask", selectedProjectFromTask);
      let project = projectList?.filter(
        (item) => item?._id === selectedProjectFromTask?._id
      );
      getLeadsListUsingProjectId(project[0]?._id);
      setCategoryList(project[0]?.sections);
      setTaskFormValue({
        ...taskFormValue,
        projectId: project[0]?._id,
        section: selectedProjectFromTask.section,
      });
    } else if (selectedTask) {
      let project = projectList?.filter(
        (item) => item?._id === selectedTask?.projectId
      );
      console.log("project", selectedTask);

      getLeadsListUsingProjectId(selectedTask?.projectId);
      setCategoryList(project[0]?.sections);
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

      console.log("selectedTask", selectedTask);

      setTaskFormValue({
        projectId: selectedTask?.projectId,
        leads: selectedTask?.lead[0]?._id || selectedTask?.lead[0],
        section: selectedTask?.section,
        title: selectedTask?.title,
        description: selectedTask?.description,
        assignedTo: selectedTask?.assignedTo?._id || selectedTask?.assignedTo,
        dueDate: dueDateData,
        completedDate: completedDateData ? completedDateData : "",
        priority: selectedTask?.priority,
        status: selectedTask?.status,
        attachments: selectedTask?.attachments,
      });
    } else if (handleProjectId) {
      let project = projectList?.find((item) => item?._id === handleProjectId);
      getLeadsListUsingProjectId(project?._id);
      if (leadLists.length === 1) {
        setSelectedLeads(project?.managedBy);
      }
      setCategoryList(project?.sections);
      setTaskFormValue({
        ...taskFormValue,
        projectId: handleProjectId,

        section: project?.sections?.[0],
      });
    } else if (userDetails.role === "CONTRIBUTOR") {
      setTaskFormValue({ ...taskFormValue, assignedTo: userDetails?.id });
    } else {
      resetFormValue();
    }
  };

  const getProjectList = async () => {
    setLoading(true);
    try {
      const projects = await getAllProjects();
      setLoading(false);
      if (projects.error) {
        return;
      } else {
        setProjectList(projects?.data);
        console.log('-------------------------------')
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

  const onchangeSelectedProject = (e) => {
    let project = projectList.find((el) => el._id === e.target.value);
    setTaskFormValue({
      projectId: project._id,
    });
    setCategoryList(project?.sections);
    getLeadsListUsingProjectId(project._id);
    updateTaskFormValue(e);
  };

  const updateTaskFormValue = (e) => {
    let updateValue = { ...taskFormValue, [e.target.name]: e.target.value };
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
      !taskFormValue.leads 
    ) {
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
      } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      section && (dataToSend["section"] = section);
      title && (dataToSend["title"] = title);
      description && (dataToSend["description"] = description);
      assignedTo && (dataToSend["assignedTo"] = assignedTo);
      dueDate && (dataToSend["dueDate"] = dueDate);
      priority && (dataToSend["priority"] = priority);
      status && (dataToSend["status"] = status);
      leads && (dataToSend["tasklead"] = [leads]);
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      uploadedFiles && (dataToSend["attachments"] = uploadedFiles);

      const taskRes = await createTask(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        setToasterMessage(taskRes?.message||'Error while creating Task')
        setShowToaster(true);
        return;
      } else {
        
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
          leads:""
        });
        setValidated(false);
        setSelectedLeads("");
        setCategoryList([]);
        localStorage.setItem('showTaskToaster','Task Created Succesfully !!')



        setTimeout(() => {
          setShowAddTaskModal(false);

        }, 1000);
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
      !taskFormValue.leads
    ) {
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
      } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      section && (dataToSend["section"] = section);
      title && (dataToSend["title"] = title);
      description && (dataToSend["description"] = description);
      assignedTo && (dataToSend["assignedTo"] = assignedTo);
      dueDate && (dataToSend["dueDate"] = dueDate);
      priority && (dataToSend["priority"] = priority);
      status && (dataToSend["status"] = status);
      leads && (dataToSend["tasklead"] = [leads]);
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      completedDate && (dataToSend["completedDate"] = completedDate);
      uploadedFiles && (dataToSend["attachments"] = uploadedFiles);

      const taskRes = await createTask(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        setToasterMessage(taskRes?.message||'Error while creating Task')
        setShowToaster(true);
        return;
      } else {
        setToasterMessage('Task Created Succesfully')
        setShowToaster(true);
        resetFormValue();
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
      title:taskFormValue?.title,
      description:taskFormValue?.description,
      dueDate:taskFormValue?.dueDate,
      priority:taskFormValue?.priority,
      status:taskFormValue?.status,
      leads: e.target.value,
    });
  };

  const resetModalData = () => {
    closeModal();
    setValidated(false);
    resetFormValue();
    setCategoryList([]);

    setShowAddTaskModal(false);
  };
  const resetFormValue = () => {
    setTaskFormValue({
      projectId: "",
      section: "",
      title: "",
      assignedTo: "",
      dueDate: "",
      completedDate: "",
      priority: priorityList[0],
      status: statusList[0],
      attachments: [],
      leads: "",
    });
    setTimeout(() => {
      document.getElementById("handleresetbuttonid")?.click();
    }, 500);
  };

  const updateTask = async () => {
    setValidated(true);
    if (
      !taskFormValue.projectId ||
      !taskFormValue.section ||
      !taskFormValue.title ||
      !taskFormValue.leads 
    ) {
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
        completedDate,
      } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      section && (dataToSend["section"] = section);
      title && (dataToSend["title"] = title);
      description && (dataToSend["description"] = description);
      assignedTo && (dataToSend["assignedTo"] = assignedTo);
      dueDate && (dataToSend["dueDate"] = dueDate);
      priority && (dataToSend["priority"] = priority);
      status && (dataToSend["status"] = status);
      leads && (dataToSend["tasklead"] = [leads]);
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      completedDate && (dataToSend["completedDate"] = completedDate);
      uploadedFiles && (dataToSend["attachments"] = uploadedFiles);

      const taskRes = await updateTaskDetails(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        setToasterMessage(taskRes?.message||'Error while updating Task')
        setShowToaster(true);
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
        });
        setValidated(false);
        setShowAddTaskModal(false);
        getNewTasks(projectId);
        localStorage.setItem('showTaskToaster','Task Updated Succesfully !!')

      }
    } catch (error) {
      console.log(error);
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
        setToasterMessage(taskRes?.message||'Error while deleting Task')
        setShowToaster(true);
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
        });

        setValidated(false);
        setShowAddTaskModal(false);
        getNewTasks(projectId);
        localStorage.setItem('showTaskToaster','Task Deleted Succesfully !!')

      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return error.message;
    }
  };

  return (
    <>
      <Offcanvas  
        className="Offcanvas-modal"
        style={{width:'800px'}}
        show={showAddTaskModal}
        placement="end"
        onHide={() => resetModalData()}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> {selectedTask ? "Edit Task" : "Add Task"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body  >
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
                    value={taskFormValue.projectId}
                    name="projectId"
                    disabled={
                      selectedTask || handleProjectId || selectedProjectFromTask
                    }
                  >
                    <option value="" disabled>
                      Select Project
                    </option>
                    {projectList?.map((project, index) => (
                      <option value={project._id} key={index}>
                        {project.name}
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
                    value={taskFormValue.section}
                    disabled={selectedProjectFromTask}
                  >
                    <option value="" selected disabled>
                      Select Section
                    </option>
                 
                    {categoryList?.map((section, index) => (
                      <option value={section._id} key={index}>
                        {section.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Section is required !!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Lead</Form.Label>
                  <Form.Control
                    size="lg"
                    required
                    as="select"
                    type="select"
                    onChange={onLeadChange}
                    value={taskFormValue.leads}
                    name="leadId"
                    disabled={
                      selectedTask && taskFormValue?.status === "COMPLETED"
                    }
                  >
                    <option value="">Select Lead</option>
                    {leadLists?.map((project, index) => (
                      <option value={project._id} key={index}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Lead is required !!
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    required
                   
                    type="text"
                    placeholder="Title"
                    value={taskFormValue.title}
                    name="title"
                    onChange={updateTaskFormValue}
                  />

                  <Form.Control.Feedback type="invalid">
                    Title is required !!
                  </Form.Control.Feedback>
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
                  setLoading={setLoading}
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
                    value={taskFormValue.assignedTo}
                  >
                    <option value="">Select User</option>
                    {userList?.map((module, index) => (
                      <option value={module._id} key={index}>
                        {module.name}
                      </option>
                    ))}
                  </Form.Control>
                  
                </Form.Group>
                <Form.Group as={Col} md="3" className="px-0">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    placeholder="Due date"
                    disabled={
                      selectedTask && taskFormValue?.status === "COMPLETED"
                    }
                    name="dueDate"
                    value={taskFormValue.dueDate}
                    onChange={updateTaskFormValue}
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
                    value={taskFormValue.priority}
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

                  <Form.Control
                  required
                    as="select"
                    type="select"
                    name="status"
                    onChange={updateTaskFormValue}
                    value={taskFormValue.status || statusList[0]}
                    disabled={taskFormValue.status === "COMPLETED"}
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    {statusList?.map((status, index) => (
                      <option
                        value={status}
                        disabled={status === "COMPLETED" && !selectedTask}
                        key={index}
                      >
                        {status}
                      </option>
                    ))}
                  </Form.Control>

                </Form.Group>
                {taskFormValue?.status === "COMPLETED" && (
                  <Form.Group as={Col} md="4">
                    <Form.Label>Completed Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Completed date"
                      name="completedDate"
                      onChange={updateTaskFormValue}
                      value={taskFormValue.completedDate}
                      disabled={taskFormValue.status === "COMPLETED"}
                    />
                  </Form.Group>
                )}
              </Row>

              <div className="addFormBtn">
                {!selectedTask && (
                  <Button
                    className=" btn-press  btn-gradient-border btnDanger"
                    type="button"
                    onClick={submitTask}
                  >
                    Create
                  </Button>
                )}
                {selectedTask && (
                  <div>
                    <Button
                      className=" btn-press  btn-gradient-border btnDanger"
                      type="button"
                      onClick={updateTask}
                    >
                      Update
                    </Button>
                    <Button
                      className=" btn-press  btn-gradient-border btnDanger"
                      type="button"
                      onClick={deleteTask}
                    >
                      Delete Task
                    </Button>
                  </div>
                )}
                {!selectedTask && !selectedProjectFromTask &&   !(selectedTask || handleProjectId || selectedProjectFromTask)&&(
                  <Button
                    className="btn-press btn-gradient-border btnDanger"
                    type="button"
                    onClick={submitTaskAnother}
                  >
                    Create And Add Another
                  </Button>
                )}
              </div>
            </Form>
            {toaster && (
              <Toaster
                message={toasterMessage}
                show={toaster}
                close={() => showToaster(false)}
              />
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {loading ? <Loader /> : null}
    </>
  );
}
