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
  getRatingList,
  getTaskDetailsByProjectId,
} from "../../../services/user/api";
import Toaster from "../../../components/Toaster";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";


export default function RatingModalBody (props)  {
  const {setModalShow, data } = props;
  const { userDetails } = useAuth();
  const ratingValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
  // const { taskFromDashBoard , onInit , setIsChange , isChange, setModalShow  } = props;
  // console.log("taskFromDashBoard", taskFromDashBoard);
  // const { taskFromDashBoard } = props;
  // console.log("taskFromDashBoard", taskFromDashBoard)
  let user = data?.user;
  let date = data?.date;
  let month = data?.month;
  let year = data?.year;
  const ratingFormsFields = {
    rating: "",
    comment: "",
    selectedDate: "",
    selectedUser: "",
    selectedTask: "",
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


  useEffect(()=>{
    if(data!==undefined || data !=='' || data!=={}){
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      setRatingForm((prevRatingData) => ({
        ...prevRatingData,
        selectedUser: user.name,
        selectedDate: formattedDate
      }));
      // console.log(ratingForm,'/////////////////////////////////////////////////////////////')
    }
    
  },[data])


  // useEffect(() => {
  //   if (ratingForm.selectedUser && !taskFromDashBoard) {
  //     getAllPendingRatingTaskList();
  //   }
  // }, [ratingForm.selectedDate, ratingForm.selectedUser]);

  // useEffect(() => {
  //   if (ratingForm.userList?.length && taskFromDashBoard) {
  //     setRatingForm({
  //       ...ratingForm,
  //       selectedUser:
  //         taskFromDashBoard.assignedTo?._id || taskFromDashBoard.assignedTo,
  //     });
  //   }
  // }, [ratingForm.userList]);

  // useEffect(() => {
  //   if (ratingForm.projectList?.length && taskFromDashBoard) {
  //     let dueDateData = new Date(taskFromDashBoard?.dueDate.split("T")[0]);
  //     dueDateData =
  //       dueDateData.getFullYear() +
  //       "-" +
  //       (dueDateData.getMonth() + 1 <= 9
  //         ? "0" + (dueDateData.getMonth() + 1)
  //         : dueDateData.getMonth() + 1) +
  //       "-" +
  //       (dueDateData.getDate() <= 9
  //         ? "0" + dueDateData.getDate()
  //         : dueDateData.getDate());

  //     setRatingForm({
  //       ...ratingForm,
  //       selectedProject:
  //         taskFromDashBoard.projectId?._id || taskFromDashBoard.projectId,
  //       taskList: [taskFromDashBoard],
  //       selectedTask: taskFromDashBoard._id,
  //       selectedDate: dueDateData,
  //     });
  //   }
  // }, [ratingForm.projectList]);

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

  const getAllRatings = async function (data) {
    setLoading(true);
    try {
      let { selectedProject, selectedUser, selectedDate } = ratingForm;

      const dataToSend = {
        projectId: selectedProject,
        userId: selectedUser,
        fromDate: formDateDayTime(selectedDate),
        toDate: formDateNightTime(selectedDate),
      };

      const response = await getRatingList();
      if (response.error) {
        setToasterMessage(response.error);
        setShowToaster(true);
        console.log("error", response.error);
      } else {
        console.log(response.data,';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };



  const getUsersList = async function () {
    setLoading(true);
    try {
      const user = await getProjectByProjectId();
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

  const handleSubmit = async (event) => {
    setValidated(true);
    event.preventDefault();
    let { rating, comment, selectedDate, selectedUser } = ratingForm;

    console.log(selectedUser)
    if (
      !ratingForm.selectedDate ||
      !ratingForm.selectedUser ||
      !ratingForm.rating ||
      ratingForm.rating > 6 ||
      ratingForm.rating < 0
    ) {
      return;
    } else {
      // convert date in day month year format for backend
      let dataToSend = {
        rating: rating,
        comment: comment,
        date: selectedDate?.split("-")[2],
        month: selectedDate?.split("-")[0],
        year: selectedDate?.split("-")[1],
        userId: user._id
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
          // if(taskFromDashBoard){
          // onInit();
          // if (userDetails?.role !== "CONTRIBUTOR") {
          //   // getTeamWorkList();
          //   setIsChange(!isChange);
          // }
          // }
          // if(!taskFromDashBoard){
          // navigate("/rating");
          // }
          setModalShow(false);
          
        }
      } catch (error) {
        setLoading(false);
        setToasterMessage(error?.message || "Something Went Wrong");
        setShowToaster(true);
      }
    }
  };

  return (
    <div className="dv-50-rating ">
      <Form className="margin-form" noValidate validated={validated}>
        <Row className="mb-3">


          <Form.Group as={Col} md="6">
            <Form.Label>Select User</Form.Label>
            <Form.Control
              required
              as="select"
              type="select"
              name="selectedUser"
              onChange={handleRatingFormChange}
              value={ratingForm.selectedUser.name}
              // disabled={taskFromDashBoard ? true : false}
            >
              <option value="" disabled>Select User</option>
              {/* {ratingForm?.userList?.map((module) => (
                <option value={module._id} key={module._id}>
                  {module.name}
                </option>
              ))} */}
              <option value={ratingForm.selectedUser.name}>{ratingForm.selectedUser.name}</option>
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
              onChange={(e)=>console.log(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              value={ratingForm.selectedDate}
              // disabled={taskFromDashBoard ? true : false}
            />
            <Form.Control.Feedback type="invalid">
              Date is required !!
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustom01"
            className="ps-0 "
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
          {/* <Form.Group as={Col} md="12">
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
          </Form.Group> */}
          { ratingForm?.taskList?.find((task) => task._id === ratingForm.selectedTask)?.completedDate &&

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
          }
        </Row>

        <Row className="desc">
<textarea
  name="comment"
  placeholder="comment"
  value={ratingForm.comment}
  onChange={handleRatingFormChange}
></textarea>
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
