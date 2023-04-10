/* eslint-disable no-useless-concat */
/* eslint-disable react/jsx-no-target-blank */
import React, {useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TextEditor from "./textEditor";
import { useAuth } from "../../../auth/AuthProvider";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Toaster from "../../../components/Toaster";
import Loader from "../../../components/Loader";
import Offcanvas from 'react-bootstrap/Offcanvas';
import ToastContainer from 'react-bootstrap/ToastContainer';
import {
  addCommentOnTask,
  addRatingOnTask,
  taskById,
  updateTaskStatusById,
} from "../../../services/user/api";
import UserIcon from "../../Projects/ProjectCard/profileImage";
import "./index.css";
import History from "./history";
export default function ViewTaskModal(props) {

  const {  closeViewTaskModal, selectedTaskId, getTasksDataUsingProjectId } = props;
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
    let dataToSend = {
      taskId: taskId,
      status: newStatus,
    };
    updateTaskStatus(dataToSend);
  };

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
        showToaster(true)
        setToasterMessage(response.message)
      } else {
        showToaster(true)
        setToasterMessage(response.message)
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
        // console.log(response?.data);
        setShowViewTaskModal(true);
        setActiveTab("comments")
        setIsRatingFormVisible(false);
        setErrorRating(false);
        setRating(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleAddRating = (task) => {
    setSelectedTaskIdForRating(task._id);
    setIsRatingFormVisible(true);
  }

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
          setToasterMessage(rating?.message || "Something Went Wrong");
          showToaster(true);
        } else {
          setToasterMessage("Rating Added Succesfully");
          showToaster(true);
          setIsRatingFormVisible(false);
          getTaskDetailsById(selectedTaskIdForRating);
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


  return (
    <>
     
      <Offcanvas className="Offcanvas-modal" style={{width:'800px'}} show={showViewTaskModal} placement='end'  onHide={() => {
          closeViewTaskModal();
          setShowViewTaskModal(false);
        }} >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Task Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div className="dv-50">
            <Form>
              {
                task?.status === "COMPLETED" && (
                  <Row className="mb-3" style={{alignItems:"end", justifyContent:'end', justifyItems:'end'}}>
                    <div className="col-sm-2 text-right">
                      {task?.isRated && <span>Rating : {task?.rating}</span>}
                      {!task?.isRated && !isRatingFormVisible && userDetails?.role !== "CONTRIBUTOR" && userDetails.id !== task?.assignedTo?._id  && (
                        <Button onClick={() => {handleAddRating(task)}}
                          variant="light"
                          size="sm"
                          className="addRatingBtn" style={{fontSize:'15'}}
                        >Add Rating
                        </Button>
                      )}
                      {!task?.isRated && isRatingFormVisible && (
                        <div className="ratingForm">
                          <input 
                          required
                            type="number"
                            min="0"
                            max="6"
                            placeholder="0 - 6"
                            onChange={(e) => handleRating(e.target.value)}
  
                          />
                          {errorRating && (
                            <span className="error">Rating should be between 0 to 6</span>
                          )}
                        
                          <Button
                            variant="light"
                            size="sm"
                            className="addRatingBtn mr-2"
                            onClick={() => {
                              addRating();
                            }}
                            disabled={errorRating}
                          >
                            Submit
                          </Button>
                      { errorRating && 
                          <Button
                            variant="light"
                            size="sm"
                            className="addRatingBtn"
                            onClick={() => {
                              setIsRatingFormVisible(false)
                            }}
                          >
                            Cancel
                          </Button>
                      }
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
                  <Form.Label>Lead Type</Form.Label>
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
                    <p>{formatDate(task?.completedDate)} </p>
                  </Form.Group>
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
              <div
                className="container"
                style={{ width: "100%", padding: "0px" }}
              >
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
                        <div className="comment" key={index}>
                          <div className="commentedBy">
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
                    {!task?.comments?.length && <h6>No Comments</h6>}
                  </>
                ) }

                {activeTab === "ratings" &&
                (
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
                          <div className="commentedBy">
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
                    {!task?.ratingComments?.length && <h6>No Rating Comments</h6>}
                  </>
                )}

                {activeTab === "history" &&
                (
                  <>
                  {/* <h1>hello history</h1> */}
                  <History
                    taskId={task?._id}
                  />
                  </>
                )}
              </div>
            </div>

            {activeTab === "comments" && <div className="container" style={{ padding: "0", width: "100%" }}>
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
                    marginTop: "50px",
                  }}
                >
                  <Button type="submit" className="btn btn-primary">
                    Post
                  </Button>
                </div>
              </form>
            </div>}
          </div>
        </Offcanvas.Body>
      </Offcanvas>


      {loading?<Loader />:null}
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





  // return (
  //   <>
  //     <Modal
  //       show={showViewTaskModal}
  //       size="xl"
  //       className="taskModalForm"
  //       aria-labelledby="contained-modal-title-vcenter"
  //       onHide={() => {
  //         closeViewTaskModal();
  //         setShowViewTaskModal(false);
  //       }}
  //       backdrop="static"
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title>Task Details</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
          
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button
  //           onClick={() => {
  //             closeViewTaskModal();
  //             setShowViewTaskModal(false);
  //           }}
  //           variant="secondary"
  //         >
  //           Close
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>

  //     {loading?<Loader />:null}
  //     {toaster && (
  //       <ToastContainer position="top-end" className="p-3">
  //       <Toaster 
  //         message={toasterMessage}
  //         show={toaster}
  //         close={() => showToaster(false)}
  //       />
  //       </ToastContainer>
  //     )}
  //   </>
  // );
}
