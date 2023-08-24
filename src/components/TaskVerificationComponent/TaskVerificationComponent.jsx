import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Tooltip,
  OverlayTrigger,
  Badge,
  Dropdown,
  Form,
  Button,
} from "react-bootstrap";
import moment from "moment";
import leadAvatar from "@assets/img/leadAvatar.jpeg";
import avtar from "@assets/img/avtar.png";
import { getAllPendingRating, getAllUsers } from "@services/user/api";
import { useQuery } from "react-query";

const TaskVerificationComponent = ({
  userDetails,
  handleViewDetails,
  openVerifyModal,
  verifyTaskNotAllowedRoles,
  isRefetch,
}) => {
  let params = {
    limit: 50,
    currentPage: 1,
  };

  const { data: teamMembers } = useQuery(
    ["getAllUsers"],
    () => getAllUsers({ params }),
    {
      enabled: userDetails?.role !== "CONTRIBUTOR",
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data?.users;
      },
    }
  );

  const [verifyTeamMember, setVerifyTeamMember] = useState("");
  const getFormattedDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const {
    data: pendingRatingList,
    error,
    isLoading,
    isFetching,
  } = useQuery(
    ["getAllPendingRating", verifyTeamMember, isRefetch],
    () => {
      const payload = {};
      if (verifyTeamMember) {
        payload.memberId = verifyTeamMember;
      }
      return getAllPendingRating(payload);
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        if (data.error) {
          toast.dismiss();
          toast.info(
            data?.message ||
              "Something Went Wrong while fetching Pending Ratings Data"
          );
          return [];
        }

        let allTask = data?.data?.tasks || [];
        const today = getFormattedDate(new Date());

        allTask.forEach((item) => {
          let dateMonth = item?.dueDate?.split("T")[0];
          if (dateMonth === today) {
            item.dueToday = true;
          } else if (new Date().getTime() > new Date(item?.dueDate).getTime()) {
            item.dueToday = true;
          } else {
            item.dueToday = false;
          }
        });
        return data?.data;
      },
    }
  );

  return (
    <Col lg={6} style={{ paddingRight: "0px" }}>
      <Row>
        <Col lg={12} className="left-add varificationTask">
          <span>TASK VERIFICATION</span>
          {(userDetails?.role === "SUPER_ADMIN" ||
            userDetails?.role === "ADMIN") && (
            <Form.Group
              controlId="formBasicEmail"
              className="team-member-select mb-0 "
            >
              <Form.Label>Team Member</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) => {
                  setVerifyTeamMember(event.target.value);
                }}
              >
                <option value="">All</option>
                {teamMembers &&
                  teamMembers.map((member) => (
                    <option value={member?._id}>{member?.name}</option>
                  ))}
              </Form.Control>
            </Form.Group>
          )}
        </Col>
      </Row>
      <Row>
        <Col lg={12} className="mt-3">
          <Card
            id="card-task"
            className={pendingRatingList?.length === 0 ? "alig-nodata" : "px-3"}
          >
            {pendingRatingList && pendingRatingList?.length === 0 && (
              <p>No task found.</p>
            )}
            {isLoading && <p className="text-center">Loading...</p>}

            {isFetching && !isLoading && (
              <div className="text-left refresh">Refreshing List....</div>
            )}

            {pendingRatingList &&
              pendingRatingList?.length > 0 &&
              pendingRatingList?.map((task) => (
                <Row className="d-flex justify-content-start list_task w-100 mx-0">
                  <Col lg={5} className="middle">
                    <span
                      style={{
                        fontSize: "20PX",
                        marginRight: "10px",
                      }}
                      round="20px"
                    >
                      {task?.status === "COMPLETED" && (
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                        ></i>
                      )}
                    </span>
                    {/* <h5 className="text-truncate">{task?.title}</h5> */}
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
                    {task?.isReOpen && (
                      <div className="red-flag">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Re-opened</Tooltip>}
                        >
                          <i className="fa fa-retweet" aria-hidden="true"></i>
                        </OverlayTrigger>
                      </div>
                    )}
                    {task?.isDelayTask && (
                      <div className="red-flag">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Overdue</Tooltip>}
                        >
                          <i className="fa fa-flag" aria-hidden="true"></i>
                        </OverlayTrigger>
                      </div>
                    )}
                  </Col>
                  <Col lg={2} className="middle">
                    {task?.status !== "COMPLETED" && (
                      <small>
                        <Badge bg={task?.dueToday ? "danger" : "primary"}>
                          {moment(task?.dueDate?.split("T")[0])}
                        </Badge>
                      </small>
                    )}
                    {task?.status === "COMPLETED" && (
                      <small>
                        {" "}
                        <Badge bg="success">
                          {moment(task?.completedDate?.split("T")[0]).format(
                            "DD/MM/YYYY"
                          )}
                        </Badge>
                      </small>
                    )}
                  </Col>
                  <Col
                    lg={3}
                    className="text-end middle ps-0"
                    style={{ justifyContent: "end" }}
                  >
                    <small>
                      {task?.status === "NOT_STARTED" && (
                        <Badge bg="secondary">NOT STARTED</Badge>
                      )}
                      {task?.status === "ONGOING" && (
                        <Badge bg="warning">ONGOING</Badge>
                      )}
                      {task?.status === "COMPLETED" && (
                        <>
                          <>
                            {["top"].map((placement) => (
                              <OverlayTrigger
                                key={placement}
                                placement={placement}
                                overlay={
                                  <Tooltip id={`tooltip-${placement}`}>
                                    {task?.lead[0]?.name}
                                  </Tooltip>
                                }
                              >
                                <Button className="tooltip-button">
                                  {task?.lead[0]?.name && (
                                    <span className="nameTag" title="Lead">
                                      <img src={leadAvatar} alt="userAvtar" />{" "}
                                      {task?.lead[0]?.name
                                        .split(" ")[0]
                                        ?.charAt(0)}
                                      {task?.lead[0]?.name
                                        .split(" ")[1]
                                        ?.charAt(0)}
                                    </span>
                                  )}
                                </Button>
                              </OverlayTrigger>
                            ))}
                          </>

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
                                    <span
                                      className="nameTag"
                                      title="Assigned To"
                                    >
                                      <img src={avtar} alt="userAvtar" />{" "}
                                      {task?.assignedTo?.name
                                        .split(" ")[0]
                                        ?.charAt(0)}
                                      {task?.assignedTo?.name
                                        .split(" ")[1]
                                        ?.charAt(0)}
                                    </span>
                                  )}
                                </Button>
                              </OverlayTrigger>
                            ))}
                          </>
                        </>
                      )}
                      {task?.status === "ONHOLD" && (
                        <Badge bg="primary">ON HOLD</Badge>
                      )}
                    </small>
                  </Col>

                  {/* {(userDetails?.role !== "CONTRIBUTOR" || userDetails?.role !== "GUEST" )   && ( */}
                  {!verifyTaskNotAllowedRoles.includes(userDetails?.role) && (
                    <Col
                      lg={2}
                      className="text-end middle px-0"
                      style={{ justifyContent: "end" }}
                    >
                      <Button
                        onClick={() => {
                          openVerifyModal(task._id);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Verify
                      </Button>
                    </Col>
                  )}
                </Row>
              ))}
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default TaskVerificationComponent;
