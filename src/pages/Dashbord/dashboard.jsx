/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect } from "react";
import "./dashboard.css";
import Col from "react-bootstrap/Col";
import Loader from "@components/Shared/Loader";
import {
  editLogedInUserDetails,
  reopenTaskById,
  verifyTaskById,
  updateTaskStatusById,
} from "@services/user/api";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "@components/AddTaskModal";
import AddRatingModal from "@components/add-rating-modal";
import UserForm from "../edit-profile";
import ViewTaskModal from "@components/view-task";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Row,
  Container,
  Nav,
  Dropdown,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import ProjectGrid from "@components/FreeResource/projectGrid";
import { toast } from "react-toastify";
import TaskVerificationComponent from "@components/TaskVerificationComponent/TaskVerificationComponent";
import OverdueWorkComponent from "@components/OverdueWorkComponent/OverdueWorkComponent";
import MyWorkComponent from "@components/MyWorkComponent/MyWorkComponent";
import { useAuth } from "../../utlis/AuthProvider";
import { useMutation } from "react-query";
import ProjectList from "@components/ProjectList/projectList";
import Teamwork from "@components/TeamWork/teamWork";

const validationSchema = Yup.object().shape({
  comment: Yup.string().required("Comment is required"),
});

export default function Dashboard(props) {
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedTask, setSelectedTask] = useState({});
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showModalOnLogin, setShowModalOnLogin] = useState(true);
  const [showViewTask, setShowViewTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const { userDetails } = useAuth();
  const [isChange, setIsChange] = useState(undefined);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [verifyTaskId, setVerifyTaskId] = useState("");
  const [showUserGrid, setShowUserGrid] = useState(false);
  const verifyTaskNotAllowedRoles = ["CONTRIBUTOR", "GUEST"];

  const [isRefetch, setIsRefetch] = useState(false);

  // Reopen Task
  const [reopenTaskModal, setReopenTaskModal] = useState(false);
  const [newDueDate, setNewDueDate] = useState("");
  const [showNewDueDateField, setShowNewDueDateField] = useState(false);
  const [reopenTaskId, setReopenTaskId] = useState(null);

  const setToasterMessageToDashboard = (message) => {
    toast.dismiss();
    toast.info(message);
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
      comment: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const dataToSend = {
        taskId: verifyTaskId,
        status: "VERIFIED",
        verificationsComments: values.comment,
      };
      verifyTaskApi.mutate(dataToSend);
    },
  });

  const verifyTaskApi = useMutation(verifyTaskById, {
    onSuccess: (data) => {
      if (data.error) {
        toast.info(
          data?.message || "Something Went Wrong While Updating Task Status"
        );
      } else {
        toast.info("Task Verified Successfully");
        onInit();
        setShowModal(false);
      }
    },
    onError: (error) => {
      toast.info(
        error?.message || "Something Went Wrong While Updating Task Status"
      );
    },
  });

  useEffect(() => {
    setShowModalOnLogin(
      localStorage.getItem("profileCompleted") === "false" ? true : false
    );
    onInit();
  }, []);

  function onInit() {
    setIsRefetch(!isRefetch);
    setLoading(true);
    Promise.allSettled([]).then((results) => {
      const rejectedPromises = results.filter(
        ({ status }) => status === "rejected"
      );
      const errorMessages = rejectedPromises.map(({ reason }) => reason);
      console.log(errorMessages, "error");
      console.log(rejectedPromises, "rejected");
    });
    setLoading(false);
  }

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

  const getNewTasks = (data) => {
    getAndSetAllProjects();
  };

  const closeModal = () => {
    setShowAddTask(false);
    setSelectedProject();
    setSelectedTask();
    onInit();
    if (userDetails?.role !== "CONTRIBUTOR") {
      setIsChange(!isChange);
    }
  };

  const openAddtask = (project) => {
    setSelectedTask();
    setSelectedProject(project);
    setShowAddTask(true);
  };

  const handleStatusChange = (e, taskId, status) => {
    const newStatus = status;
    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    };
    updateTaskStatusApi.mutate(dataToSend);
  };

  const updateTaskStatusApi = useMutation(updateTaskStatusById, {
    onSuccess: (data) => {
      if (data.error) {
        toast.info(
          data?.message || "Something Went Wrong While Updating Task Status"
        );
      } else {
        toast.info("Task Status Updated Successfully");
        onInit();
        if (userDetails?.role !== "CONTRIBUTOR") {
          setIsChange(!isChange);
        }
      }
    },
    onError: (error) => {
      toast.info(
        error?.message || "Something Went Wrong While Updating Task Status"
      );
    },
  });

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
    setSelectedTaskId(taskId);
    setShowViewTask(true);
  };

  const openReopenTaskModal = (taskId) => {
    setReopenTaskId(taskId._id);
    setReopenTaskModal(true);
  };

  const closeReopenTaskModal = () => {
    setReopenTaskModal(false);
    setReopenTaskId(null);
    setShowNewDueDateField(false);
    setNewDueDate("");
  };

  const handleReopenConfirmation = () => {
    setShowNewDueDateField(true);
  };

  const handleNewDueDate = (e) => {
    const selectedDueDate = e.target.value;
    setNewDueDate(selectedDueDate);
  };

  const handleSubmit = async () => {
    if (newDueDate === "") {
      toast.dismiss();
      toast.info("Please Select New Due Date");
      return;
    }

    let dataToSend = {
      taskId: reopenTaskId,
      dueDate: newDueDate,
    };

    reopenTaskMutation.mutate(dataToSend);
  };

  // Define the mutation
  const reopenTaskMutation = useMutation(reopenTaskById, {
    onSuccess: (data) => {
      toast.dismiss();
      toast.info(data?.message || "Task Reopened Successfully");
      onInit();

      if (userDetails?.role !== "CONTRIBUTOR") {
        setIsChange(!isChange);
      }
      closeReopenTaskModal();
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    },
  });

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

        {userDetails?.role !== "GUEST" && (
          <>
            <ProjectList
              openAddtask={openAddtask}
              handleToRedirectTask={handleToRedirectTask}
              showAllProjects={showAllProjects}
              setShowAllProjects={() => setShowAllProjects(!showAllProjects)}
            />
            {showAddTask && (
              <AddTaskModal
                selectedProjectFromTask={selectedProject?._id}
                selectedTask={selectedTask}
                getNewTasks={getNewTasks}
                showAddTask={showAddTask}
                closeModal={closeModal}
                setToasterMessageToDashboard={setToasterMessageToDashboard}
              />
            )}
          </>
        )}

        <Row className="mt-3">
          {(userDetails?.role === "SUPER_ADMIN" ||
            userDetails?.role === "ADMIN") && (
            <OverdueWorkComponent
              userDetails={userDetails}
              handleViewDetails={handleViewDetails}
              handleStatusChange={handleStatusChange}
              daysSince={daysSince}
              isRefetch={isRefetch}
            />
          )}

          {(userDetails?.role === "CONTRIBUTOR" ||
            userDetails?.role === "LEAD") && (
            <MyWorkComponent
              userDetails={userDetails}
              handleViewDetails={handleViewDetails}
              handleStatusChange={handleStatusChange}
              setSelectedProject={setSelectedProject}
              setShowAddTask={setShowAddTask}
              setSelectedTask={setSelectedTask}
              isRefetch={isRefetch}
            />
          )}

          {userDetails?.role !== "GUEST" && (
            <TaskVerificationComponent
              userDetails={userDetails}
              handleViewDetails={handleViewDetails}
              openVerifyModal={openVerifyModal}
              verifyTaskNotAllowedRoles={verifyTaskNotAllowedRoles}
              isRefetch={isRefetch}
            />
          )}
        </Row>
      </Container>
      {/* Task verification */}
      {userDetails?.role !== "CONTRIBUTOR" && (
        <Teamwork
          userDetails={userDetails}
          setSelectedTask={setSelectedTask}
          setSelectedProject={setSelectedProject}
          setShowAddTask={setShowAddTask}
          isChange={isChange}
          handleStatusChange={handleStatusChange}
          handleViewDetails={handleViewDetails}
          openReopenTaskModal={openReopenTaskModal}
          isRefetch={isRefetch}
        />
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
              <Form.Control.Feedback type="invalid">
                {formik.errors.comment}
              </Form.Control.Feedback>
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
