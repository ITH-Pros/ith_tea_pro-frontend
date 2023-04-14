import React, { useEffect, useState } from "react";
import avtar from "../../assests/img/avtar.png";
import { BsLinkedin, BsGithub, BsTwitter } from "react-icons/bs";
import "./index.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";


import {
  Row,
  Container,
  Nav,
  Dropdown,
  Card,
  Button,
  Badge,
  Tab,
  Tabs,
  Col,
} from "react-bootstrap";
import { getUserReportData } from "../../services/user/api";
import { useAuth } from "../../auth/AuthProvider";

export default function TeamReport(props) {

    const [teamWorkList, setTeamWorkList] = useState([]);
  const { userDetails } = useAuth();
    


  useEffect(() => {
    console.log("Team Report");
    getUserReport();
  }, []);

  const getUserReport = async () => {
    let dataToSend = {
      userId: "6418afee47d49ebd9b3a124f",
      overDueTasks: true,
    };
    try {
      const res = await getUserReportData(dataToSend);
      if (res.error) {
        console.log("Error while getting team work list");
      } else {
        setTeamWorkList(res?.data);
      }
    } catch (error) {
      return error.message;
    }
  };

  function daysSince(dateStr) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const currentDate = new Date();
    const date = new Date(dateStr);
    const diffDays = Math?.round(Math?.abs((currentDate - date) / oneDay));
    return diffDays;
  }

  return (
    <div className="rightDashboard" style={{ marginTop: "7%" }}>
      <div>
        {/* <Card className="py-4 px-4">
          <Row>
            <Col></Col>
          </Row>
        </Card> */}
        <Card className="py-4 px-4">
          <Row className="align-middle d-flex">
            <Col lg="1">
              <div className="profile-userpic">
                <img src={avtar} alt="userAvtar" />{" "}
              </div>
            </Col>
            <Col lg="6" className="user_details px-5 py-2">
              <h1>Ayush (CONTRIBUTOR)</h1>
              <h2>Frontend Developer</h2>
              <p>ayush@ith.tech</p>
            </Col>
            <Col lg="5" className="px-5 py-2 text-end">
              <Button variant="link" size="lg">
                <BsLinkedin />
              </Button>
              <Button variant="secendery" size="lg" className="px-0">
                <BsGithub />
              </Button>
              <Button variant="link" size="lg">
                <BsTwitter />
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg={12}>
              <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab
                  eventKey="task"
                  title={
                    <span>
                      Task <span className="text-dark">45546</span>
                    </span>
                  }
                >
                  <div>
                  {teamWorkList && teamWorkList?.length === 0 && (
                      <p className="text-center">No task found.</p>
                    )}
                    {teamWorkList &&
                      teamWorkList?.length > 0 &&
                      teamWorkList?.map((task) => (
                        <Row className="d-flex justify-content-start list_task w-100 mx-0">
                          <Col lg={4} className="middle">
                            {((userDetails.role === "LEAD" &&
                              (userDetails.id === task?.assignedTo?._id ||
                                task?.lead?.includes(userDetails.id) ||
                                userDetails.id === task?.createdBy?._id)) ||
                              userDetails.role === "SUPER_ADMIN" ||
                              userDetails.role === "ADMIN") && (
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
                                      className="fa fa-check-circle warning"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </Dropdown.Toggle>

                              
                              </Dropdown>
                            )}

                            {/* <h5 className="text-truncate">{task?.title}</h5> */}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>{task?.title}</Tooltip>}
                            >
                              <h5
                                // onClick={() => handleViewDetails(task?._id)}
                                className="text-truncate"
                              >
                                {task?.title}
                              </h5>
                            </OverlayTrigger>
                          </Col>
                          <Col lg={2} className="middle">
                            {task?.status !== "COMPLETED" && (
                              <small>
                                <Badge
                                  bg={task?.dueToday ? "danger" : "primary"}
                                >
                                  {daysSince(task?.dueDate?.split("T")[0]) +
                                    " Day ago"}
                                  {/* {moment(task?.dueDate?.split("T")[0]).format(
                                    "DD/MM/YYYY"
                                  )} */}
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
                                      <span
                                        className="nameTag"
                                        title="Assigned To"
                                      >
                                        <img src={avtar} alt="userAvtar" />{" "}
                                        {task?.assignedTo?.name.split(" ")[0] +
                                          " "}
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
                                <Badge bg="primary">NOT STARTED</Badge>
                              )}
                              {task?.status === "ONGOING" && (
                                <Badge bg="warning">ONGOING</Badge>
                              )}
                              {task?.status === "COMPLETED" && (
                                <Badge bg="success">COMPLETED</Badge>
                              )}
                              {task?.status === "ONHOLD" && (
                                <Badge bg="secondary">ON HOLD</Badge>
                              )}
                            </small>
                          </Col>
                          
                        </Row>
                      ))}
                  </div>
                </Tab>
                <Tab
                  eventKey="profile"
                  title={
                    <span>
                      Task <span className="text-dark">45546</span>
                    </span>
                  }
                >
                  <div>rgsgse</div>
                </Tab>
                <Tab
                  eventKey="contact"
                  title={
                    <span>
                      Task <span className="text-dark">45546</span>
                    </span>
                  }
                >
                  <div>rgsgse</div>
                </Tab>
                <Tab
                  eventKey="overduework"
                  title={
                    <span>
                      Task <span className="text-dark">45546</span>
                    </span>
                  }
                >
                  <div>OVERDUE WORK</div>
                </Tab>
                <Tab
                  eventKey="contact"
                  title={
                    <span>
                      Task <span className="text-dark">45546</span>
                    </span>
                  }
                >
                  <div>rgsgse</div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
