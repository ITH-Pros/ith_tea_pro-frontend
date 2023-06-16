/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import "../rating.css";
import { addRatingOnTask, getProjectsTask } from '../../../services/user/api'
import Toaster from '../../../components/Toaster'
import Loader from '../../../components/Loader'
import { Accordion, Button } from 'react-bootstrap'

export default function RatingModalBody(props) {
  const { setModalShow, data } = props
  const ratingValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]
  let user = data?.user
  let date = data?.date
  let month = data?.month
  let year = data?.year
  const ratingFormsFields = {
    rating: '',
    comment: '',
    selectedDate: '',
    selectedUser: '',
    selectedTask: '',
    userList: [],
    taskList: [],
  }

  const [ratingForm, setRatingForm] = useState(ratingFormsFields)
  const [toaster, showToaster] = useState(false)
  const setShowToaster = param => showToaster(param)
  const [toasterMessage, setToasterMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [userTasks, setUserTasks] = useState('')

  useEffect(() => {
    if (data !== undefined || data !== '' || data !== {}) {
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
      setRatingForm(prevRatingData => ({
        ...prevRatingData,
        selectedUser: user.name,
        selectedDate: formattedDate,
      }))
      let id = [user._id]
      id = JSON.stringify(id)
      localStorage.setItem('userId', id)
      getTasksDataUsingProjectId(formattedDate)

      // console.log(ratingForm,'/////////////////////////////////////////////////////////////')
    }
  }, [data])

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

  const handleRatingFormChange = event => {
    const { name, value } = event.target
    setRatingForm({
      ...ratingForm,
      [name]: value,
    })
  }
  // function formDateNightTime(dateString) {
  //   const date = new Date(dateString);
  //   if (isNaN(date.getTime())) {
  //     return "";
  //   }
  //   console.log(dateString,'-----------------------------------------------')
  //   let utcTime = new Date(dateString );
  //   utcTime = new Date(utcTime.setUTCHours(23,59,59,999))
  //   const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
  //   const timeZoneOffsetMs = timeZoneOffsetMinutes *  60 * 1000;
  //   const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
  //   let localTimeString = new Date(localTime.toISOString());
  //   console.log("==========", localTimeString)
  //   console.log(localTimeString)
  //   return localTimeString
  // }

  // function formDateDayTime(dateString) {
  //   let utcTime = new Date(dateString);
  //   utcTime = new Date(utcTime.setUTCHours(0,0,0,0))
  //   const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
  //   const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
  //   const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
  //   let localTimeString = new Date(localTime.toISOString());
  //   console.log("==========", localTimeString)
  //   return localTimeString
  // }

  // const getAllPendingRatingTaskList = async function (data) {
  //   setLoading(true);
  //   try {
  //     let { selectedProject, selectedUser, selectedDate } = ratingForm;

  //     const dataToSend = {
  //       projectId: selectedProject,
  //       userId: selectedUser,
  //       fromDate: formDateDayTime(selectedDate),
  //       toDate: formDateNightTime(selectedDate),
  //     };

  //     const response = await getTaskDetailsByProjectId(dataToSend);
  //     if (response.error) {
  //       setToasterMessage(response.error);
  //       setShowToaster(true);
  //       console.log("error", response.error);
  //     } else {
  //       setRatingForm({
  //         ...ratingForm,
  //         taskList: response?.data,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //   setLoading(false);
  // };

  // const getAllRatings = async function (data) {
  //   setLoading(true);
  //   try {
  //     let { selectedProject, selectedUser, selectedDate } = ratingForm;

  //     const dataToSend = {
  //       projectId: selectedProject,
  //       userId: selectedUser,
  //       fromDate: formDateDayTime(selectedDate),
  //       toDate: formDateNightTime(selectedDate),
  //     };

  //     const response = await getRatingList();
  //     if (response.error) {
  //       setToasterMessage(response.error);
  //       setShowToaster(true);
  //       console.log("error", response.error);
  //     } else {
  //       console.log(response.data,';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //   setLoading(false);
  // };

  // const getUsersList = async function () {
  //   setLoading(true);
  //   try {
  //     const user = await getProjectByProjectId();
  //     setLoading(false);
  //     if (user.error) {
  //       setToasterMessage(user?.message || "Something Went Wrong");
  //       setShowToaster(true);
  //     } else {
  //       setRatingForm({ ...ratingForm, userList: user?.data });
  //     }
  //   } catch (error) {
  //     setToasterMessage(error?.error?.message || "Something Went Wrong");
  //     setShowToaster(true);
  //     setLoading(false);
  //     return error.message;
  //   }
  // };

  const handleSubmit = async event => {
    setValidated(true)
    event.preventDefault()
    let { rating, comment, selectedDate, selectedUser } = ratingForm

    // console.log(selectedUser)
    if (!ratingForm.comment || !ratingForm.selectedDate || !ratingForm.selectedUser || !ratingForm.rating || ratingForm.rating > 6 || ratingForm.rating < 0) {
      return
    } else {
      // convert date in day month year format for backend
      let dataToSend = {
        rating: rating,
        comment: comment,
        date: selectedDate?.split('-')[2],
        month: selectedDate?.split('-')[1],
        year: selectedDate?.split('-')[0],
        userId: user._id,
      }
      console.log('handle submit...............', dataToSend)
      setLoading(true)
      try {
        const rating = await addRatingOnTask(dataToSend)
        setLoading(false)
        if (rating.error) {
          setToasterMessage(rating?.message || 'Something Went Wrong')
          setShowToaster(true)
        } else {
          setToasterMessage('Rating Added Succesfully')
          setShowToaster(true)
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
          setModalShow(false)
        }
      } catch (error) {
        setLoading(false)
        setToasterMessage(error?.message || 'Something Went Wrong')
        setShowToaster(true)
      }
    }
    localStorage.removeItem('userId')
  }

  function convertToUTCDay(dateString) {
    let utcTime = new Date(dateString)
    utcTime = new Date(utcTime.setUTCHours(0, 0, 0, 0))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset()
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs)
    let localTimeString = new Date(localTime.toISOString())
    // console.log("==========", localTimeString);
    return localTimeString
  }

  function convertToUTCNight(dateString) {
    // console.log(dateString, "------------------");
    let utcTime = new Date(dateString)

    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset()
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs)
    let localTimeString = new Date(localTime.toISOString())
    // console.log("==========", localTimeString);
    return localTimeString
  }

  const getTasksDataUsingProjectId = async date => {
    let assignedTo = JSON.parse(localStorage.getItem('userId'))
    assignedTo = JSON.stringify(assignedTo)
    setLoading(true)
    try {
      let data = {
        groupBy: 'default', // for all tasks list (no grouping by project) send 'assignedTo' instaed of default
        assignedTo: assignedTo,
        fromDate: convertToUTCDay(date),
        toDate: convertToUTCNight(date),
      }
      // console.log(data,'get task list ..................')

      const tasks = await getProjectsTask(data)
      setLoading(false)
      if (tasks.error) {
        setToasterMessage(tasks?.error?.message || 'Something Went Wrong')
        setShowToaster(true)
      } else {
        let allTask = tasks?.data
        // console.log(allTask)
        setUserTasks(allTask)
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || 'Something Went Wrong')
      setShowToaster(true)
      setLoading(false)
      return error.message
    }
  }

  return (
    <div className="dv-50-rating ">
      <Form
        className="margin-form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Row className="mb-3">
          <Col
            as={Col}
            md="12"
          >
            <h3 className="userName">{user?.name}</h3>
            {/* <Form.Control
              required
              as="select" 
              type="text"
              name="selectedUser"
              value={ratingForm.selectedUser.name}

              // disabled={taskFromDashBoard ? true : false}
            >
              <option value="" disabled>Select User</option>
              {/* {ratingForm?.userList?.map((module) => (
                <option value={module._id} key={module._id}>
                  {module.name}
                </option>
              ))}
              <option value={ratingForm.selectedUser.name}>{ratingForm.selectedUser.name}</option> 
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              User name is required !!
            </Form.Control.Feedback> */}
          </Col>

          <Form.Group
            as={Col}
            md="6"
            controlId="rating_date"
          >
            <Form.Label>Date</Form.Label>
            <Form.Control
              required
              type="date"
              name="selectedDate"
              placeholder="Rating Date"
              // onChange={(e)=>console.log(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              value={ratingForm.selectedDate}
              // disabled={taskFromDashBoard ? true : false}
            />
            <Form.Control.Feedback type="invalid">
              {ratingForm.selectedDate === '' && 'Date is required !!'}
              {ratingForm.selectedDate !== '' && new Date(ratingForm.selectedDate) > new Date() && 'Date cannot be greater than today !!'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustom01"
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
              <option
                value=""
                disabled
              >
                Select Rating
              </option>
              {ratingValues.map(value => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">Rating is required, value must be in range [0,6] !!</Form.Control.Feedback>
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
          {ratingForm?.taskList?.find(task => task._id === ratingForm.selectedTask)?.completedDate && (
            <Form.Group
              as={Col}
              md="12"
            >
              <Form.Label>Completed Date</Form.Label>
              <h5>{ratingForm?.taskList?.find(task => task._id === ratingForm.selectedTask)?.completedDate?.split('T')[0]}</h5>
            </Form.Group>
          )}
        </Row>

        <Row className="desc">
          <Form.Group>
            <Form.Control
              required
              as="textarea"
              name="comment"
              placeholder="comment"
              value={ratingForm.comment}
              onChange={handleRatingFormChange}
            />
            <Form.Control.Feedback type="invalid">Comment is required!</Form.Control.Feedback>
          </Form.Group>
          <Button
            size="sm"
            md="6"
            type="submit"
            className="text-center"
            style={{ marginTop: '20px' }}
            disabled={!userTasks.length}
          >
            Submit
          </Button>
        </Row>
      </Form>

      {userTasks?.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <h5>Task List</h5>
          {userTasks.length > 0
            ? userTasks?.map((task, index) => {
                return (
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header>
                        <strong>
                          {task?._id?.projectId}
                          {' / '}
                          {task?._id?.section}
                        </strong>
                      </Accordion.Header>
                      {task?.tasks?.map((ele, i) => {
                        return (
                          <Accordion.Body>
                            {i + 1}
                            {'. '}
                            <a
                              href={'view-task/' + ele._id}
                              target="_blank"
                            >
                              {ele?.title}{' '}
                            </a>{' '}
                            {ele?.isVerified ? <i style={{ color: 'green' }}>(Verified)</i> : <i style={{ color: 'red' }}>(Not Verified)</i>}
                            <br></br>
                            <span>
                              Status: <strong style={{ color: '#808080' }}>{ele?.status}</strong>
                            </span>
                            {ele?.isVerified && (
                              <Col style={{ marginTop: '20px' }}>
                                {' '}
                                <h6>
                                  <strong>Verification Comments</strong>
                                </h6>
                                {ele?.verificationComments?.length ? (
                                  ele?.verificationComments?.map((item, index) => {
                                    const options = {
                                      timeZone: 'Asia/Kolkata',
                                      dateStyle: 'medium',
                                      timeStyle: 'medium',
                                    }
                                    const createdAt = new Date(item?.createdAt).toLocaleString('en-US', options)

                                    return (
                                      <div
                                        className="comment mb-0 mt-0 pt-0"
                                        key={index}
                                      >
                                        <div className="pb-2">{item?.commentedBy?.name}</div>
                                        <p
                                          dangerouslySetInnerHTML={{ __html: item?.comment }}
                                          className="comment-tex"
                                        ></p>
                                        <span className="date sub-text">{createdAt}</span>
                                      </div>
                                    )
                                  })
                                ) : (
                                  <p>No Comments!</p>
                                )}
                              </Col>
                            )}
                          </Accordion.Body>
                        )
                      })}
                    </Accordion.Item>
                  </Accordion>
                )
              })
            : 'No tasks found!'}
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>No tasks available, cannot rate.</div>
      )}

      {loading ? <Loader /> : null}
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
    </div>
  )
};
