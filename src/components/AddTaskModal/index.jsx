/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import * as Yup from "yup";
import "./index.css";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import AttachmentUploader from "./attachment";
import {
  getAllProjects,
  createTask,
  updateTaskDetails,
  getCategoriesProjectById,
  getLeadsUsingProjectId,
  getUserUsingProjectId,
  deleteTaskDetails,
  updateTaskStatusById,
} from "@services/user/api";

// import { CONSTANTS } from "../../../constants";
import TextEditor from "./textEditor";
// import { useAuth } from "../../../auth/AuthProvider";
import Loader from "../Shared/Loader";
import Offcanvas from "react-bootstrap/Offcanvas";
import { toast } from "react-toastify";
import { CONSTANTS } from "../../constants";
import { useAuth } from "../../utlis/AuthProvider";
import { useMutation, useQuery } from "react-query";

const validationSchema = Yup.object({
  projectId: Yup.string().required("Project is required !!"),
  section: Yup.string().required("Section is required !!"),
  leads: Yup.string().required("Lead is required !!"),
  title: Yup.string().required("Title is required !!"),
  defaultTaskTime: Yup.object()
    .shape({
      hours: Yup.number().min(0, "Invalid hours").max(23, "Invalid hours"),
      minutes: Yup.number()
        .min(0, "Invalid minutes")
        .max(59, "Invalid minutes"),
    })
    .test(
      "time-test",
      "Estimated time is required!!",
      (value) => value.hours || value.minutes
    ),
  miscType: Yup.string().when("section", {
    is: (section) => section === "Misc",
    then: Yup.string().required("Miscellaneous type is required !!"),
  }),
  dueDate: Yup.string().required("Due date is required"),
});

export default function AddTaskModal(props) {
  const {
    selectedProjectFromTask,
    showAddTask,
    closeModal,
    selectedTask,
    handleProjectId,
    selectedSection,
  } = props;
  const statusList = CONSTANTS.statusList;
  const priorityList = CONSTANTS.priorityList;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnotherTask, setIsAnotherTask] = useState(false);
  const miscTypeArray = CONSTANTS.MISCTYPE;
  const [isResetAttachment, setIsResetAttachment] = useState(false);
  // const [categoryList, setCategoryList] = useState([]);
  // const [leadLists, setLeadLists] = useState([]);
  // const [userList, setUserList] = useState([]);
  const [selectedSectionName, setSelectedSectionName] = useState(null);

  const uploadedAttachmentsArray = (uploadedFiles) => {
    setUploadedFiles(uploadedFiles);
  };

  const formik = useFormik({
    initialValues: {
      projectId: "",
      section: "",
      description: "",
      miscType: "",
      leads: "",
      title: "",
      defaultTaskTime: {
        hours: "",
        minutes: "",
      },
      assignedTo: "",
      dueDate: "",
      completedDate: new Date().toISOString().split("T")[0],
      priority: priorityList[0],
      status: statusList[0],
      showMiscType: false,
    },
    validationSchema: validationSchema,
    validate: (values) => {
      let errors = {};
      if (selectedSectionName === 'Misc' && !values.miscType) {
        errors.miscType = 'Misc Type is required !!';
      }
      return errors;
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values, params) => {
    console.log("called");
    let {
      projectId,
      section,
      description,
      leads,
      title,
      defaultTaskTime,
      assignedTo,
      dueDate,
      priority,
      status,
      miscType,
      completedDate,
    } = values;
    const dataToSend = {};
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
    status === "Completed" &&
      completedDate &&
      (dataToSend["completedDate"] = formDateNightTime(completedDate));
    console.log(dataToSend, "dataToSend");
    if (selectedTask) {
      updateTaskMutation.mutate(dataToSend);
      return;
    } else {
      addTaskMutation.mutate(dataToSend);
      return;
    }
  };

  const resetModalData = () => {
    formik.resetForm();
    setUploadedFiles([]);
    setIsResetAttachment(true);
    closeModal();
  };

  /*
  @get project list
  */

  const { data: projectList, isLoading } = useQuery(
    ["projectList", showAddTask],
    () => getAllProjects(),
    {
      enabled: showAddTask,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data;
      },
    }
  );

  /*
  @get category list
  */
  const {
    data: categoryList,
    isLoading: isLoadingCategory,
    isFetching: isFetchingCategory,
  } = useQuery(
    ["categoryList", formik.values.projectId],
    () => getCategoriesProjectById({ projectId: formik.values.projectId }),
    {
      enabled: !!formik.values.projectId,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data;
      },
    }
  );

  /*
  @get lead list
  */

  const {
    isLoading: isLoadingLead,
    data: leadLists,
    isFetching: isFetchingLead,
  } = useQuery(
    ["leadLists", formik.values.projectId],
    () => getLeadsUsingProjectId({ projectId: formik.values.projectId }),
    {
      enabled: !!formik.values.projectId,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data;
      },
    }
  );

  /*
  @get user list
  */

  const { isLoading: isLoadingUser, data: userList } = useQuery(
    ["userList", formik.values.projectId, formik.values.leads],
    () =>
      getUserUsingProjectId({
        projectId: formik.values.projectId,
        selectedLeadRole: formik.values.leads,
      }),
    {
      enabled: !!formik.values.projectId && !!formik.values.leads,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data;
      },
    }
  );

  /*  @addTask */
  const addTaskMutation = useMutation(createTask, {
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data?.message);
        return;
      } else {
        resetModalData();
        toast.dismiss();
        toast.success(data?.message);
        if (!isAnotherTask) {
          closeModal();
          return;
        }
        setIsAnotherTask(false);
      }
    },
  });

  /*  @updateTask */
  const updateTaskMutation = useMutation(updateTaskDetails, {
    onSuccess: (data) => {
      if (data.error) {
        toast.dismiss();
        toast.error(data?.message);
        return;
      } else {
        resetModalData();
        closeModal();
        toast.dismiss();
        toast.success(data?.message);
      }
    },
  });

  /*  @deleteTask */
  const deleteTaskMutation = useMutation(deleteTaskDetails, {
    onSuccess: (data) => {
      if (data.error) {
        toast.dismiss();
        toast.error(data?.message);
        return;
      } else {
        resetModalData();
        closeModal();
        toast.dismiss();
        toast.success(data?.message);
      }
    },
  });

  const deleteTask = async () => {
    let dataToSend = {
      taskId: selectedTask?._id,
    };
    deleteTaskMutation.mutate(dataToSend);
  };

  const updateTaskDescriptionValue = (value) => {
    formik.setFieldValue("description", value);
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
    return localTimeString;
  }

  useEffect(() => {
    const section = categoryList?.find(
      (section) => section._id === formik.values.section
    );
    setSelectedSectionName(section?.name || null);
  }, [formik.values.section, categoryList]);

  useEffect(() => {
    if(selectedSectionName !== 'Misc'){
      formik.setFieldValue('miscType', '', false);
    }
  }, [selectedSectionName]);

  useEffect(() => {
    if (selectedProjectFromTask) {
      formik.setFieldValue("projectId", selectedProjectFromTask);
    }
  }, [selectedProjectFromTask]);

  // if selectedSection is true then we have to set the project id and section
  useEffect(() => {
    if (selectedSection) {
      formik.setFieldValue("projectId", selectedSection._id);
      formik.setFieldValue("section", selectedSection.section);
    }
  }, [selectedSection]);

  // if selectedTask then we have to set the values
  useEffect(() => {
    console.log(selectedTask, "selectedTask");
    if (selectedTask) {
      formik.setFieldValue("projectId", selectedTask?.projectId);
      formik.setFieldValue("section", selectedTask?.section);
      formik.setFieldValue(
        "leads",
        selectedTask?.lead[0]._id || selectedTask?.lead[0]
      );
      formik.setFieldValue("assignedTo", selectedTask?.assignedTo?._id);
      formik.setFieldValue("description", selectedTask?.description);
      formik.setFieldValue("miscType", selectedTask?.miscType) ;
      formik.setFieldValue("title", selectedTask.title);
      formik.setFieldValue(
        "defaultTaskTime.hours",
        selectedTask?.defaultTaskTime?.hours
      );
      formik.setFieldValue(
        "defaultTaskTime.minutes",
        selectedTask?.defaultTaskTime?.minutes
      );
      let dueDateData = new Date(selectedTask?.dueDate?.split("T")[0]);
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
      formik.setFieldValue("dueDate", dueDateData);
      let completedDate = new Date(selectedTask?.completedDate?.split("T")[0]);
      completedDate =
        completedDate.getFullYear() +
        "-" +
        (completedDate.getMonth() + 1 <= 9
          ? "0" + (completedDate.getMonth() + 1)
          : completedDate.getMonth() + 1) +
        "-" +
        (completedDate.getDate() <= 9
          ? "0" + completedDate.getDate()
          : completedDate.getDate());
      formik.setFieldValue("completedDate", completedDate);
      formik.setFieldValue("priority", selectedTask?.priority);
      formik.setFieldValue("status", selectedTask?.status);
    }
  }, [selectedTask]);
  

  return (
    <>
      <Offcanvas
        className="Offcanvas-modal"
        style={{ width: "800px" }}
        show={showAddTask}
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
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Project </Form.Label>
                  <Form.Control
                    as="select"
                    name="projectId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.projectId}
                    disabled={
                      selectedTask  || selectedProjectFromTask
                    }
                  >
                    <option selected value="" disabled>
                      Select Project
                    </option>
                    {projectList?.map((project, index) => (
                      <option value={project?._id} key={index}>
                        {project?.name}
                      </option>
                    ))}
                  </Form.Control>
                  {formik.touched.projectId && formik.errors.projectId ? (
                    <div className="text-danger pull-right">
                      {formik.errors.projectId}
                    </div>
                  ) : null}
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Section</Form.Label>
                  <Form.Control
                    size="lg"
                    as="select"
                    name="section"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.section}
                  >
                    <option selected value="" disabled>
                      {isLoadingCategory || isFetchingCategory
                        ? "Loading..." || "Refreshing..."
                        : "Select Section"}
                    </option>
                    {categoryList?.map((section, index) => (
                      <option value={section?._id} key={index}>
                        {section?.name}
                      </option>
                    ))}
                  </Form.Control>
                  {formik.touched.section && formik.errors.section ? (
                    <div className="text-danger pull-right">
                      {formik.errors.section}
                    </div>
                  ) : null}
                </Form.Group>

                {/*  */}

                {/* if taskFormValue.section ==="" */}

                {selectedSectionName === "Misc" && (
                  <Form.Group as={Col} md="6">
                    <Form.Label>Misc Type</Form.Label>
                    <Form.Control
                      size="lg"
                      as="select"
                      name="miscType"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.miscType}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {miscTypeArray?.map((miscType, index) => (
                        <option value={miscType} key={index}>
                          {miscType}
                        </option>
                      ))}
                    </Form.Control>
                    {formik.touched.miscType && formik.errors.miscType ? (
                      <div className="text-danger pull-right">
                        {formik.errors.miscType}
                      </div>
                    ) : null}
                  </Form.Group>
                )}

                {/*  */}
                <Form.Group as={Col} md="12">
                  <Form.Label>Lead</Form.Label>
                  <Form.Control
                    size="lg"
                    as="select"
                    name="leads"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.leads}
                    disabled={
                      selectedTask && formik.values.status === "COMPLETED"
                    }
                  >
                    <option value="">
                      {" "}
                      {isLoadingLead || isFetchingLead
                        ? "Loading..." || "Refreshing..."
                        : "Select Lead"}
                    </option>
                    {leadLists?.map((project, index) => (
                      <option value={project?._id} key={index}>
                        {project?.name}
                      </option>
                    ))}
                  </Form.Control>
                  {formik.touched.leads && formik.errors.leads ? (
                    <div className="text-danger pull-right">
                      {formik.errors.leads}
                    </div>
                  ) : null}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="7">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Title"
                    name="title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-danger pull-right">
                      {formik.errors.title}
                    </div>
                  ) : null}
                </Form.Group>
                <Form.Group as={Col} md="5">
                  <Form.Label>Estimated Time</Form.Label>
                  <div className="d-flex flexWrap">
                    <Form.Control
                      className="timeWth"
                      type="number"
                      max="23"
                      min="0"
                      placeholder="Hours"
                      name="defaultTaskTime.hours"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.defaultTaskTime.hours}
                    />
                    <span className="mx-2 centerColon">:</span>
                    <Form.Control
                      className="timeWth"
                      type="number"
                      max="59"
                      min="0"
                      placeholder="Minutes"
                      name="defaultTaskTime.minutes"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.defaultTaskTime.minutes}
                      onWheel={(e) => e.preventDefault()}
                    />
                  </div>
                  {formik.errors.defaultTaskTime &&
                  formik.touched.defaultTaskTime ? (
                    <div className="text-danger pull-right">
                      {formik.errors.defaultTaskTime}
                    </div>
                  ) : null}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <TextEditor
                  width="100%"
                  placeholder="Enter Description"
                  value={formik.values.description}
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
                    name="assignedTo"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.assignedTo}
                  >
                    <option value="">
                      {isLoadingUser ? "Loading..." : "Select User"}
                    </option>
                    {userList?.map((module, index) => (
                      <option value={module?._id} key={index}>
                        {module?.name}
                      </option>
                    ))}
                  </Form.Control>
                  {formik.touched.assignedTo && formik.errors.assignedTo ? (
                    <div className="text-danger pull-right">
                      {formik.errors.assignedTo}
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    name="dueDate"
                    disabled={
                      selectedTask && formik.values.status === "COMPLETED"
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.dueDate}
                  />
                  {formik.touched.dueDate && formik.errors.dueDate ? (
                    <div className="text-danger pull-right">
                      {formik.errors.dueDate}
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    name="priority"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.priority || priorityList[0]}
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
                  {formik.touched.priority && formik.errors.priority ? (
                    <div className="text-danger pull-right">
                      {formik.errors.priority}
                    </div>
                  ) : null}
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
                      as="select"
                      name="status"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.status || statusList[0]}
                      disabled={formik.values.status === "COMPLETED"}
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
                  {formik.touched.status && formik.errors.status ? (
                    <div className="text-danger pull-right">
                      {formik.errors.status}
                    </div>
                  ) : null}
                </Form.Group>

                {formik.values.status === "COMPLETED" && (
                  <Form.Group as={Col} md="4">
                    <Form.Label>Completed Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="completedDate"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.completedDate}
                      disabled={formik.values.status === "COMPLETED"}
                    />
                    {formik.touched.completedDate &&
                    formik.errors.completedDate ? (
                      <div className="text-danger pull-right">
                        {formik.errors.completedDate}
                      </div>
                    ) : null}
                  </Form.Group>
                )}
              </Row>

              <div className="addFormBtn">
                {!selectedTask && (
                  <Button
                    className="btn btn-primary"
                    type="button"
                    onClick={formik.handleSubmit}
                  >
                    Create
                  </Button>
                )}
                {selectedTask && (
                  <div>
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={formik.handleSubmit}
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
                      onClick={() => {
                        formik.handleSubmit;
                        setAddAnother(true);
                      }}
                    >
                      Create And Add Another
                    </Button>
                  )}
              </div>
            </Form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
