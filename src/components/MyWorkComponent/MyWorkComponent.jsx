import React from 'react';
import { Card, Col, Row, Tooltip, OverlayTrigger, Badge, Dropdown, Button } from 'react-bootstrap';
import moment from 'moment';
import "@pages/Dashbord/dashboard"

const MyWorkComponent = ({ myWorkList, userDetails, handleViewDetails, handleStatusChange, setSelectedProject, setShowAddTask, setSelectedTask }) => {
  return (
    <Col lg={6} style={{ paddingLeft: '0px' }}>
      {/* Your My Work component code */}
      <Row>
                <Col lg={6} className="left-add">
                  <span>MY WORK</span>
                </Col>
                <Col lg={6} className="right-filter"></Col>
              </Row>
              <Row>
                <Col lg={12} className="mt-3">
                  <Card
                    id="card-task"
                    className={
                      myWorkList?.length === 0 ? "alig-nodata" : "px-3"
                    }
                  >
                    {myWorkList && myWorkList?.length === 0 && (
                      <Row>
                        <Col lg="12">
                          <p>No task found.</p>
                        </Col>
                      </Row>
                    )}
                    {myWorkList &&
                      myWorkList?.length > 0 &&
                      myWorkList?.map((task) => (
                        <Row className="d-flex justify-content-start list_task w-100 mx-0">
                          {task?.isReOpen && (
                            <div className="red-flag">
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
                            <div className="red-flag">
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
                          <Col lg={4} className="middle">
                            {(userDetails.id === task?.assignedTo?._id ||
                              userDetails.role === "CONTRIBUTOR") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                  style={{ padding: "0" }}
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
                                      className="fa fa-check-circle secondary "
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
                              </Dropdown>
                            )}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>{task?.title}</Tooltip>}
                            >
                              <h5
                                onClick={() => handleViewDetails(task?._id)}
                                className="text-truncate"
                              >
                                {task?.title}
                              </h5>
                            </OverlayTrigger>
                          </Col>
                          <Col lg={4} className="middle">
                            {task?.status !== "COMPLETED" && (
                              <small>
                                <Badge
                                  bg={task?.dueToday ? "danger" : "primary"}
                                >
                                  {moment(task?.dueDate?.split("T")[0]).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Badge>
                              </small>
                            )}
                            {task?.status === "COMPLETED" && (
                              <small>
                                <Badge bg="success">
                                  {moment(
                                    task?.completedDate?.split("T")[0]
                                  ).format("DD/MM/YYYY")}
                                </Badge>
                              </small>
                            )}
                          </Col>
                          <Col
                            lg={2}
                            className="text-end middle"
                            style={{ justifyContent: "end" }}
                          >
                            <small>
                              {task?.status === "NOT_STARTED" && (
                                <Badge bg=" secondary ">NOT STARTED</Badge>
                              )}
                              {task?.status === "ONGOING" && (
                                <Badge bg="warning">ONGOING</Badge>
                              )}
                              {task?.status === "COMPLETED" && (
                                <Badge bg="success">COMPLETED</Badge>
                              )}
                              {task?.status === "ONHOLD" && (
                                <Badge bg="primary">ON HOLD</Badge>
                              )}
                            </small>
                          </Col>
                          <Col
                            lg={1}
                            id="dropdown_action"
                            className="text-end middle"
                          >
                            {((userDetails.role === "LEAD" &&
                              (userDetails.id === task?.assignedTo?._id ||
                                task?.lead?.includes(userDetails.id) ||
                                userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="defult"
                                  id="dropdown-basic"
                                >
                                  <i className="fa fa-ellipsis-v"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setSelectedProject();
                                      setShowAddTask(true);
                                      setSelectedTask(task);
                                    }}
                                  >
                                    <i
                                      className="fa fa-pencil-square"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Edit Task
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
              </Row>
    </Col>
  );
};

export default MyWorkComponent;
