/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import AttachmentUploader from "./attachment";
import { Modal } from "react-bootstrap";
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
export default function AddTaskModal(props) {
  const {
    selectedProjectFromTask,
    getNewTasks,
    showAddTask,
    closeModal,
    selectedTask,
    handleProjectId,
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
      setShowAddTaskModal(true);
      patchFormForAdd();
    }
  }, [showAddTask]);

  const patchFormForAdd = () => {
    if (selectedProjectFromTask) {
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

      setTaskFormValue({
        projectId: selectedTask?.projectId,
        leads: selectedTask?.lead[0],
        section: selectedTask?.section,
        title: selectedTask?.title,
        description: selectedTask?.description,
        assignedTo: selectedTask?.assignedTo?._id,
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
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setProjectList(projects.data);
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
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
        setToasterMessage(leads?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setLeadList(leads?.data);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
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
        setToasterMessage(users?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setUserList(users?.data);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
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
        setToasterMessage(taskRes?.error?.message || "Something Went Wrong");
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
        });
        setValidated(false);
        setSelectedLeads("");
        setShowAddTaskModal(false);
        getNewTasks(projectId);
        showToaster(true);
        setToasterMessage("Task Created Successfully");
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
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
        setToasterMessage(taskRes?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setTaskFormValue({
          ...taskFormValue,
          title: "",
          description: null,
          assignedTo: "",
          dueDate: "",
          completedDate: "",
          priority: "",
          status: "",
          attachments: [],
        });
        setValidated(false);
        setSelectedLeads("");
        setShowAddTaskModal(true);
        getNewTasks(projectId);
        showToaster(true);
        setToasterMessage("Task Created Successfully");
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const onLeadChange = (e) => {
    setTaskFormValue({
      ...taskFormFields,
      projectId: taskFormValue?.projectId,
      section: taskFormValue?.section,
      leads: e.target.value,
    });
  };

  const resetModalData = () => {
    closeModal();
    setValidated(false);
    resetFormValue();

    setShowAddTaskModal(false);
  };
  const resetFormValue = () => {
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
      tasklead: "",
    });
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
        setToasterMessage(taskRes?.error?.message || "Something Went Wrong");
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
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
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
        setToasterMessage(taskRes?.error?.message || "Something Went Wrong");
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
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  return (
    <>
      <Modal
        width={800}
        show={showAddTaskModal}
        size="xl"
        className="taskModalForm"
        aria-labelledby="contained-modal-title-vcenter"
        onHide={() => resetModalData()}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {" "}
            {selectedTask ? "Edit Task" : "Add Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    {projectList?.map((project) => (
                      <option value={project._id} key={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Project is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Section</Form.Label>
                  <Form.Control
                    size="lg"
                    required
                    as="select"
                    type="select"
                    name="section"
                    onChange={updateTaskFormValue}
                    value={taskFormValue.section}
                    disabled={selectedProjectFromTask}
                  >
                    <option value="" disabled>
                      Select Section
                    </option>
                    {categoryList?.map((section) => (
                      <option value={section._id} key={section._id}>
                        {section.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Section is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                  >
                    <option value="">Select Lead</option>
                    {leadLists?.map((project) => (
                      <option value={project._id} key={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Lead is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    required
                    size="lg"
                    type="text"
                    placeholder="Title"
                    value={taskFormValue.title}
                    name="title"
                    onChange={updateTaskFormValue}
                  />

                  <Form.Control.Feedback type="invalid">
                    Title is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                    {userList?.map((module) => (
                      <option value={module._id} key={module._id}>
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
                    as="select"
                    type="select"
                    name="priority"
                    onChange={updateTaskFormValue}
                    value={taskFormValue.priority}
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    {priorityList.map((priority) => (
                      <option value={priority} key={priority}>
                        {priority}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="3" className="ps-0">
                  <Form.Label>Status</Form.Label>

                  <Form.Control
                    as="select"
                    type="select"
                    name="status"
                    onChange={updateTaskFormValue}
                    value={taskFormValue.status || statusList[0]}
                    disabled={taskFormValue?.status === "COMPLETED"}
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    {statusList?.map((status) => (
                      <option
                        value={status}
                        disabled={status === "COMPLETED" && !selectedTask}
                        key={status}
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
                      disabled={selectedTask.status === "COMPLETED"}
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
                {!selectedTask && (
                  <Button
                    className="btn-press btn-gradient-border btnDanger"
                    type="button"
                    onClick={submitTaskAnother}
                  >
                    {" "}
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
        </Modal.Body>
      </Modal>
      {loading ? <Loader /> : null}
    </>
  );
}
