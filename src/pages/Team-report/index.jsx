/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import avtar from "@assets/img/avtar.png";
import "./index.css";
import { Bar } from "react-chartjs-2";
import Loader from "@components/Shared/Loader/index";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
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
  Table,
} from "react-bootstrap";
import {
  getUserReportData,
  getAllUsersWithAdmin,
  getUserDetailsByUserId,
} from "@services/user/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RatingGraph from "@components/Rating/rating-graph/rating-graph";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { convertToUTCDay } from "@helpers/index";
import { Tooltip } from "@material-ui/core";
// import { Tooltip } from 'antd';
const customStyles = {
  option: (provided) => ({
    ...provided,
    padding: 5,
    fontSize: "13px",
  }),

  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    fontSize: "13px",
    borderRadius: "5px",
    color: "#767474",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: 14,
    borderRadius: "0px 0px 10px 10px",
    boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.05)",
    top: "40px",
    padding: "5px",
    zIndex: "2",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0px 10px",
  }),
};

const UserAnalyticsGraph = ({ selectedProject, estimatedTimeData, completionTimeData }) => {
  const chartData = {
    labels: ['Task 1', 'Task 2', 'Task 3', 'Task 4'], // Replace with task labels or categories
    datasets: [
      {
        label: 'Estimated Time',
        data: estimatedTimeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Completion Time',
        data: completionTimeData,
        backgroundColor: 'rgba(192, 75, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h5>User Analytics for {selectedProject.label}</h5>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default function TeamReport(props) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [usersList, setUsersListValue] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("task");
  const [loading, setLoading] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // New state variable for selected project

  const {data:userDetails , isLoading:isLoadingUserDetails} = useQuery(['userDetails' , selectedOption , selectedEvent] ,() => getUserDetailsByUserId({ params: { userId: selectedOption.value } }) , {
    enabled: !!selectedOption && !!selectedEvent,
    refetchOnWindowFocus: false,
    select: (data) => data.data,
  })


  useEffect(() => {
    if (userDetails?.role === "CONTRIBUTOR") {
      setShowTags(false);
    } else {
      setShowTags(true);
    }
  }, [userDetails]);


  const getUserReport =  () => {
    if (!selectedOption?.value || !selectedEvent) {
      return;
    }
    let dataToSend = {
      userId: selectedOption?.value,
    };
    if (selectedEvent) {
      if (selectedEvent === "task") {
        dataToSend.todayTasks = true;
        dataToSend.currentDate = convertToUTCDay(new Date());
      } else if (selectedEvent === "overduetask") {
        dataToSend.overDueTasks = true;
      } else if (selectedEvent === "pendingtask") {
        dataToSend.pendingRatingTasks = true;
      } else if (selectedEvent === "delaytask") {
        dataToSend.isDelayRated = true;
      } else {
        dataToSend.adhocTasks = true;
      }
    }
    return dataToSend;
  };

const {data:teamWorkList} = useQuery(['userReport' , selectedOption , selectedEvent] ,() => getUserReportData(getUserReport()) , {
   refetchOnWindowFocus: false,
    enabled: !!selectedOption && !!selectedEvent,
    select: (data) => {
      return data?.data;
    }
  })

  const { isLoading:isUsersLoading } = useQuery('userList' , () => getAllUsersWithAdmin() , {
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: (data) => {
      setUsersListValue(data?.data?.users || []);
        if (localStorage.getItem("selectedOptions")) {
          setSelectedOption(
            JSON.parse(localStorage.getItem("selectedOptions"))
          );
        }
    }
  })

  const handleTabSelect = (eventKey) => {
    setSelectedEvent(eventKey);
  };

  const handleSelectChange = (selectedOption) => {
    localStorage.setItem("selectedOptions", JSON.stringify(selectedOption));
    // getUserDetails(selectedOption.value);
    setSelectedOption(selectedOption);
  };

  // New project options (hard-coded data for the select box)
  const projectOptions = [
    { value: "project1", label: "Project 1" },
    { value: "project2", label: "Project 2" },
    { value: "project3", label: "Project 3" },
    // Add more projects as needed...
  ];

  // Event handler for the project select box
  const handleProjectSelect = (selectedOption) => {
    setSelectedProject(selectedOption);
  };

  return (
    <div className="rightDashboard" style={{ marginTop: "6%" }}>
      <div>
        <div className={selectedOption ? "c_card" : "v_card"}>
          <Card className="py-2 px-2 " style={{ width: "300px" }}>
            <Row>
              <Col lg="12" className="m-auto">
                <Select
                  styles={customStyles}
                  value={selectedOption}
                  onChange={handleSelectChange}
                  options={usersList}
                  placeholder="Select Member"
                  loadingMessage={() => "Loading..."}
                  isLoading={isUsersLoading}
                />
              </Col>
            </Row>
          </Card>
        </div>
        <div style={{ clear: "both" }}></div>
        {selectedOption && (
          <Card
            className="py-4 px-4 mb-4"
            style={{ borderRadius: "10px", border: "0px" }}
          >
            <Row className="align-middle ">
              <Col lg="6" className="user_details  py-2 text-center">
                <div className="profile-userpic m-auto mb-3 mt-4">
                  <img src={userDetails?.profilePicture || avtar} />{" "}
                </div>
                <h1>
                  {userDetails?.name || "--"} ({userDetails?.role || "--"})
                </h1>
                <h2>
                  {userDetails?.department || "--"} - (
                  {userDetails?.designation || "--"})
                </h2>
                <p>{userDetails?.email || "--"}</p>

                <div className="team-socail">
                  {userDetails?.githubLink && (
                    <a
                      href={userDetails?.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faGithub} />
                    </a>
                  )}

                  {userDetails?.linkedInLink && (
                    <a
                      href={userDetails?.linkedInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  )}

                  {userDetails?.twitterLink && (
                    <a
                      href={userDetails?.twitterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  )}
                </div>
              </Col>
              <Col lg="6 ">
                <RatingGraph selectedUserId={selectedOption.value} />
              </Col>
            </Row>
            <hr />
            <Row>
              <Col lg={12} id="task_user">
                <Tabs
                  defaultActiveKey="task"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                  onSelect={handleTabSelect}
                >
                  <Tab
                    eventKey="task"
                    disabled={selectedEvent === "task"}
                    title={
                      <span>
                        Task{" "}
                        {selectedEvent === "task" && (
                          <span className="text-muted">
                            ({teamWorkList?.length})
                          </span>
                        )}
                      </span>
                    }
                  >
                    <div >
                      <Table responsive="md" className="mb-0">
                        <tbody>
                          {teamWorkList?.map((team, index) => [
                            <tr>
                              <td style={{ width: "150px" }}>
                              <Tooltip title={team?.title || "--"}>
                                <p className="text-truncate">
                                 
                                  <Link
                                    to={`/view-task/${team._id}`}
                                    className="text-muted"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {team?.title || "--"}
                                  </Link>
                                  
                                </p>
                                </Tooltip>
                              </td>
                              <td style={{ width: "150px" }}>
                                <Badge bg="primary">
                                  Due : {team?.dueDate?.split("T")[0] || "--"}
                                </Badge>
                              </td>
                              <td style={{ width: "150px" }}>
                                <small className="text-muted">
                                  <b>Status :</b>
                                  {team?.status || "--"}
                                </small>
                              </td>
                              <td style={{ width: "150px" }}>
                                <small className="text-muted">
                                  <b>Lead :</b>
                                  {team?.lead[0]?.name || "--"}
                                </small>
                              </td>
                              <td style={{ width: "150px" }}>
                                {team?.completedDate && (
                                  <Badge bg="success">
                                    Completed :{" "}
                                    {team?.completedDate?.split("T")[0] || "--"}
                                  </Badge>
                                )}
                              </td>
                              <td style={{ width: "150px" }}>
                                {team?.isRated && (
                                  <small className="text-muted">
                                    <b>Rating :</b>
                                    {team?.rating || "--"}
                                  </small>
                                )}
                              </td>
                            </tr>,
                          ])}
                          <tr Col="6" className="no_data_found">
                            {" "}
                            {!teamWorkList?.length && <p>No Tasks Found</p>}
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  {/* Other tabs with similar code for different eventKeys... */}

                  <Tab
                    eventKey="useranalytics"
                    disabled={selectedEvent === "useranalytics"}
                    title={
                      <span>
                        User Analytics{" "}
                        {selectedEvent === "useranalytics" && (
                          <span className="text-muted">
                            ({teamWorkList?.length})
                          </span>
                        )}
                      </span>
                    }
                  >
                    <div>
                      <Row>
                        <Col lg={12}>
                          <h4 className="mb-3">User Analytics</h4>
                          <Select
                            styles={customStyles}
                            value={selectedProject}
                            onChange={handleProjectSelect}
                            options={projectOptions}
                            placeholder="Select Project"
                          />
                          {selectedProject && (
                            <UserAnalyticsGraph
                              selectedProject={selectedProject}
                              estimatedTimeData={[10, 15, 20, 12]} // Replace with the actual data for Estimated Time
                              completionTimeData={[8, 14, 18, 10]} // Replace with the actual data for Task Completion Time
                            />
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Card>
        )}
      </div>
      {loading ? <Loader /> : null}
    </div>
  );
}
