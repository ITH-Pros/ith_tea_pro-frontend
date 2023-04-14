import React, { useEffect, useState } from "react";
import avtar from "../../assests/img/avtar.png";
import { BsLinkedin, BsGithub, BsTwitter } from "react-icons/bs";
import "./index.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";
import { Link } from "react-router-dom";
import Select from "react-select";
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
import { getUserReportData } from "../../services/user/api";
import { useAuth } from "../../auth/AuthProvider";
const customStyles = {
  option: (provided) => ({
    ...provided,
    padding: 5,
  }),

  control: (provided) => ({
    ...provided,
    boxShadow: "none",

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
export default function TeamReport(props) {
  const [teamWorkList, setTeamWorkList] = useState([]);
  const { userDetails } = useAuth();
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
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
        <Card className="py-4 px-4">
          <Row>
            <Col lg="6" className="m-auto">
              <Select
                styles={customStyles}
                options={options}
                placeholder="Select Member"
              />
            </Col>
          </Row>
        </Card>
        <Card className="py-4 px-4">
          <Row className="align-middle d-flex">
            <Col lg="1">
              <div className="profile-userpic">
                <img src={avtar} alt="userAvtar" />{" "}
              </div>
            </Col>
            <Col lg="5" className="user_details px-5 py-2">
              <h1>Ayush (CONTRIBUTOR)</h1>
              <h2>Frontend Developer</h2>
              <p>ayush@ith.tech</p>
              Lead - <Badge bg="dark">Vijay Pandey</Badge>
            </Col>
            <Col lg="3 py-4">
              {/* <p>
                Lead - <Badge bg="primary">Vijay Pandey</Badge>
              </p> */}
            </Col>
            <Col lg="3" className="px-5 py-2 text-end">
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
            <Col lg={12} id="task_user">
              <Tabs
                defaultActiveKey="task"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab
                  eventKey="task"
                  title={
                    <span>
                      Task <span className="text-muted">(45546)</span>
                    </span>
                  }
                >
                  <div>
                    <Table responsive="md">
                      <tbody>
                        <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/" className="text-muted">
                                Started working on the ONDM Android MOBILE APP
                              </Link>
                            </p>
                          </td>
                          <td style={{ width: "150px" }}>
                            <Badge bg="danger">14/04/2023</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Assigned :</b> Rajesh kumar
                            </small>
                          </td>
                          <td style={{ width: "50px" }}>
                            <Badge bg="warning">Pending</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/" className="text-muted">
                                Started working on the ONDM Android MOBILE APP
                              </Link>
                            </p>
                          </td>
                          <td style={{ width: "150px" }}>
                            <Badge bg="danger">14/04/2023</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Assigned :</b> Rajesh kumar
                            </small>
                          </td>
                          <td style={{ width: "50px" }}>
                            <Badge bg="warning">Pending</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/">
                                Started working on the ONDM Android MOBILE APP
                              </Link>
                            </p>
                          </td>
                          <td style={{ width: "150px" }}>
                            <Badge bg="danger">14/04/2023</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Assigned :</b> Rajesh kumar
                            </small>
                          </td>
                          <td style={{ width: "50px" }}>
                            <Badge bg="warning">Pending</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Tab>

                <Tab
                  eventKey="contact"
                  title={
                    <span>
                      Over Due Tasks <span className="text-muted">(45546)</span>
                    </span>
                  }
                >
                  <div>rgsgse</div>
                </Tab>
                <Tab
                  eventKey="overduework"
                  title={
                    <span>
                      Pending Task <span className="text-muted">(45546)</span>
                    </span>
                  }
                >
                  <div>OVERDUE WORK</div>
                </Tab>
                <Tab
                  eventKey="contact"
                  title={
                    <span>
                      Delay Rated <span className="text-muted">(45546)</span>
                    </span>
                  }
                >
                  <div>rgsgse</div>
                </Tab>
                <Tab
                  eventKey="profile"
                  title={
                    <span>
                      Extra Contribution{" "}
                      <span className="text-muted">(45546)</span>
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
