/* eslint-disable no-useless-concat */
/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TextEditor from "./textEditor";
import { useAuth } from "../../../auth/AuthProvider";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Toaster from "../../../components/Toaster";
import Loader from "../../../components/Loader";
import Offcanvas from "react-bootstrap/Offcanvas";
import ToastContainer from "react-bootstrap/ToastContainer";
import Modal from "react-bootstrap/Modal";

import {
  addCommentOnTask,
  addRatingOnTask,
  taskById,
  updateTaskStatusById,
} from "../../../services/user/api";
import UserIcon from "../../Projects/ProjectCard/profileImage";
import "./index.css";
import History from "./history";
import EditRating from "./editRating";
export default function ViewTaskModal(props) {
  const {
    closeViewTaskModal,
    selectedTaskId,
    getTasksDataUsingProjectId,
    onInit,
    isChange,
    setIsChange,
  } = props;
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [task, setTaskData] = useState({});
  const { userDetails } = useAuth();
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("comments");
  const [rating, setRating] = useState(0);
  const [isRatingFormVisible, setIsRatingFormVisible] = useState(false);
  const [selectedTaskIdForRating, setSelectedTaskIdForRating] = useState(null);
  const [errorRating, setErrorRating] = useState(false);
  const ratingValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];

  useEffect(() => {
    if (selectedTaskId) {
      getTaskDetailsById(selectedTaskId);
    }
  }, [selectedTaskId]);

  const handleTextChange = (content) => {
    setText(content);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    if (day && month && year) {
      return `${day}/${month}/${year}`;
    } else {
      return "--";
    }
  }

  const updateTaskStatus = async (dataToSend) => {
    try {
      const res = await updateTaskStatusById(dataToSend);
      if (res.error) {
        setToasterMessage(res?.message);
        showToaster(true);
      } else {
        setToasterMessage(res?.message);
        showToaster(true);
        if (selectedTaskId) {
          getTaskDetailsById(selectedTaskId);
        }
        getTasksDataUsingProjectId();
        setShowConfirmation(false);
        console.log("isChange", isChange);
        // setIsChange(!isChange)
      }
    } catch (error) {
      return error.message;
    }
  };

  const handleStatusChange = (e, taskId) => {
    const newStatus = e.target.value;
    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    };
    // if (newStatus === 'COMPLETED') {
    //   // confirm('Are you sure you want to complete the task.')

    //   handleConfirmation(dataToSend)

    // } else {
    updateTaskStatus(dataToSend);
    // }
  };

  const handleConfirmation = (dataToSend) => {
    setDataToSendForTaskStatus(dataToSend);
    setShowConfirmation(true);
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dataToSendForTaskStatus, setDataToSendForTaskStatus] = useState(null);

  function ConfirmationPopup({ show, onCancel, onConfirm }) {
    return (
      <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to complete this task ?
          <div>
            <Button variant="secondary ml-2" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger ml-2" onClick={onConfirm}>
              Complete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setText(null);
    setText(null);
    addcomment();
  };

  const addcomment = async () => {
    let dataToSend = {
      taskId: selectedTaskId,
      comment: text,
    };
    try {
      let response = await addCommentOnTask(dataToSend);
      if (response.error) {
        showToaster(true);
        setToasterMessage(response.message);
      } else {
        showToaster(true);
        setToasterMessage(response.message);
        setText("");
        if (selectedTaskId) {
          getTaskDetailsById(selectedTaskId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTaskDetailsById = async (id) => {
    let dataToSend = {
      taskId: id,
    };
    try {
      let response = await taskById(dataToSend);
      if (response.status === 200) {
        setTaskData(response?.data);
        console.log(response?.data, "response?.data");
        // console.log(response?.data);
        setShowViewTaskModal(true);
        setActiveTab("comments");
        setIsRatingFormVisible(false);
        setErrorRating(false);
        setRating(0);
        setIsChange(!isChange);
        onInit();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleAddRating = (task) => {
    // Reset Rating
    // setRating('');

    setErrorRating(false);

    setSelectedTaskIdForRating(task._id);
    setIsRatingFormVisible(true);
  };

  const addRating = async () => {
    let dataToSend = {
      taskId: selectedTaskIdForRating,
      rating: rating,
    };
    setLoading(true);
    try {
      const rating = await addRatingOnTask(dataToSend);
      setLoading(false);
      if (rating.error) {
        setToasterMessage(rating?.message);
        showToaster(true);
      } else {
        setToasterMessage("Rating Added Succesfully");
        showToaster(true);
        setIsRatingFormVisible(false);
        getTaskDetailsById(selectedTaskIdForRating);
        onInit();
        if (userDetails?.role !== "CONTRIBUTOR") {
          // getTeamWorkList();
          setIsChange(!isChange);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleRating = (rating) => {
    if (rating > 0 && rating <= 6) {
      setRating(rating);
      setErrorRating(false);
    } else {
      setErrorRating(true);
      return false;
    }
  };

  const [isEditModal, setIsEditModal] = useState(false);

  const MinutesToDaysHoursMinutes = (props) => {
    const minutes = props.minutes;
    const days = Math.floor(minutes / 1440); // 24 hours * 60 minutes = 1440 minutes in a day
    const hours = Math.floor((minutes % 1440) / 60);
    const remainingMinutes = minutes % 60;

    return (
      <div className="task-completion-time">
        <label className="mb-0">Task Completion Time</label>
        <div>
          {days > 0 && <p>Days: {days}</p>}
          {hours > 0 && <p>Hours: {hours}</p>}
          {remainingMinutes > 0 && <p>Minutes: {remainingMinutes}</p>}
        </div>
      </div>
    );
  };

  return (
    <>
      <Offcanvas
        className="Offcanvas-modal"
        style={{ width: "800px" }}
        show={showViewTaskModal}
        placement="end"
        onHide={() => {
          closeViewTaskModal();
          setShowViewTaskModal(false);
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Task Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="dv-50">
            <Form>
              {task?.status === "COMPLETED" && (
                <Row
                  className="mb-3"
                  style={{
                    alignItems: "end",
                    justifyContent: "end",
                    justifyItems: "end",
                  }}
                >
                  <div className="col-sm-12 text-start">
                    {task?.isRated && (
                      <span>
                        Rating :{" "}
                        <span className="text-success">{task?.rating}</span>
                      </span>
                    )}
                    {task?.isRated &&
                      (userDetails?.role !== "CONTRIBUTOR" ||
                        userDetails?.role !== "LEAD" ||
                        userDetails?.role !== "GUEST") && (
                        <Button
                          onClick={() => setIsEditModal(true)}
                          className="text-muted editBtn"
                        >
                          Edit
                        </Button>
                      )}
                    {!task?.isRated &&
                      !isRatingFormVisible &&
                      userDetails?.role !== "CONTRIBUTOR" &&
                      userDetails.id !== task?.assignedTo?._id && (
                        <Button
                          onClick={() => {
                            handleAddRating(task);
                          }}
                          variant="light"
                          size="sm"
                          className="addRatingBtn"
                          style={{ fontSize: "15" }}
                        >
                          Add Rating
                        </Button>
                      )}
                    {!task?.isRated && isRatingFormVisible && (
                      <div className="ratingForm">
                        {/* <input 
                          required
                            type="number"
                            style={{display:'block'}}
                            min="0"
                            max="6"
                            placeholder="0 - 6"
                            onChange={(e) => handleRating(e.target.value)}
  
                          /> */}

                        {/* this would be a select box */}
                        <select
                          className="form-control form-control-lg"
                          defaultValue={rating}
                          onChange={(event) => handleRating(event.target.value)}
                        >
                          <option value="" disabled>
                            Select Rating
                          </option>
                          {ratingValues.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>

                        <div style={{ justifyContent: "end" }}>
                          <Button
                            variant="light"
                            size="sm"
                            className="addRatingBtn mr-2 ml-2"
                            onClick={() => {
                              addRating();
                            }}
                            disabled={errorRating}
                          >
                            Submit
                          </Button>
                          {errorRating && (
                            <Button
                              variant="light"
                              size="sm"
                              className="addRatingBtn"
                              onClick={() => {
                                setIsRatingFormVisible(false);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                        {errorRating && (
                          <p
                            className="error text-end"
                            style={{ clear: "both" }}
                          >
                            Rating should be between 0 to 6
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Row>
              )}
              <Row className="mb-3">
                <Form.Group as={Col} md="4">
                  <Form.Label>Project Name</Form.Label>
                  <p>{task?.projectId?.name} </p>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Section Name</Form.Label>
                  <p>{task?.section?.name} </p>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Lead</Form.Label>
                  {task?.lead?.map((item, index) => {
                    return <p key={index}>{item?.name} </p>;
                  })}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Task Title</Form.Label>
                  <p>{task?.title} </p>
                </Form.Group>
                {/* Estimated Time */}
              
              </Row>

              <Row className="mb-3">
                <Form.Group className="desc" as={Col} md="12">
                  <Form.Label>Task Description</Form.Label>
                  <p
                    className="text-muted"
                    dangerouslySetInnerHTML={{ __html: task?.description }}
                  ></p>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="3">
                  <Form.Label>Assigned To</Form.Label>
                  <p>{task?.assignedTo?.name || "Not Assigned"} </p>
                </Form.Group>
                <Form.Group as={Col} md="3" className="px-0">
                  <Form.Label>Due Date</Form.Label>
                  <p style={{ fontSize: "13px", marginBottom: "0" }}>
                    {task?.dueDate ? formatDate(task?.dueDate) : "--"}{" "}
                  </p>
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Priority</Form.Label>
                  <p>{task?.priority} </p>
                </Form.Group>
                <Form.Group as={Col} md="3" className="ps-0">
                  <Form.Label>Status</Form.Label>
                  <select
                    className="form-control form-control-lg"
                    defaultValue={task.status}
                    onChange={(event) => handleStatusChange(event, task?._id)}
                    disabled={
                      task.status === "COMPLETED" ||
                      !(
                        userDetails.id === task?.assignedTo?._id ||
                        (userDetails.role === "LEAD" &&
                          (userDetails.id === task?.assignedTo?._id ||
                            task?.lead?.includes(userDetails.id) ||
                            userDetails.id === task?.createdBy?._id)) ||
                        userDetails.role === "SUPER_ADMIN" ||
                        userDetails.role === "ADMIN"
                      )
                    }
                  >
                    <option value="NOT_STARTED">NOT STARTED</option>
                    <option value="ONHOLD">On Hold</option>
                    <option value="ONGOING">On Going</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </Form.Group>
                {task?.status === "COMPLETED" && (
                  <Row className="mb-3 mt-3">
                    <>
                      <Form.Group as={Col} md="4">
                        <Form.Label>Completed Date</Form.Label>
                        <p>{formatDate(task?.completedDate) || "--"} </p>
                      </Form.Group>

                      {/* Task completion time  */}

                      <Form.Group as={Col} md="4">
                        {/* <Form.Label>Completed Date</Form.Label> */}
                        <MinutesToDaysHoursMinutes minutes={task?.timeTaken} />
                      </Form.Group>


                      <Form.Group as={Col} md="4" className="estimated-time">
                  <Form.Label>Estimated Time :</Form.Label>{" "}
                  <div className="time">
                    <p>{task?.defaultTaskTime?.hours} Hour</p>
                    <span>:</span>
                    <p>{task?.defaultTaskTime?.minutes} Minute</p>
                  </div>
                </Form.Group>



                    </>
                  </Row>
                )}
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Attachments</Form.Label>
                  {task.attachments &&
                    task.attachments.map((file, index) => {
                      return (
                        <Col key={index} sm={12}>
                          <div className="assignPopup">
                            <a href={`${file}`} target="_blank">
                              {"Attachment" + " " + (index + 1)}
                            </a>
                          </div>
                        </Col>
                      );
                    })}
                </Form.Group>
              </Row>
            </Form>

            <div className="comment-section">
              <h6>Comments</h6>
              <div className="toggle-tags">
                <button
                  onClick={() => handleTabChange("comments")}
                  className={`toggle-button ${
                    activeTab === "comments" ? "active" : ""
                  }`}
                >
                  Comments
                </button>
                <button
                  onClick={() => handleTabChange("ratings")}
                  className={`toggle-button ${
                    activeTab === "ratings" ? "active" : ""
                  }`}
                >
                  Ratings
                </button>
                {/* history */}
                <button
                  onClick={() => handleTabChange("history")}
                  className={`toggle-button ${
                    activeTab === "history" ? "active" : ""
                  }`}
                >
                  History
                </button>
              </div>
              <div className="container no_comment">
                {activeTab === "comments" && (
                  <>
                    {task?.comments?.map((item, index) => {
                      const options = {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "medium",
                      };
                      const createdAt = new Date(
                        item?.createdAt
                      ).toLocaleString("en-US", options);

                      return (
                        <div className="comment mb-0 mt-0 pt-0" key={index}>
                          <div className="commentedBy pb-2">
                            <UserIcon
                              style={{ float: "left" }}
                              key={index}
                              firstName={item?.commentedBy?.name}
                            />
                            {item?.commentedBy?.name}
                          </div>

                          <p
                            dangerouslySetInnerHTML={{ __html: item?.comment }}
                            className="comment-tex"
                          ></p>
                          <span className="date sub-text">{createdAt}</span>
                        </div>
                      );
                    })}
                    {!task?.comments?.length && (
                      <p className="text-muted">No Comments</p>
                    )}
                  </>
                )}

                {activeTab === "ratings" && (
                  <>
                    {task?.ratingComments?.map((item, index) => {
                      const options = {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "medium",
                      };

                      const createdAt = new Date(
                        item?.createdAt
                      ).toLocaleString("en-US", options);

                      return (
                        <div
                          className="comment comment mb-0 mt-0 pt-0"
                          key={index}
                        >
                          <div className="commentedBy pb-2">
                            <UserIcon
                              style={{ float: "left" }}
                              key={index}
                              firstName={item?.commentedBy?.name}
                            />
                            {item?.commentedBy?.name}
                          </div>
                          <p
                            dangerouslySetInnerHTML={{ __html: item?.comment }}
                            className="comment-tex"
                          ></p>
                          <span className="date sub-text">{createdAt}</span>
                        </div>
                      );
                    })}
                    {!task?.ratingComments?.length && (
                      <p className="text-muted">No Rating Comments</p>
                    )}
                  </>
                )}

                {activeTab === "history" && (
                  <>
                    {/* <h1>hello history</h1> */}
                    <History taskId={task?._id} />
                  </>
                )}
              </div>
            </div>

            {activeTab === "comments" && (
              <div
                className="container"
                style={{ padding: "0", width: "100%" }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <TextEditor
                      width="100%"
                      placeholder="Enter text here"
                      value={text}
                      onChange={handleTextChange}
                    />
                  </div>
                  <div
                    style={{
                      float: "left",
                      width: "100%",
                      textAlign: "right",
                    }}
                  >
                    <Button type="submit" className="btn btn-primary mb-2">
                      Post
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal
        show={isEditModal}
        onHide={() => setIsEditModal(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditRating
            taskId={task}
            taskRating={task?.rating}
            onClose={() => setIsEditModal(false)}
            getTaskDetailsById={getTaskDetailsById}
            showToaster={showToaster}
            setToasterMessage={setToasterMessage}
            setLoading={setLoading}
          />
        </Modal.Body>
      </Modal>

      <ConfirmationPopup
        show={showConfirmation}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={() => updateTaskStatus(dataToSendForTaskStatus)}
      />

      {loading ? <Loader /> : null}
      {toaster && (
        <ToastContainer position="top-end" className="p-3">
          <Toaster
            message={toasterMessage}
            show={toaster}
            close={() => showToaster(false)}
          />
        </ToastContainer>
      )}
    </>
  );
}
