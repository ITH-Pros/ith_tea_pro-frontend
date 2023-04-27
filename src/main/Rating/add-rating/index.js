/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import "../rating.css";
import {
  addRatingOnTask,
  getAllAssignedProject,
  getProjectByProjectId,
  getTaskDetailsByProjectId,
} from "../../../services/user/api";
import Toaster from "../../../components/Toaster";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useAuth } from "../../../auth/AuthProvider";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Textarea } from "@nextui-org/react";


export default function AddRating(props) {
  const [modalShow, setModalShow] = useState(false);
  const { userDetails } = useAuth();

  const RatingModalBody = () => {
    const { taskFromDashBoard , onInit , setIsChange , isChange  } = props;
    console.log("taskFromDashBoard", taskFromDashBoard);
    const ratingValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
    // console.log("taskFromDashBoard", taskFromDashBoard);
    // const { taskFromDashBoard } = props;
    // console.log("taskFromDashBoard", taskFromDashBoard)
    const ratingFormsFields = {
      selectedProject: "",
      rating: "",
      comment: "",
      selectedDate: new Date().toISOString().split("T")[0],
      selectedUser: "",
      selectedTask: "",
      projectList: [],
      userList: [],
      taskList: [],
    };

    const [ratingForm, setRatingForm] = useState(ratingFormsFields);
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      getProjectList();
    }, []);

    useEffect(() => {
      if (ratingForm.selectedProject) {
        getUsersList();
      }
    }, [ratingForm.selectedProject]);

    useEffect(() => {
      if (ratingForm.selectedUser && !taskFromDashBoard) {
        getAllPendingRatingTaskList();
      }
    }, [ratingForm.selectedDate, ratingForm.selectedUser]);

    useEffect(() => {
      if (ratingForm.userList?.length && taskFromDashBoard) {
        setRatingForm({
          ...ratingForm,
          selectedUser:
            taskFromDashBoard.assignedTo?._id || taskFromDashBoard.assignedTo,
        });
      }
    }, [ratingForm.userList]);

    useEffect(() => {
      if (ratingForm.projectList?.length && taskFromDashBoard) {
        let dueDateData = new Date(taskFromDashBoard?.dueDate.split("T")[0]);
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

        setRatingForm({
          ...ratingForm,
          selectedProject:
            taskFromDashBoard.projectId?._id || taskFromDashBoard.projectId,
          taskList: [taskFromDashBoard],
          selectedTask: taskFromDashBoard._id,
          selectedDate: dueDateData,
        });
      }
    }, [ratingForm.projectList]);

    const handleRatingFormChange = (event) => {
      const { name, value } = event.target;
      setRatingForm({
        ...ratingForm,
        [name]: value,
      });
    };
    function formDateNightTime(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return ""; 
      }
      console.log(dateString,'-----------------------------------------------')
      let utcTime = new Date(dateString );
      utcTime = new Date(utcTime.setUTCHours(23,59,59,999))
      const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
      const timeZoneOffsetMs = timeZoneOffsetMinutes *  60 * 1000;
      const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
      let localTimeString = new Date(localTime.toISOString());
      console.log("==========", localTimeString)
      console.log(localTimeString)
      return localTimeString
    }
    function formDateDayTime(dateString) {
      let utcTime = new Date(dateString);
      utcTime = new Date(utcTime.setUTCHours(0,0,0,0))
      const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
      const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
      const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
      let localTimeString = new Date(localTime.toISOString());
      console.log("==========", localTimeString)
      return localTimeString
    }

    const getAllPendingRatingTaskList = async function (data) {
      setLoading(true);
      try {
        let { selectedProject, selectedUser, selectedDate } = ratingForm;

        const dataToSend = {
          projectId: selectedProject,
          userId: selectedUser,
          fromDate: formDateDayTime(selectedDate),
          toDate: formDateNightTime(selectedDate),
        };

        const response = await getTaskDetailsByProjectId(dataToSend);
        if (response.error) {
          setToasterMessage(response.error);
          setShowToaster(true);
          console.log("error", response.error);
        } else {
          setRatingForm({
            ...ratingForm,
            taskList: response?.data,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
      setLoading(false);
    };

    const handleSubmit = async (event) => {
      setValidated(true);
      event.preventDefault();
      if (
        !ratingForm.selectedTask ||
        !ratingForm.selectedDate ||
        !ratingForm.selectedUser ||
        !ratingForm.rating ||
        ratingForm.rating > 6 ||
        ratingForm.rating < 0
      ) {
        return;
      } else {
        let { selectedTask, rating, comment } = ratingForm;
        let dataToSend = {
          taskId: selectedTask,
          rating: rating,
          comment: comment,
        };
        setLoading(true);
        try {
          const rating = await addRatingOnTask(dataToSend);
          setLoading(false);
          if (rating.error) {
            setToasterMessage(rating?.message || "Something Went Wrong");
            setShowToaster(true);
          } else {
            setToasterMessage("Rating Added Succesfully");
            setShowToaster(true);
            if(taskFromDashBoard){
            onInit();
            if (userDetails?.role !== "CONTRIBUTOR") {
              // getTeamWorkList();
              setIsChange(!isChange);
            }
            }
            if(!taskFromDashBoard){
            navigate("/rating");
            }
            setModalShow(false);
            
          }
        } catch (error) {
          setLoading(false);
          setToasterMessage(error?.message || "Something Went Wrong");
          setShowToaster(true);
        }
      }
    };

    const getProjectList = async function () {
      setLoading(true);
      try {
        const dataToSend = {
          alphabetical: true,
        };

        const projects = await getAllAssignedProject(dataToSend);
        setLoading(false);
        if (projects.error) {
          setToasterMessage(projects?.message || "Something Went Wrong");
          setShowToaster(true);
        } else {
          setRatingForm({ ...ratingForm, projectList: projects.data });
        }
      } catch (error) {
        setToasterMessage(error?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setLoading(false);
        return error.message;
      }
    };

    const getUsersList = async function () {
      let dataToSend = {
        projectId: ratingForm.selectedProject,
      };
      setLoading(true);
      try {
        const user = await getProjectByProjectId(dataToSend);
        setLoading(false);
        if (user.error) {
          setToasterMessage(user?.message || "Something Went Wrong");
          setShowToaster(true);
        } else {
          setRatingForm({ ...ratingForm, userList: user?.data });
        }
      } catch (error) {
        setToasterMessage(error?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setLoading(false);
        return error.message;
      }
    };

    return (
      <div className="dv-50-rating ">
        <Form className="margin-form" noValidate validated={validated}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" className="form-group">
              <Form.Label>Select Project</Form.Label>
              <Form.Control
                required
                as="select"
                type="select"
                name="selectedProject"
                onChange={handleRatingFormChange}
                value={ratingForm.selectedProject}
                disabled={taskFromDashBoard ? true : false}
              >
                <option disabled value="">Select Project</option>
                {ratingForm?.projectList?.map((module) => (
                  <option value={module._id} key={module._id}>
                    {module.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                project is required !!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Select User</Form.Label>
              <Form.Control
                required
                as="select"
                type="select"
                name="selectedUser"
                onChange={handleRatingFormChange}
                value={ratingForm.selectedUser}
                disabled={taskFromDashBoard ? true : false}
              >
                <option value="" disabled>Select User</option>
                {ratingForm?.userList?.map((module) => (
                  <option value={module._id} key={module._id}>
                    {module.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                User name is required !!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="rating_date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="date"
                name="selectedDate"
                placeholder="Rating Date"
                onChange={handleRatingFormChange}
                max={new Date().toISOString().split("T")[0]}
                min="2023-04-01"
                value={ratingForm.selectedDate}
                disabled={taskFromDashBoard ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                Date is required !!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom01"
              className="ps-0"
            >
              <Form.Label>Rating</Form.Label>
              {/* <Form.Control
                required
                type="number"
                name="rating"
                placeholder="0-6"
                value={ratingForm.rating}
                onChange={handleRatingFormChange}
                inputMode="numeric"
                min="0"
                max="6"
              /> */}
              {/* this would be a select box */}
              <Form.Control
                required
                as="select"
                type="select"
                name="rating" 
                onChange={handleRatingFormChange}
                value={ratingForm.rating}
                // disabled={taskFromDashBoard ? true : false}
              >
                <option value="" disabled>Select Rating</option>
  {ratingValues.map((value) => (
    <option key={value} value={value}>{value}</option>
  ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Rating is required, value must be in range [0,6] !!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="12">
              <Form.Label>Select Task</Form.Label>
              <Form.Control
                required
                as="select"
                type="select"
                name="selectedTask"
                onChange={handleRatingFormChange}
                value={ratingForm.selectedTask}
                disabled={taskFromDashBoard ? true : false}
              >
                <option value="" disabled>Select Task</option>
                {ratingForm?.taskList?.map((module) => (
                  <option value={module?._id} key={module?._id}>
                    {module?.title}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Task is required !!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="12">
              <Form.Label>Completed Date</Form.Label>
              <h5>
                {
                  ratingForm?.taskList
                    ?.find((task) => task._id === ratingForm.selectedTask)
                    ?.completedDate?.split("T")[0]
                }
              </h5>
            </Form.Group>
          </Row>

          <Row className="desc">
            <Textarea
              type="textArea"
              name="comment"
              placeholder="comment"
              value={ratingForm.comment}
              onChange={handleRatingFormChange}
            />
          </Row>

          <div className="text-right mt-2">
            <button
              onClick={handleSubmit}
              className="btn-gradient-border btnDanger submit"
            >
              Submit
            </button>
          </div>
        </Form>
        {loading ? <Loader /> : null}
        {toaster && (
          <Toaster
            message={toasterMessage}
            show={toaster}
            close={() => showToaster(false)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {/* <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RatingModalBody />
        </Modal.Body>
      </Modal> */}
      <Offcanvas  
        className="Offcanvas-modal"
        style={{width:'500px'}}
        show={modalShow}
        onHide={() => setModalShow(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> Add Rating</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body  >
        <RatingModalBody />
        </Offcanvas.Body>
      </Offcanvas>

      {!modalShow &&  <Button variant="primary"
                              size="sm"
                               style={{fontSize:'10px'}} onClick={() => setModalShow(true)}>Add Rating</Button>}



    </>
  );
}
