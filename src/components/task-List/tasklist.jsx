import React from "react";
import {
  Accordion,
  ProgressBar,
  Dropdown,
  Badge,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from "react-bootstrap";
import moment from "moment";
import UserIcon from "@components/ProfileImage/profileImage";
import "../../pages/Tasks/tasks.css";

const TaskList = ({
  projects,
  selectedProjectId,
  isArchive,
  userDetails,
  taskInfo,
  handleProgressBarHover,
  setTaskInfo,
  handleAddTaskFromSection,
  editSection,
  deleteConFirmation,
  handleViewDetails,
  handleStatusChange,
  setSelectedProject,
  setShowAddTask,
  setSelectedTask,
  isLoading,
}) => {
  return (
    <Accordion alwaysOpen="true">
      {!projects?.length && !selectedProjectId && !isLoading && (
        <p className="alig-nodata" style={{ textAlign: "center" }}>
          No Tasks Found
        </p>
      )}
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {projects?.map((project, index) => (
        // check if tasks array has data
        <Accordion.Item key={index} eventKey={index}>
          {project?._id?.projectId && project?._id?.section && (
            <Accordion.Header>
              {project?._id?.projectId} / {project?._id?.section}
            </Accordion.Header>
          )}

          <div className="d-flex rightTags">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  {taskInfo && (
                    <div>
                      <div>Completed Tasks: {taskInfo.completedTasks}</div>
                      <div>Pending Tasks: {taskInfo.pendingTasks}</div>
                    </div>
                  )}
                </Tooltip>
              }
            >
              <div
                onMouseEnter={() => handleProgressBarHover(project)}
                onMouseLeave={() => setTaskInfo(null)}
              >
                {parseFloat(
                  (Number(project?.completedTasks || 0) /
                    Number(project?.totalTasks || 1)) *
                    100
                ).toFixed(2) + " % "}
                <ProgressBar>
                  <ProgressBar
                    variant="success"
                    now={
                      100 *
                      (Number(project?.completedTasks || 0) /
                        Number(project?.totalTasks || 1))
                    }
                    key={1}
                  />
                </ProgressBar>
              </div>
            </OverlayTrigger>
            <div>
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" className="action_btn">
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {!isArchive && (
                    <Dropdown.Item
                      onClick={() => {
                        handleAddTaskFromSection(project);
                      }}
                    >
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>{" "}
                      Add Tasks
                    </Dropdown.Item>
                  )}

                  {(userDetails?.role === "SUPER_ADMIN" ||
                    userDetails?.role === "ADMIN") && (
                    <>
                      {!isArchive && (
                        <Dropdown.Item
                          onClick={() =>
                            editSection({
                              section: project?._id?.section,
                              projectId: project?.projectId,
                              _id: project?.sectionId,
                            })
                          }
                        >
                          <i
                            className="fa fa-pencil-square"
                            aria-hidden="true"
                          ></i>{" "}
                          Edit Section
                        </Dropdown.Item>
                      )}
                      {!isArchive && (
                        <Dropdown.Item>
                          <i className="fa fa-files-o" aria-hidden="true"></i>{" "}
                          Copy/Move
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        disabled={project?.tasks?.length > 0}
                        onClick={() =>
                          deleteConFirmation({
                            _id: project?.sectionId,
                          })
                        }
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>{" "}
                        Delete Section
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Accordion.Body>
            <ul className="mb-0">
              {project?.tasks?.map((task) => (
                <li key={task?._id} className="share-wrapper-ui">
                  <div className="clickLabelArea">
                    <Row className="align-items-center justify-content-start">
                      <Col lg={4} className="align-items-center">
                        <Row>
                          <Col lg={1}>
                            <div>
                              {(userDetails.id === task?.assignedTo?._id ||
                                (userDetails?.role === "LEAD" &&
                                  (userDetails.id === task?.assignedTo?._id ||
                                    task?.lead?.includes(userDetails.id) ||
                                    userDetails.id === task?.createdBy?._id)) ||
                                userDetails?.role === "SUPER_ADMIN" ||
                                userDetails?.role === "ADMIN") && (
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    {task.status === "NOT_STARTED" && (
                                      <i
                                        className="fa fa-check-circle secondary"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                    {task.status === "ONGOING" && (
                                      <i
                                        className="fa fa-check-circle warning"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                    {task.status === "COMPLETED" && (
                                      <i
                                        className="fa fa-check-circle success"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                    {task.status === "ONHOLD" && (
                                      <i
                                        className="fa fa-check-circle primary"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                  </Dropdown.Toggle>

                                  {task.status !== "COMPLETED" && (
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={(event) =>
                                          handleStatusChange(
                                            event,
                                            task?._id,
                                            "NOT_STARTED"
                                          )
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle secondary  "
                                          aria-hidden="true"
                                        ></i>{" "}
                                        Not Started
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={(event) =>
                                          handleStatusChange(
                                            event,
                                            task?._id,
                                            "ONGOING"
                                          )
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle warning"
                                          aria-hidden="true"
                                        ></i>{" "}
                                        Ongoing
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={(event) =>
                                          handleStatusChange(
                                            event,
                                            task?._id,
                                            "COMPLETED"
                                          )
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle success"
                                          aria-hidden="true"
                                        ></i>{" "}
                                        Completed
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={(event) =>
                                          handleStatusChange(
                                            event,
                                            task?._id,
                                            "ONHOLD"
                                          )
                                        }
                                      >
                                        <i
                                          className="fa fa-check-circle primary"
                                          aria-hidden="true"
                                        ></i>{" "}
                                        On Hold
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  )}
                                </Dropdown>
                              )}
                            </div>
                          </Col>
                          <Col lg={8}>
                            <p
                              className={
                                task?.status === "COMPLETED"
                                  ? "line-strics"
                                  : ""
                              }
                              // onClick={() => handleViewDetails(task?._id)}
                            >
                              <p
                                onClick={() => handleViewDetails(task?._id)}
                                className="text-truncate"
                              >
                                {task?.title}
                              </p>
                            </p>
                          </Col>
                          <Col lg={3} className="d-flex align-items-center ">
                            {task?.isReOpen && (
                              <div className="text-danger">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Re-opened</Tooltip>}
                                >
                                  <i
                                    className="fa fa-retweet"
                                    aria-hidden="true"
                                  ></i>
                                </OverlayTrigger>
                              </div>
                            )}
                            {task?.isDelayTask && (
                              <div
                                className="text-danger"
                                style={{ marginLeft: "10px" }}
                              >
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Overdue</Tooltip>}
                                >
                                  <i
                                    className="fa fa-flag"
                                    aria-hidden="true"
                                  ></i>
                                </OverlayTrigger>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={3}>
                        {task?.status === "NOT_STARTED" && (
                          <Badge bg="secondary">NOT STARTED</Badge>
                        )}
                        {task?.status === "ONGOING" && (
                          <Badge bg="warning">ONGOING</Badge>
                        )}
                        {task?.status === "COMPLETED" && (
                          <Badge bg="success">
                            completed{" "}
                            {moment(task?.completedDate?.split("T")[0]).format(
                              "MMM DD,YYYY"
                            )}
                          </Badge>
                        )}
                        {task?.status === "ONHOLD" && (
                          <Badge bg="primary">ON HOLD</Badge>
                        )}
                        {task?.priority === "LOW" && (
                          <Badge bg="primary">LOW</Badge>
                        )}
                        {task?.priority === "REPEATED" && (
                          <Badge bg="warning">REPEATED</Badge>
                        )}
                        {task?.priority === "MEDIUM" && (
                          <Badge bg="warning">MEDIUM</Badge>
                        )}
                        {task?.priority === "HIGH" && (
                          <Badge bg="danger">HIGH</Badge>
                        )}
                      </Col>
                      <Col
                        lg={2}
                        className="align-items-center justify-content-start ps-0 d-flex"
                      >
                        {!task?.assignedTo?.profilePicture &&
                          task?.assignedTo?.name && (
                            <div className="nameTag">
                              <UserIcon
                                style={{ width: "25px" }}
                                key={index}
                                firstName={task?.assignedTo?.name || ""}
                              />
                            </div>
                          )}
                        {task?.assignedTo?.profilePicture && (
                          <div
                            className="nameTag"
                            style={{ display: "contents" }}
                          >
                            <img
                              style={{
                                width: "25px",
                                height: "25px",
                                borderRadius: "50%",
                              }}
                              src={`${task?.assignedTo?.profilePicture}`}
                              alt="profile"
                            ></img>
                          </div>
                        )}
                        <span className="text-truncate d-block">
                          {" "}
                          {task?.assignedTo?.name}
                        </span>
                        {!task?.assignedTo?.name && <span> NOT ASSIGNED </span>}
                      </Col>
                      {/* for lead  */}

                      <Col
                        lg={2}
                        className="align-items-center justify-content-start"
                      >
                        {!task?.lead[0]?.profilePicture &&
                          task?.lead[0]?.name && (
                            <div className="nameTag">
                              <UserIcon
                                key={index}
                                firstName={task?.lead[0]?.name || ""}
                              />
                            </div>
                          )}
                        {task?.lead[0]?.profilePicture && (
                          <div
                            className="nameTag"
                            style={{ display: "contents" }}
                          >
                            <img
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                              }}
                              src={`${task?.lead[0]?.profilePicture}`}
                              alt="profile"
                            ></img>
                          </div>
                        )}
                        <span> {task?.lead[0]?.name}</span>
                        {!task?.lead[0]?.name && <span> NOT ASSIGNED </span>}
                      </Col>

                      <Col lg={1}>
                        {task?.dueDate && (
                          <Badge
                            bg={
                              new Date(task?.dueDate) < new Date() &&
                              !(task?.status === "COMPLETED")
                                ? "danger"
                                : "primary"
                            }
                          >
                            Due{" "}
                            {moment(task?.dueDate?.split("T")[0]).format(
                              "MMM DD,YYYY"
                            )}
                          </Badge>
                          // onClick={() => handleViewDetails(task?._id)}
                        )}
                      </Col>
                    </Row>
                  </div>
                  {(userDetails.id === task?.assignedTo?._id ||
                    (userDetails?.role === "LEAD" &&
                      (userDetails.id === task?.assignedTo?._id ||
                        task?.lead?.includes(userDetails.id) ||
                        userDetails.id === task?.createdBy?._id)) ||
                    userDetails?.role === "SUPER_ADMIN" ||
                    userDetails?.role === "ADMIN") &&
                    !isArchive && (
                      <a
                        style={{
                          float: "right",
                          color: "#6c757d",
                          cursor: "pointer",
                          marginRight: "10px",
                          position: "relative",
                          top: "10px",
                        }}
                        onClick={() => {
                          setSelectedProject();
                          setShowAddTask(true);
                          setSelectedTask(task);
                        }}
                      >
                        <i className="fa fa-pencil-square-o" aria-hidden="true">
                          Edit
                        </i>
                      </a>
                    )}
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      ))}
      {projects && projects.length === 0 && (
        <p> {isArchive ? "No Task archived." : ""} </p>
      )}
    </Accordion>
  );
};

export default TaskList;