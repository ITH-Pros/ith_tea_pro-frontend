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
  getProjectById,
  getTaskDetailsByProjectId,
} from "../../../services/user/api";
import Toaster from "../../../components/Toaster";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

export default function AddRating(props) {
  const [modalShow, setModalShow] = useState(false);

  const RatingModalBody = () => {
    const { taskFromDashBoard , handleOnInit } = props;
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

    const getAllPendingRatingTaskList = async function (data) {
      setLoading(true);
      try {
        let { selectedProject, selectedUser, selectedDate } = ratingForm;

        const dataToSend = {
          projectId: selectedProject,
          userId: selectedUser,
          dueDate: selectedDate,
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
            handleOnInit();
            navigate("/rating");
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
        setToasterMessage(error?.message || "Something Went Wrong");
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
        const user = await getProjectById(dataToSend);
        setLoading(false);
        if (user.error) {
          setToasterMessage(user?.message || "Something Went Wrong");
          setShowToaster(true);
        } else {
          setRatingForm({ ...ratingForm, userList: user?.data?.accessibleBy });
        }
      } catch (error) {
        setToasterMessage(error?.message || "Something Went Wrong");
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
                <option value="">Select Project</option>
                {ratingForm?.projectList?.map((module) => (
                  <option value={module._id} key={module._id}>
                    {module.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                project is required !!
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                <option value="">Select User</option>
                {ratingForm?.userList?.map((module) => (
                  <option value={module._id} key={module._id}>
                    {module.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                User name is required !!
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="rating_date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="date"
                name="selectedDate"
                placeholder="Rating Date"
                onChange={handleRatingFormChange}
                max={new Date().toISOString().split("T")[0]}
                value={ratingForm.selectedDate}
                disabled={taskFromDashBoard ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                Date is required !!
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom01"
              className="ps-0"
            >
              <Form.Label>Rating</Form.Label>
              <Form.Control
                required
                type="number"
                name="rating"
                placeholder="0-6"
                value={ratingForm.rating}
                onChange={handleRatingFormChange}
                pattern="[0-9]*"
                inputMode="numeric"
                min="0"
                max="6"
              />
              <Form.Control.Feedback type="invalid">
                Rating is required, value must be in range [0,6] !!
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                <option value="">Select Task</option>
                {ratingForm?.taskList?.map((module) => (
                  <option value={module?._id} key={module?._id}>
                    {module?.title}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                User name is required !!
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
            <Form.Control
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
      <Modal
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
      </Modal>
      {!modalShow && <span onClick={() => setModalShow(true)}>Add Rating</span>}
    </>
  );
}
