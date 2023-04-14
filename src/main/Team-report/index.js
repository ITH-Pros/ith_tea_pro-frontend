import React, { useEffect } from "react";
import avtar from "../../assests/img/avtar.png";
import { BsLinkedin, BsGithub, BsTwitter } from "react-icons/bs";
import "./index.css";
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

export default function TeamReport(props) {
  useEffect(() => {
    console.log("Team Report");
  }, []);

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
                <Tab eventKey="task" title={<span>Task <span className="text-dark">45546</span></span>} >
                  <div>Task</div>
                </Tab>
                <Tab eventKey="profile" title={<span>Task <span className="text-dark">45546</span></span>}>
                <div>rgsgse</div>
                </Tab>
                <Tab eventKey="contact" title={<span>Task <span className="text-dark">45546</span></span>}>
                <div>rgsgse</div>
                </Tab>
                <Tab eventKey="overduework" title={<span>Task <span className="text-dark">45546</span></span>}>
                <div>OVERDUE WORK</div>
                </Tab>
                <Tab eventKey="contact" title={<span>Task <span className="text-dark">45546</span></span>}>
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
