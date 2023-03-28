// import { Row } from "@nextui-org/react";
import React, { Component, useEffect } from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TextEditor from "./textEditor";
import { useAuth } from "../../../auth/AuthProvider";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Toaster from "../../../components/Toaster";
import AddRating from "../../Rating/add-rating";
import {
  addComment,
  addCommentOnTask,
  taskById,
  updateTaskStatusById,
} from "../../../services/user/api";
import UserIcon from "../../Projects/ProjectCard/profileImage";
import "./index.css";
export default function ViewTaskModal(props) {
  const { showViewTask, closeViewTaskModal, selectedTaskId, getTasksDataUsingProjectId } = props;
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  //   const setShowToaster = (param) => showToaster(param);

  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [task, setTaskData] = useState({});
  const { userDetails } = useAuth();

  //   ------------------------- comment --------------------------
  const [text, setText] = useState("");
  const [count, setCount] = useState(250);

  const handleTextChange = (content) => {
    const newText = content;
    setText(content);
    setCount(250 - newText?.length);
  };

  //   format date function

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  const updateTaskStatus = async (dataToSend) => {
    try {
      const res = await updateTaskStatusById(dataToSend);
      if (res.error) {
        setToasterMessage(res?.message || "Something Went Wrong");
        showToaster(true);
      } else {
        setToasterMessage(res?.message || "Something Went Wrong");
        showToaster(true);
        if (selectedTaskId) {
          getTaskDetailsById(selectedTaskId);
        }
        // get
        getTasksDataUsingProjectId();
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      showToaster(true);
      return error.message;
    }
  };

  const handleStatusChange = (e, taskId) => {
    const newStatus = e.target.value;

    console.log("newStatus", newStatus);
    // make API call to update task status with newStatus
    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    };
    console.log("dataToSend", dataToSend);

    updateTaskStatus(dataToSend);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the comment, e.g. post it to a server
    console.log(text);
    setText(null);
    setText(null);
    setCount(250);
    console.log('ssssssssssssssssssssssssssssssss',text)

    //   ------------------------- comment --------------------------
    addcomment();

  };

  const handleDescSubmit = (comment, attachment) => {
    console.log(`Comment: ${comment}`);
    console.log(`Attachment: ${attachment}`);
    // You can perform any action with the comment and attachment data here
  };

  const addcomment = async () => {
    let dataToSend = {
      taskId: selectedTaskId,
      comment: text,
    };
    try {
      let response = await addCommentOnTask(dataToSend);
      console.log(response);
      if (response.error) {
        // showToaster(true)
        // setToasterMessage(response.message)
      } else {
        // showToaster(true)
        // setToasterMessage(response.message)
		setText("");
		// resetTextEditor();
        if (selectedTaskId) {
          getTaskDetailsById(selectedTaskId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------------   Oninitial load ----------------------------
  useEffect(() => {
    if (selectedTaskId) {
      getTaskDetailsById(selectedTaskId);
    }
  }, [selectedTaskId]);

  //-------------------------- get task details by id ----------------------------

  const getTaskDetailsById = async (id) => {
    let dataToSend = {
      taskId: id,
    };
    try {
      let response = await taskById(dataToSend);
      console.log(response);
      if (response.status === 200) {
        setTaskData(response?.data);
        setShowViewTaskModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [activeTab, setActiveTab] = useState("comments");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    console.log(`Active tab changed to ${tabName}`);
  };

  return (
    <>
      <Modal
        show={showViewTaskModal}
        size="xl"
        className="taskModalForm"
        aria-labelledby="contained-modal-title-vcenter"
        onHide={() => {
          closeViewTaskModal();
          setShowViewTaskModal(false);
        }}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="dv-50">
            <Form>
              {userDetails?.role !== "CONTRIBUTOR" &&
                task?.status === "COMPLETED" && (
                  <Row className="mb-3">
                    <>
                      {task?.isRated && <span>Rating : {task?.rating}</span>}
                      {!task?.isRated && (
                        <Button
                          variant="light"
                          size="sm"
                          className="addRatingBtn"
                        >
                          <AddRating taskFromDashBoard={task} />{" "}
                        </Button>
                      )}
                    </>
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
                  <Form.Label>Lead Type</Form.Label>
                  {/* task?.lead?.map */}
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
              </Row>

              <Row className="mb-3">
                <Form.Group className="desc" as={Col} md="12">
                  <Form.Label>Task Description</Form.Label>
                  <p
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
                    {formatDate(task?.dueDate)}{" "}
                  </p>
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Priority</Form.Label>
                  <p>{task?.priority} </p>
                </Form.Group>
                <Form.Group as={Col} md="3" className="ps-0">
                  <Form.Label>Status</Form.Label>
                  {/* <p>{task?.status} </p> */}
                  <select
                    className="form-control form-control-lg"
                    defaultValue={task.status}
                    onChange={(event) => handleStatusChange(event, task?._id)}
                    disabled={task.status === "COMPLETED"}
                  >
                    <option value="ONGOING">Ongoing</option>
                    <option value="NOT_STARTED">NOT STARTED</option>
                    <option value="ONHOLD">On Hold</option>
                    <option value="ONGOING">On Going</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </Form.Group>
                {task?.status === "COMPLETED" && (
                  <Form.Group as={Col} md="4">
                    <Form.Label>Completed Date</Form.Label>
                    <p>{task?.completedDate} </p>
                  </Form.Group>
                )}
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>Attachments</Form.Label>
                  {/* {task?.attachments.map((file) => {
                      // <img src="{file}" alt="attachment"></img>
                      <p>{file}</p>;
                    })}{" "} */}
                  {task.attachments &&
                    task.attachments.map((file, index) => {
                      console.log("attachments------------>", task.attachments);
                      return (
                        <Col key={index} sm={12}>
                          <div className="assignPopup">
                            <a href={`${file}`} target="_blank">
                              {" "}
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
              </div>
              <div
                className="container"
                style={{ width: "100%", padding: "0px" }}
              >
                {/* show comments  */}
                {activeTab === "comments" ? (
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
                        <div className="comment" key={index}>
                          {/* commentedBy */}
                          <div className="commentedBy">
                            <UserIcon
                              style={{ float: "left" }}
                              key={index}
                              firstName={item?.commentedBy?.name}
                            />{" "}
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
                    {!task?.comments?.length && <h6>No Comments</h6>}
                  </>
                ) : (
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
                        <div className="comment" key={index}>
                          {/* commentedBy */}
                          <div className="commentedBy">
                            <UserIcon
                              style={{ float: "left" }}
                              key={index}
                              firstName={item?.commentedBy?.name}
                            />{" "}
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
                    {!task?.ratingComments?.length && <h6>No Rating Comments</h6>}
                  </>
                )}
              </div>
            </div>

            <div className="container" style={{ padding: "0", width: "100%" }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <TextEditor
                    //   height={100}
                    width="100%"
                    placeholder="Enter text here"
                    value={text}
                    onChange={handleTextChange}
                    // reset = {resetTextEditor}
                  />
                </div>
                <div
                  style={{
                    float: "left",
                    width: "100%",
                    textAlign: "right",
                    marginTop: "50px",
                  }}
                >
                  <Button type="submit" className="btn btn-primary">
                    {" "}
                    Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              closeViewTaskModal();
              setShowViewTaskModal(false);
            }}
            variant="secondary"
          >
            Close
          </Button>
          {/* <Button variant="primary">Save Changes</Button> */}
        </Modal.Footer>
      </Modal>
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
    </>
  );
}
