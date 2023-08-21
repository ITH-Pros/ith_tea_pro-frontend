/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import "@pages/Rating/rating.css";
import "./index.css";
import { addRatingOnTask, getProjectsTask } from "@services/user/api";

import Loader from "../Shared/Loader";
import { Accordion, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { useAuth } from "../../../auth/AuthProvider";
import { toast } from "react-toastify";
import { useAuth } from "../../utlis/AuthProvider";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  rating: Yup.number()
    .required("Rating is required")
    .min(0, "Minimum rating is 0")
    .max(6, "Maximum rating is 6"),
  comment: Yup.string().optional(),
});

export default function RatingModalBody(props) {
  const { setModalShow, data, raitngForDay } = props;
  console.log("data", data);
  const ratingValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
  let user = data?.user;
  let date = data?.date;
  let month = data?.month;
  let year = data?.year;
  const ratingFormsFields = {
    rating: "",
    comment: "",
    selectedDate: "",
    selectedTask: "",
    userList: [],
    taskList: [],
  };

  const [ratingForm, setRatingForm] = useState(ratingFormsFields);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userTasks, setUserTasks] = useState("");
  const [isNotVerified, setIsNotVerified] = useState(false);
  const [disableRatingButton, setRatingButtonDisable] = useState(false);

  const { userDetails } = useAuth();

  const formik = useFormik({
    initialValues: {
      rating: '',
      comment: '',
      selectedDate: ratingForm.selectedDate,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let dataToSend = {
        userId: user._id,
        date: date,
        month: month,
        year: year,
        rating: values.rating,
        comment: values.comment,
        taskId: values.selectedTask,
      };
      setLoading(true);
      try {
        let response = await addRatingOnTask(dataToSend);
        if (response.error) {
          toast.dismiss();
          toast.info(response.message);
        } else {
          toast.dismiss();
          toast.success(response.message);
          setModalShow(false);
        }
      } catch (error) {
        toast.dismiss();
        toast.info(error);
      }
      setLoading(false);
    }
  });



  useEffect(() => {
    if (data !== undefined || data !== "" || data !== {}) {
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
        date
      ).padStart(2, "0")}`;
      setRatingForm((prevRatingData) => ({
        ...prevRatingData,
        selectedDate: formattedDate,
      }));
      let id = [user._id];
      id = JSON.stringify(id);
      localStorage.setItem("userId", id);
      getTasksDataUsingProjectId(formattedDate);
    }
  }, [data]);

  useEffect(() => {
    if (
      userTasks.length > 0 &&
      userDetails?.role !== "SUPER_ADMIN" &&
      userDetails.role !== "ADMIN"
    ) {
      let isAnyElementNotVerified = userTasks?.some((element) => {
        return (
          element._id.section !== "Misc" &&
          !element.tasks.every((task) => task.isVerified)
        );
      });
      setIsNotVerified(isAnyElementNotVerified);
    }
  }, [userTasks]);

  const handleRatingFormChange = (event) => {
    const { name, value } = event.target;
    setRatingForm({
      ...ratingForm,
      [name]: value,
    });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  const handleAbsent = async () => {
    setValidated(true);
    let dataToSend = {
      rating: -1,
      absent: true,
      comment: "Absent on this day.",
      date: ratingForm.selectedDate?.split("-")[2],
      month: ratingForm.selectedDate?.split("-")[1],
      year: ratingForm.selectedDate?.split("-")[0],
      userId: user._id,
    };
    setLoading(true);
    try {
      const rating = await addRatingOnTask(dataToSend);
      setLoading(false);
      if (rating.error) {
        toast.dismiss();
        toast.info(rating?.message || "Something Went Wrong");
      } else {
        toast.dismiss();
        toast.info("You marked as ABSENT.");
        setModalShow(false);
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    }
    localStorage.removeItem("userId");
  };

  // Function to handle "Mark as ZERO" button click
  const handleZeroRating = async () => {
    setValidated(true);
    let dataToSend = {
      rating: 0,
      comment: "No tasks available for rating.",
      date: ratingForm.selectedDate?.split("-")[2],
      month: ratingForm.selectedDate?.split("-")[1],
      year: ratingForm.selectedDate?.split("-")[0],
      userId: user._id,
    };
    setLoading(true);
    try {
      const rating = await addRatingOnTask(dataToSend);
      setLoading(false);
      if (rating.error) {
        toast.dismiss();
        toast.info(rating?.message || "Something Went Wrong");
      } else {
        toast.dismiss();
        toast.info("Rating Added Successfully as ZERO");
        setModalShow(false);
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    }
    localStorage.removeItem("userId");
  };

  // const handleSubmit = async (event) => {
  //   setValidated(true);
  //   event.preventDefault();
  //   let { rating, comment, selectedDate } = ratingForm;

  //   if (
  //     !ratingForm.selectedDate ||
  //     !ratingForm.rating ||
  //     ratingForm.rating > 6 ||
  //     ratingForm.rating < 0
  //   ) {
  //     return;
  //   } else {
  //     // convert date in day month year format for backend
  //     let dataToSend = {
  //       rating: rating,
  //       comment: comment,
  //       date: selectedDate?.split("-")[2],
  //       month: selectedDate?.split("-")[1],
  //       year: selectedDate?.split("-")[0],
  //       userId: user._id,
  //     };
  //     setLoading(true);
  //     try {
  //       const rating = await addRatingOnTask(dataToSend);
  //       setLoading(false);
  //       if (rating.error) {
  //         toast.dismiss();
  //         toast.info(rating?.message || "Something Went Wrong");
  //         // set
  //       } else {
  //         toast.dismiss();
  //         toast.info("Rating Added Succesfully");
  //         // set
  //         setModalShow(false);
  //       }
  //     } catch (error) {
  //       console.log(error, "error");
  //       setLoading(false);
  //       toast.dismiss();
  //       toast.info(error?.message || "Something Went Wrong");
  //       // set
  //     }
  //   }
  //   localStorage.removeItem("userId");
  // };

  function convertToUTCDay(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(0, 0, 0, 0));
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    return localTimeString;
  }

  function convertToUTCNight(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(23, 59, 59, 999));
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    return localTimeString;
  }

  const getTasksDataUsingProjectId = async (date) => {
    let assignedTo = JSON.parse(localStorage.getItem("userId"));
    assignedTo = JSON.stringify(assignedTo);
    setLoading(true);
    try {
      let data = {
        groupBy: "default",
        taskFor: "Rating", // for all tasks list (no grouping by project) send 'assignedTo' instaed of default
        assignedTo: assignedTo,
        fromDate: convertToUTCDay(date),
        toDate: convertToUTCNight(date),
      };
      const tasks = await getProjectsTask(data);
      setLoading(false);
      if (tasks.error) {
        toast.dismiss();
        toast.info(tasks?.error?.message || "Something Went Wrong");
        // set
      } else {
        let allTask = tasks?.data;
        allTask?.map((task, index) => {
          task?.tasks?.map((ele, i) => {
            console.log(ele);
            if (!ele?.isVerified) {
              setRatingButtonDisable(true);
            }
          });
        });
        setUserTasks(allTask);
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      // set
      setLoading(false);
      return error.message;
    }
  };

  return (
    <>
      {loading ? (
        ""
      ) : userTasks?.length > 0 ? (
        <div className="dv-50-rating ">
          {!isNotVerified ? (
            raitngForDay >= 0 ? (
              <div>
                <h3>Rating: {raitngForDay}</h3>
              </div>
            ) : (
              <Form onSubmit={formik.handleSubmit} className="margin-form">
          <Row className="mb-3">
            <Col as={Col} md="12">
              <h3 className="userName">{user?.name}</h3>
            </Col>

            <Form.Group as={Col} md="6">
            <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="date"
                name="selectedDate"
                disabled="true"
                max={new Date().toISOString().split('T')[0]}
                defaultValue={ratingForm.selectedDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.selectedDate && formik.errors.selectedDate ? (
                <div className="error">{formik.errors.selectedDate}</div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} md="6">
              <Form.Label>Rating</Form.Label>
              <select
                required
                as="select"
                name="rating"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rating}
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
              {formik.touched.rating && formik.errors.rating ? (
                <div className="error">{formik.errors.rating}</div>
              ) : null}
            </Form.Group>
          </Row>

          {/* Other form fields ... */}


          <Row className="desc">
            <Col>
              <textarea
                name="comment"
                placeholder="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
              />
            </Col>
            <Button
              size="sm"
              md="6"
              type="submit"
              className="text-center"
              style={{ marginTop: '20px' }}
            >
              Submit
            </Button>
          </Row>
        </Form>
            )
          ) : (
            <div className="rating-container">
              <strong className="title">Verify tasks to give rating</strong>
              <div className="details">
                <label className="gap_status_label">Name: {user?.name}</label>{" "}
                <br />
                <label className="date_label">
                  Date: {formatDate(ratingForm.selectedDate)}
                </label>
              </div>
            </div>
          )}

          <div style={{ marginTop: "30px" }}>
            <h5>Task List</h5>
            {userTasks.length > 0
              ? userTasks?.map((task, index) => {
                  return (
                    <div key={index}>
                      <br></br>
                      <p>
                        {" "}
                        <strong className="fw-normal">
                          {task?._id?.projectId}
                          {" / "}
                          {task?._id?.section}
                        </strong>
                      </p>
                      <div>
                        {task?.tasks?.map((ele, i) => {
                          return (
                            <Accordion defaultActiveKey={index} flush key={i}>
                              <Accordion.Item eventKey={i + 1} className="mb-0">
                                <Accordion.Header className="gap_status">
                                  <span>
                                    {ele?.status === "NOT_STARTED" && (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>{ele?.status}</Tooltip>
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle secondary"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </OverlayTrigger>
                                    )}
                                    {ele?.status === "ONGOING" && (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>{ele?.status}</Tooltip>
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle warning"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </OverlayTrigger>
                                    )}
                                    {ele?.status === "COMPLETED" && (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>{ele?.status}</Tooltip>
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle success"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </OverlayTrigger>
                                    )}
                                    {ele?.status === "ONHOLD" && (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>{ele?.status}</Tooltip>
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle primary"
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </OverlayTrigger>
                                    )}
                                  </span>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>{ele?.title}</Tooltip>}
                                  >
                                    <p
                                      className="text-dark fw-normal"
                                      style={{ fontSize: "15px" }}
                                      onClick={() =>
                                        window.open(
                                          "/view-task/" + ele._id,
                                          "_blank"
                                        )
                                      }
                                    >
                                      {ele?.title}
                                    </p>
                                  </OverlayTrigger>

                                  {ele?.isReOpen && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Re-opened</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-retweet red-flag"
                                        aria-hidden="true"
                                      ></i>
                                    </OverlayTrigger>
                                  )}
                                  {ele?.isDelayTask && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={<Tooltip>Overdue</Tooltip>}
                                    >
                                      <i
                                        className="fa fa-flag red-flag"
                                        aria-hidden="true"
                                      ></i>
                                    </OverlayTrigger>
                                  )}
                                  {task?._id?.section !== "Misc" &&
                                    (ele?.isVerified ? (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Verified</Tooltip>}
                                      >
                                        <i
                                          className="fa fa-check"
                                          style={{ color: "green" }}
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </OverlayTrigger>
                                    ) : (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Not Verified</Tooltip>
                                        }
                                      >
                                        <i
                                          className="fa fa-times"
                                          style={{
                                            color: "red",
                                            fontSize: "15px",
                                          }}
                                          aria-hidden="true"
                                        >
                                          {" "}
                                        </i>
                                      </OverlayTrigger>
                                    ))}
                                  <br></br>
                                </Accordion.Header>
                                <Accordion.Body>
                                  {ele?.isVerified && (
                                    <Col>
                                      {" "}
                                      <h6>
                                        <strong>Verification Comments</strong>
                                      </h6>
                                      {ele?.verificationComments?.length ? (
                                        ele?.verificationComments?.map(
                                          (item, index) => {
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
                                                className="comment mb-0 mt-0 pt-0 px-0"
                                                key={index}
                                              >
                                                <div className="pb-2">
                                                  {item?.commentedBy?.name}
                                                </div>
                                                <p
                                                  dangerouslySetInnerHTML={{
                                                    __html: item?.comment,
                                                  }}
                                                  className="comment-tex"
                                                ></p>
                                                <span className="date sub-text">
                                                  {createdAt}
                                                </span>
                                              </div>
                                            );
                                          }
                                        )
                                      ) : (
                                        <p>No Comments!</p>
                                      )}
                                    </Col>
                                  )}
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              : "No tasks found!"}
          </div>
        </div>
      ) : (
        // When there are no tasks available for rating

        <div>
          {raitngForDay === 0 && <p>No tasks available for rating .</p>}
          {raitngForDay === -1 && <p>You are marked absent.</p>}
          {(raitngForDay === null ||
            raitngForDay === "" ||
            raitngForDay === undefined) && (
            <div>
              <div style={{ marginTop: "20px" }}>
                <p>No tasks available, cannot rate.</p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleAbsent()}
                    style={{ marginRight: "10px" }}
                  >
                    ABSENT
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleZeroRating()}
                  >
                    Mark as ZERO
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? <Loader /> : null}
    </>
  );
}
