/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";

import { Modal } from "react-bootstrap";
import {
  getAllProjects,
  createTask,
  updateTaskDetails,
  getProjectDetailsById,
  getProjectById,
  deleteTaskDetails,
} from "../../../services/user/api";
// import {deleteTaskDetails} from '../../../services/user/api'
import Toaster from "../../../components/Toaster";
import { CONSTENTS } from "../../../constents";
import Select from "react-select";
import TextEditor from "./textEditor";
import { getAllLeadsWithoutPagination } from "../../../services/user/api";
import { useAuth } from "../../../auth/AuthProvider";
export default function AddTaskModal(props) {
  const {
    selectedProjectFromTask,
    getNewTasks,
    showAddTask,
    closeModal,
    selectedTask,
    handleProjectId,
  } = props;
  console.log(handleProjectId, "-----------");
  const statusList = CONSTENTS.statusList;
  const priorityList = CONSTENTS.priorityList;
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState();
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [validated, setValidated] = useState(false);
  const [leadLists, setLeadList] = useState([]);

  const { userDetails } = useAuth();
  console.log(userDetails, "userDetails");

  // const
  // const leadList = [{name : 'Lead 1', _id : '1'}, {name : 'Lead 2', _id : '2'}, {name : 'Lead 3', _id : '3'}]
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
    attachment: "",
    tasklead: "",
  };
  const [taskFormValue, setTaskFormValue] = useState(taskFormFields);

  console.log(taskFormValue, "taskFormValue");

  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");
  const [selectedLeads, setSelectedLeads] = useState();

  useEffect(() => {
    console.log(showAddTask);
    // getLeadsList();
    getProjectList();
  }, []);

  useEffect(() => {
	taskFormValue.projectId && getUsersList()
  }, [taskFormValue.projectId]);


  useEffect(() => {
    if (showAddTask) {
      setShowAddTaskModal(true);
      setSelectedLeads("");
      patchFormForAdd();
    }
  }, [showAddTask]);

  useEffect(() => {
    if (showAddTask) {
      setShowAddTaskModal(true);
      patchFormForAdd();
    }
  }, [showAddTask]);

  const getUsersList = async function () {
	let dataToSend = {
	  projectId: taskFormValue.projectId,
	};
	setLoading(true);
	try {
	  const user = await getProjectById(dataToSend);
	  setLoading(false);
	  if (user.error) {
		setToasterMessage(user?.message || "Something Went Wrong");
		setShowToaster(true);
	  } else {
		console.log(user, "user");
		setCategoryList(user?.data?.sections);
	}
	} catch (error) {
	  setToasterMessage(error?.message || "Something Went Wrong");
	  setShowToaster(true);
	  setLoading(false);
	  return error.message;
	}
  };

  const patchFormForAdd = () => {
    if (selectedProjectFromTask) {
      console.log(selectedProjectFromTask, "selectedProjectFromTask");
      let project = projectList?.filter(
        (item) => item?._id == selectedProjectFromTask?._id
      );
      console.log(project, projectList, selectedProjectFromTask);
    //   setCategoryList(project[0]?.sections);
      setUserList(project[0]?.accessibleBy);
      setSelectedLeads(project[0]?.managedBy);
      setTaskFormValue({
        ...taskFormValue,
        projectId: project[0]?._id,
        // section: selectedProjectFromTask?.section || project[0]?.sections?.[0],
      });
      console.log(project);
    } else if (selectedTask) {
      let project = projectList?.filter(
        (item) => item?._id == selectedTask?.projectId
      );
      console.log(selectedTask, project);
      setLeadList(project[0]?.managedBy);

      setCategoryList(project[0]?.sections);
      setUserList(project[0]?.accessibleBy);

      //   let leads = [];
      console.log(
        selectedTask?.lead,
        project[0]?.managedBy,
        "selectedTask?.lead"
      );
      //   if (selectedTask?.lead?.length) {

      //     leads = leadLists?.filter((item) =>
      //       selectedTask?.lead?.includes(item?._id)
      //     );
      //   }

      //   setTaskFormValue()
      let dueDateData = new Date(selectedTask?.dueDate);
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
        section: selectedTask?.section,
        title: selectedTask?.title,
        description: selectedTask?.description,
        assignedTo: selectedTask?.assignedTo?._id
          ? selectedTask?.assignedTo?._id
          : selectedTask?.assignedTo,
        dueDate: dueDateData,
        completedDate: completedDateData ? completedDateData : "",
        priority: selectedTask?.priority,
        status: selectedTask?.status,
        attachment: selectedTask?.attachment,
      });
      console.log(selectedTask?.lead, "selectedTask?.lead", leadLists);
      let leads = project[0]?.managedBy?.filter((item) =>
        selectedTask?.lead?.includes(item?._id)
      );
      console.log(leads, "leads");
      setSelectedLeads(leads || []);
    } else if (handleProjectId) {
      let project = projectList?.find((item) => item?._id == handleProjectId);
      console.log("MAI AAAYA HU IDHAR", project);
      setLeadList(project?.managedBy);
      if (leadLists.length === 1) {
        setSelectedLeads(project?.managedBy);
      }
      setCategoryList(project?.sections);
      setUserList(project?.accessibleBy);

      setTaskFormValue({
        ...taskFormValue,
        projectId: handleProjectId,
        assignedTo: userDetails?.id,
        section: project?.sections?.[0],
      });
    } else if (userDetails.role == "CONTRIBUTOR") {
      setTaskFormValue({ ...taskFormValue, assignedTo: userDetails?.id });
    } else {
      console.log("else");
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
        // setCategoryList(projects.data[0]?.sections);
        // setUserList(projects.data[0]?.accessibleBy);
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const onchangeSelectedProject = (e) => {
    let project = projectList.find((el) => el._id === e.target.value);
    setTaskFormValue({
      ...taskFormFields,
      projectId: project._id,
    });
    setSelectedLeads("");
    setCategoryList(project?.sections);
    setUserList(project?.accessibleBy);
    setLeadList(project?.managedBy);
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
    console.log(
      taskFormValue,
      "---------------taskFormValue-----------------------------------------"
    );
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
      !taskFormValue.assignedTo ||
      !selectedLeads
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
        tasklead,
        attachment,
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
      selectedLeads &&
        (dataToSend["tasklead"] = selectedLeads.map((item) => item?._id));
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);

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
          attachment: "",
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
      !taskFormValue.assignedTo ||
      !selectedLeads
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
        tasklead,
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
      selectedLeads &&
        (dataToSend["tasklead"] = selectedLeads.map((item) => item?._id));
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      completedDate && (dataToSend["completedDate"] = completedDate);

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
          attachment: "",
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
  const onLeadChange = (users) => {
    console.log(users);
    let leads = users?.map((item) => item?._id);
    setSelectedLeads(users);
    setTaskFormValue({
      ...taskFormValue,
      tasklead: leads,
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
      attachment: "",
      tasklead: "",
    });
  };

  const updateTask = async () => {
    console.log("hello ji ");
    setValidated(true);
    console.log(taskFormValue, "taskFormValue");

    if (
      !taskFormValue.projectId ||
      !taskFormValue.section ||
      !taskFormValue.title ||
      !taskFormValue.assignedTo ||
      !selectedLeads
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
        tasklead,
        attachment,
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
      selectedLeads &&
        (dataToSend["tasklead"] = selectedLeads.map((item) => item?._id));
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      completedDate && (dataToSend["completedDate"] = completedDate);

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
          attachment: "",
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
      let {
        projectId,
        section,
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status,
        tasklead,
        attachment,
        completedDate,
      } = taskFormValue;
      let dataToSend = {};
      projectId && (dataToSend["projectId"] = projectId);
      //   section && (dataToSend["section"] = section);
      //   title && (dataToSend["title"] = title);
      //   description && (dataToSend["description"] = description);
      //   assignedTo && (dataToSend["assignedTo"] = assignedTo);
      //   dueDate && (dataToSend["dueDate"] = dueDate);
      //   priority && (dataToSend["priority"] = priority);
      //   status && (dataToSend["status"] = status);
      //   selectedLeads && (dataToSend["tasklead"] = selectedLeads.map((item) => item?._id));
      selectedTask && (dataToSend["taskId"] = selectedTask?._id);
      //   completedDate && (dataToSend["completedDate"] = completedDate);
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
          attachment: "",
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
              <Row className="mb-3">
                <Form.Group as={Col} md="6">
                  <Form.Label>Project</Form.Label>
                  <Form.Control
                    size="lg"
                    required
                    as="select"
                    type="select"
                    onChange={onchangeSelectedProject}
                    value={taskFormValue.projectId}
                    name="projectId"
                    disabled={selectedTask || handleProjectId}
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
                    Task List is required !!
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
                    Task List is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Lead</Form.Label>
                  {/* <Form.Control
                      required
                      as="select"
                      type="select"
                      name="tasklead"
                      onChange={updateTaskFormValue}
                      value={taskFormValue.tasklead}
                    >   */}
                  <Select
                    isMulti
                    value={selectedLeads}
                    onChange={onLeadChange}
                    getOptionLabel={(options) => options["name"]}
                    getOptionValue={(options) => options["_id"]}
                    options={leadLists}
                  />
                  {/* <option value="" disabled>
                        Select Lead
                      </option>
                      {leadLists?.map((lead) => (
                        <option value={lead?._id} key={lead?._id}>
                          {lead?.name}
                        </option>
                      ))}
					</Form.Control> */}
                  <Form.Control.Feedback type="invalid">
                    Task List is required !!
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
                {/* <FroalaEditorComponent
                  tag="textarea"
                  onModelChange={updateTaskDescriptionValue}
                  model={taskFormValue?.description}
                /> */}

                <TextEditor
                  width="100%"
                  placeholder="Enter Description"
                  value={taskFormValue?.description}
                  onChange={updateTaskDescriptionValue}
                />
              </Row>

              <Row className="mb-3 mt-5">
                <Form.Group as={Col} md="3">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control
                    required
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
                  <Form.Control.Feedback type="invalid">
                    Assigned To is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" className="px-0">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    placeholder="Due date"
                    disabled={selectedTask}
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
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    {statusList?.map((status) => (
                      <option
                        value={status}
                        disabled={status === "COMPLETED"}
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
    </>
  );
}
