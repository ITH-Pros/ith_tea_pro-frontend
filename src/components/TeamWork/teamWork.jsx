/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import moment from "moment";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "../../pages/Dashbord/dashboard.css";
import Col from "react-bootstrap/Col";

import avtar from "@assets/img/avtar.png";
import { Row, Container, Dropdown, Card, Button, Badge } from "react-bootstrap";
import CustomCalendar from "@components/CustomCalender/custom-calender";
import { formatDateToTeam } from "@helpers/index";

const Teamwork = ({
  userDetails,
  setSelectedTask,
  setShowAddTask,
  setSelectedProject,
  isRefetch,
  isChange,
  handleStatusChange,
  handleViewDetails,
  openReopenTaskModal,
}) => {
  const [teamWorkList, setTeamWorkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  return (
    <Container>
      <Row className="mt-3">
        <Col lg={12} style={{ paddingLeft: "0px" }}>
          <Row>
            <Col lg={6} className="left-add">
              <span>Team Work</span>
            </Col>
            <Col lg={6} className="right-filter"></Col>
          </Row>
          <Row>
            <Col lg={12} className="mt-3">
              <Card
                id="card-task"
                style={{
                  overflowX: "hidden",
                  paddingTop: "0px",
                  height: "auto",
                }}
              >
                <CustomCalendar
                  setTeamWorkList={setTeamWorkList}
                  isChange={isChange}
                  setIsLoading={setIsLoading}
                  setIsFetching={setIsFetching}
                  isRefetch={isRefetch}
                />
                <div
                  className="mt-3"
                  style={{
                    height: "90vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <div id="list_ui" className="mt-2">
                    <Row
                      className={
                        teamWorkList?.length === 0 ? "alig-nodata" : "px-0"
                      }
                    >
                      {(isLoading || isFetching) && (
                        <div className="text-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}

                      {teamWorkList &&
                        teamWorkList?.length > 0 &&
                        teamWorkList?.map((task, taskIndex) => (
                          <>
                            {taskIndex === 0 ||
                            task.dueDate !==
                              teamWorkList[taskIndex - 1].dueDate ? (
                              <Col
                                lg={1}
                                className="border-top day v-align completed_task"
                              >
                                {formatDateToTeam(task.dueDate)}
                              </Col>
                            ) : (
                              <Col lg={1} className="v-align "></Col>
                            )}
                            <Col
                              lg={11}
                              className="border-start border-bottom d-flex justify-content-start px-0"
                            >
                              <Row className="d-flex justify-content-start list_task w-100 mx-0 mb-0 px-2">
                                <Col lg={4} className="middle">
                                  {((userDetails?.role === "LEAD" &&
                                    (userDetails.id === task?.assignedTo?._id ||
                                      task?.lead?.includes(userDetails.id) ||
                                      userDetails.id ===
                                        task?.createdBy?._id)) ||
                                    userDetails?.role === "SUPER_ADMIN" ||
                                    userDetails?.role === "ADMIN") && (
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
                                            className="fa fa-check-circle  secondary "
                                            aria-hidden="true"
                                          ></i>
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
                                          ></i>
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
                                            className="fa fa-check-circle primary "
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
                                      onClick={() =>
                                        handleViewDetails(task?._id)
                                      }
                                      className="text-truncate"
                                    >
                                      {task?.title}
                                    </h5>
                                  </OverlayTrigger>
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
                                </Col>
                                <Col lg={2} className="middle">
                                  {task?.status !== "COMPLETED" && (
                                    <small>
                                      <Badge
                                        bg={
                                          task?.dueToday ? "danger" : "primary"
                                        }
                                      >
                                        {moment(
                                          task?.dueDate?.split("T")[0]
                                        ).format("DD/MM/YYYY")}
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
                                <Col lg={3} className="middle">
                                  <>
                                    {["top"].map((placement) => (
                                      <OverlayTrigger
                                        key={placement}
                                        placement={placement}
                                        overlay={
                                          <Tooltip id={`tooltip-${placement}`}>
                                            {task?.assignedTo?.name}
                                          </Tooltip>
                                        }
                                      >
                                        <Button className="tooltip-button br0">
                                          {task?.assignedTo?.name && (
                                            <small
                                              className="nameTag text-truncate pt-2"
                                              title="Assigned To"
                                            >
                                              <img
                                                src={avtar}
                                                alt="userAvtar"
                                              />{" "}
                                              {task?.assignedTo?.name.split(
                                                " "
                                              )[0] + " "}
                                              {task?.assignedTo?.name.split(
                                                " "
                                              )[1] &&
                                                task?.assignedTo?.name
                                                  .split(" ")[1]
                                                  ?.charAt(0) + "."}
                                            </small>
                                          )}
                                        </Button>
                                      </OverlayTrigger>
                                    ))}
                                  </>
                                </Col>
                                <Col
                                  lg={2}
                                  className="text-end middle"
                                  style={{ justifyContent: "end" }}
                                >
                                  <small>
                                    {task?.status === "NOT_STARTED" && (
                                      <Badge bg=" secondary">NOT STARTED</Badge>
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
                                  className="text-end "
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                  }}
                                >
                                  {((userDetails?.role === "LEAD" &&
                                    (userDetails.id === task?.assignedTo?._id ||
                                      task?.lead?.includes(userDetails.id) ||
                                      userDetails.id ===
                                        task?.createdBy?._id)) ||
                                    userDetails?.role === "SUPER_ADMIN" ||
                                    userDetails?.role === "ADMIN") && (
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        variant="defult"
                                        id="dropdown-basic"
                                        style={{
                                          padding: "0px",
                                          textAlign: "end",
                                        }}
                                      >
                                        <i className="fa fa-ellipsis-v"></i>
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          onClick={() => {
                                            setSelectedTask(task);
                                            setShowAddTask(true);
                                          }}
                                        >
                                          Edit
                                        </Dropdown.Item>
                                        {task?.status === "COMPLETED" && (
                                          <Dropdown.Item
                                            onClick={() => {
                                              openReopenTaskModal(task);
                                            }}
                                          >
                                            Reopen task
                                          </Dropdown.Item>
                                        )}
                                        <Dropdown.Item>
                                          Add Subtask
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </>
                        ))}
                      {teamWorkList &&
                        !isLoading &&
                        !isFetching &&
                        teamWorkList?.length === 0 && <p>No task found.</p>}
                    </Row>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Teamwork;
