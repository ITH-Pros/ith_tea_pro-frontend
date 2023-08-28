import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Loader from "@components/Shared/Loader/index";
import "@components/Rating/index.css";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProjectsTask } from "@services/user/api";
import UserIcon from "@components/ProfileImage/profileImage";
import History from "@components/view-task/history";
import { convertToUTCDay, convertToUTCNight, formatDateToRating } from "@helpers/index";

export default function ViewUserTasks() {
  const data = JSON.parse(localStorage.getItem("view-user-tasks"));
  const { userId } = useParams();
  // state variables
  const [loading, setLoading] = useState(false);
  const [userTasks, setTaskData] = useState({});

  /**
   * @description useEffect hook - executes on component load - calls @getAllTasksUsingUserId
   */
  useEffect(() => {
    if (userId === data?.id[0]) {
      const formattedDate = `${data?.year}-${String(data?.month).padStart(
        2,
        "0"
      )}-${String(data?.date).padStart(2, "0")}`;
      getAllTasksUsingUserId(formattedDate);
    } else {
      toast.dismiss();
      toast.info("User id does not match!");
    }
  }, []);

  /**
   * @description gets atsks for user
   * @param  date
   */
  const getAllTasksUsingUserId = async (date) => {
    let assignedTo = JSON.stringify(data?.id);
    setLoading(true);
    try {
      let data = {
        groupBy: "default", // for all tasks list (no grouping by project) send 'assignedTo' instaed of default
        assignedTo: assignedTo,
        fromDate: convertToUTCDay(date),
        toDate: convertToUTCNight(date),
      };
      const tasks = await getProjectsTask(data);
      setLoading(false);
      if (tasks.error) {
        toast.dismiss();
        toast.info(tasks?.error?.message || "Something Went Wrong");
      } else {
        let allTask = tasks?.data;
        setTaskData(allTask);
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      setLoading(false);
      return error.message;
    }
  };

  /**
   * @description React functional component
   * @param  props
   * @returns JSX for task UI
   */
  const TaskDetailsUI = (props) => {
    const { task } = props;
    return (
      <Accordion>
        <Accordion.Header>{task?.title} </Accordion.Header>
        <Accordion.Body>
          <Row className="mb-3">
            <Col className="d-flex">
              <h6 className="pe-2">Lead : </h6>
              {task?.lead?.map((item, index) => {
                return <p key={index}>{item?.name} </p>;
              })}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <h6>Task Description</h6>
              <p
                className="text-muted"
                dangerouslySetInnerHTML={{ __html: task?.description }}
              ></p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col as={Col} md="3" className="d-flex">
              <h6 className="pe-2">Assigned To : </h6>
              <p>{task?.assignedTo?.name || "Not Assigned"} </p>
            </Col>
            <Col as={Col} md="3" className="d-flex">
              <h6 className="pe-2">Due Date : </h6>
              <p style={{ fontSize: "13px", marginBottom: "0" }}>
                {task?.dueDate ? formatDateToRating(task?.dueDate) : "--"}{" "}
              </p>
            </Col>

            <Col as={Col} md="3" className="d-flex">
              <h6 className="pe-2">Priority : </h6>
              <p>{task?.priority} </p>
            </Col>
            <Col as={Col} md="3" className="d-flex">
              <h6 className="pe-2">Status : </h6>

              <p>{task?.status}</p>
            </Col>
          </Row>
          <Row className="mb-3 mt-3">
            <Col as={Col} md="3" className="d-flex">
              <h6 className="pe-2">Completed Date : </h6>
              <p>{formatDateToRating(task?.completedDate) || "--"} </p>
            </Col>

            <Col as={Col} md="3">
              <MinutesToDaysHoursMinutes minutes={task?.timeTaken} />
            </Col>
            <Col as={Col} md="3" className="d-flex">
              <h6 className="pe-2">Estimated Time :</h6>{" "}
              <div className="time">
                <p>
                  {task?.defaultTaskTime?.hours} Hour(s){" "}
                  {task?.defaultTaskTime?.minutes !== null && (
                    <>& {task?.defaultTaskTime?.minutes} Minute</>
                  )}
                </p>
              </div>
            </Col>
          </Row>
          <Col as={Col} md="3" className="d-flex ps-0">
            <h6 className="pe-2">Attachments : </h6>
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
          </Col>
          <Row>
            {" "}
            <Accordion>
              <Accordion.Header>
                <h6 className="pe-2">Comments</h6>
              </Accordion.Header>
              <Accordion.Body>
                {task?.comments?.length ? (
                  task?.comments?.map((item, index) => {
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
                      <div className="comment mb-0 mt-0 pt-0 w-100" key={index}>
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
                  })
                ) : (
                  <p>No Comments!</p>
                )}
              </Accordion.Body>
            </Accordion>
          </Row>
          <Row>
            {task?.isVerified && (
              <Accordion>
                <Accordion.Header>
                  <h6 className="pe-2">Verification Comments</h6>
                </Accordion.Header>
                <Accordion.Body>
                  {task?.verificationComments?.length ? (
                    task?.verificationComments?.map((item, index) => {
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
                    })
                  ) : (
                    <p>{task.isVerified ? "No Comments!" : "Not Verified"}</p>
                  )}
                </Accordion.Body>
              </Accordion>
            )}
          </Row>
          <Row>
            <Accordion>
              <Accordion.Header>
                <h6>History</h6>
              </Accordion.Header>
              <Accordion.Body>
                <History taskId={task._id} />
              </Accordion.Body>
            </Accordion>
          </Row>
        </Accordion.Body>
      </Accordion>
    );
  };

  return (
    <div className="addUserFrom rightDashboard" style={{ marginTop: "7%" }}>
      <strong>{data?.userName}</strong> tasks for{" "}
      <i>
        {data?.date}/{data?.month}/{data?.year}
      </i>
      {userTasks?.length > 0 && (
        <>
          {userTasks?.map((ele, index) => {
            return (
              <Accordion key={index}>
                <Accordion.Header>
                  {ele?._id?.projectId} / {ele?._id?.section}
                </Accordion.Header>
                <Accordion.Body>
                  {ele?.tasks?.map((task) => {
                    return <TaskDetailsUI task={task} />;
                  })}
                </Accordion.Body>
              </Accordion>
            );
          })}
        </>
      )}
      {loading ? <Loader /> : null}
    </div>
  );
}
