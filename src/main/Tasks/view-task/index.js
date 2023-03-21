// import { Row } from "@nextui-org/react";
import React, { Component, useEffect } from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TextEditor from "./textEditor";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Toaster from "../../../components/Toaster";
import {
  addComment,
  addCommentOnTask,
  taskById,
  updateTaskStatusById,
} from "../../../services/user/api";
import UserIcon from "../../Projects/ProjectCard/profileImage";
import "./index.css";
import CommentBox from "./comments";
export default function ViewTaskModal(props) {
  const { showViewTask, closeViewTaskModal, selectedTaskId } = props;
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  //   const setShowToaster = (param) => showToaster(param);

  console.log("selectedTaskId", selectedTaskId);
  console.log("showViewTask", showViewTask);
  //   console.log("closeViewTaskModal", closeViewTaskModal);

  const [showViewTaskModal, setShowViewTaskModal] = useState(false);
  const [task, setTaskData] = useState({});

  //   ------------------------- comment --------------------------
  const [text, setText] = useState("");
  const [count, setCount] = useState(250);

  const handleTextChange = (content) => {
	// console.log('e.target.value', e.target.value);
	// console.log('task', task);
    const newText = content;
    setText(newText);
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
        // getTasksDataUsingProjectId();
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
    setText("");
    setCount(250);

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
		// setText("");
		resetTextEditor();
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

  //   -------------------------  reset modal data ----------------------------
  const resetModalData = () => {
    setShowViewTaskModal(false);
  };

  const resetTextEditor = () => {
	setText("");
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
              <Row className="mb-3">
                <Form.Group as={Col} md="6">
                  <Form.Label>Project Name</Form.Label>
                  <p>{task?.projectId?.name} </p>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Section Name</Form.Label>
                  <p>{task?.section?.name} </p>
                </Form.Group>
                <Form.Group as={Col} md="12">
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
                  <p>{task?.assignedTo?.name} </p>
                </Form.Group>
                <Form.Group as={Col} md="3" className="px-0">
                  <Form.Label>Due Date</Form.Label>
                  <p>{formatDate(task?.dueDate)} </p>
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Priority</Form.Label>
                  <p>{task?.priority} </p>
                </Form.Group>
                <Form.Group as={Col} md="3" className="ps-0">
                  <Form.Label>Status</Form.Label>
                  {/* <p>{task?.status} </p> */}
                  <select
                    defaultValue={task.status}
                    onChange={(event) => handleStatusChange(event, task?._id)}
                  >
                    <option value="ONGOING">Ongoing</option>
                    <option value="NOT_STARTED">NOT STARTED</option>
                    <option value="ONHOLD">On Hold</option>
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
            </Form>

            <div className="comment-section">
              <h3>Comments</h3>
              <div className="container">
                {/* show comments  */}
                {task?.comments?.map((item, index) => {
                  const options = {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "medium",
                  };
                  const createdAt = new Date(item?.createdAt).toLocaleString(
                    "en-US",
                    options
                  );

                  return (
                    <div className="comment" key={index}>
                      {/* commentedBy */}
                      <div className="commentedBy">
                        <UserIcon
                          key={index}
                          firstName={item?.commentedBy?.name}
                        />{" "}
                        {item?.commentedBy?.name}
                      </div>
                      <div className="commentText">
                        <p dangerouslySetInnerHTML={{__html: item?.comment}} className="comment"></p>
                        <span className="date sub-text">{createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="container">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {/* <textarea
                    className="form-control status-box"
                    rows="3"
                    maxLength={250}
                    placeholder="Enter your comment here..."
                    value={text}
                    onChange={handleTextChange}
                    // value={text}
                  ></textarea> */}
                  {/* <CommentBox onSubmit={handleDescSubmit} /> */}
                  <label>
                    Comment:
                    <TextEditor
                      height={100}
                      width="100%"
                      placeholder="Enter text here"
					  value={text}
                    onChange={handleTextChange}
					// reset = {resetTextEditor}
                    />
                    {/* <textarea value={comment} onChange={handleCommentChange} /> */}
                  </label>
                </div>
                <div className="button-group pull-right">
                  {/* <p className="counter">{count}</p> */}
                  <button type="submit" className="btn btn-primary">
                    Post
                  </button>
                </div>
              </form>
              <ul className="posts"></ul>
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
