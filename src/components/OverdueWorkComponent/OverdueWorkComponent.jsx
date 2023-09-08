import React, { useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Tooltip,
  OverlayTrigger,
  Badge,
  Dropdown,
} from "react-bootstrap";
import moment from "moment";
import avtar from "@assets/img/avtar.png";
import { Button } from "react-bootstrap";
import { getOverDueTaskListData } from "@services/user/api";
import { useQuery } from "react-query";
import CustomLoader from "@components/Shared/CustomLoader";
const OverdueWorkComponent = ({
  daysSince,
  userDetails,
  handleViewDetails,
  handleStatusChange,
  isRefetch,
  setShowAddTask,
  setSelectedTask,
}) => {
  const {
    isError,
    data: overdueWorkList,
    isLoading,
    isFetching,
  } = useQuery(
    ["getOverDueTaskListData", isRefetch],
    async () => await getOverDueTaskListData(),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        if (data?.error) {
          toast.dismiss();
          toast.info(
            data?.message || "Something Went Wrong While Fetching My Work Data"
          );
        } else {
          let allTask = data?.data;
          allTask?.map((item) => {
            let dateMonth = item?.dueDate?.split("T")[0];
            let today = new Date();
            today =
              today.getFullYear() +
              "-" +
              (today.getMonth() + 1 <= 9
                ? "0" + (today.getMonth() + 1)
                : today.getMonth() + 1) +
              "-" +
              (today.getDate() <= 9 ? "0" + today.getDate() : today.getDate());
            if (dateMonth === today) {
              item.dueToday = true;
            } else if (
              new Date().getTime() > new Date(item?.dueDate).getTime()
            ) {
              item.dueToday = true;
            } else {
              item.dueToday = false;
            }
          });
        }
        return data?.data;
      },
    }
  );

  return (
    <Col lg={6} style={{ paddingLeft: "0px" }}>
      <Row className="mb-3">
        <Col lg={6} className="left-add pb-1">
          <span>OVERDUE WORK</span>
        </Col>
        <Col lg={6} className="right-filter"></Col>
      </Row>
      <Row>
        <Col lg={12} className="mt-3">
          <Card
           
            className={!overdueWorkList?.length ? "alig-nodata" : "px-0"}
          >
            {isFetching && <CustomLoader/>}
            <div  id="card-task">
            {(isLoading) && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {overdueWorkList && overdueWorkList?.length === 0 && (
              <p className="text-center">No task found.</p>
            )}
            {overdueWorkList &&
              overdueWorkList?.length > 0 &&
              overdueWorkList?.map((task) => (
                <Row
                  key={task?._id}
                  className="d-flex justify-content-start list_task w-100 mx-0"
                >
                  <Col lg={4} className="middle">
                    {((userDetails?.role === "LEAD" &&
                      (userDetails.id === task?.assignedTo?._id ||
                        task?.lead?.includes(userDetails.id) ||
                        userDetails.id === task?.createdBy?._id)) ||
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
                              className="fa fa-check-circle secondary  "
                              aria-hidden="true"
                            ></i>{" "}
                            Not Started
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={(event) =>
                              handleStatusChange(event, task?._id, "ONGOING")
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
                              handleStatusChange(event, task?._id, "COMPLETED")
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
                              handleStatusChange(event, task?._id, "ONHOLD")
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
                          {daysSince(task?.dueDate?.split("T")[0]) + " Day ago"}
                          {/* {moment(task?.dueDate?.split("T")[0]).format(
                                    "DD/MM/YYYY"
                                  )} */}
                        </Badge>
                      </small>
                    )}
                    {task?.status === "COMPLETED" && (
                      <small>
                        <Badge bg="success">
                          {moment(task?.completedDate?.split("T")[0]).format(
                            "DD/MM/YYYY"
                          )}
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
                              <span className="nameTag" title="Assigned To">
                                <img src={avtar} alt="userAvtar" />{" "}
                                {task?.assignedTo?.name.split(" ")[0] + " "}
                                {task?.assignedTo?.name.split(" ")[1] &&
                                  task?.assignedTo?.name
                                    .split(" ")[1]
                                    ?.charAt(0) + "."}
                              </span>
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
                        <Badge bg="secondary">NOT STARTED</Badge>
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
                  <Col lg={1} id="dropdown_action" className="text-end middle">
                    {((userDetails?.role === "LEAD" &&
                      (userDetails.id === task?.assignedTo?._id ||
                        task?.lead?.includes(userDetails.id) ||
                        userDetails.id === task?.createdBy?._id)) ||
                      userDetails?.role === "SUPER_ADMIN" ||
                      userDetails?.role === "ADMIN") && (
                      <Dropdown>
                        <Dropdown.Toggle variant="defult" id="dropdown-basic">
                          <i className="fa fa-ellipsis-v"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
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
              </div>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default OverdueWorkComponent;
