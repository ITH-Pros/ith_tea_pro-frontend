import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Card,
  Col,
  Row,
  Badge,
  OverlayTrigger,
  Tooltip,
  Button,
  Dropdown,
} from "react-bootstrap";
import avtar from "@assets/img/avtar.png";

const TaskVerificationSkeleton = () => {
  return (
 
      <Row>
        <Col lg={12} className="mt-3">
          <Card style={{ border: '0px', borderRadius: '10px' }}>
            <div id="card-task" style={{ boxShadow: 'none' }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Row key={index} className="d-flex justify-content-start list_task w-100 mx-0">
                <Col lg={5} className="middle">
                  <span
                    style={{
                      fontSize: "20PX",
                      marginRight: "10px",
                    }}
                    round="20px"
                  >
                    <Skeleton borderRadius={15} width={30} height={25} />
                  </span>
                  <Skeleton borderRadius={15} width={200} height={25} />
                </Col>
                <Col lg={2} className="middle">
                  <small>
                      <Skeleton style={{marginLeft:'10px'}} borderRadius={15} width={60} height={25} />
                  </small>
                </Col>
                <Col lg={1} className="text-end middle ps-0" style={{ justifyContent: "end" }}>
                  <small>
                      <Skeleton borderRadius={15} width={50} height={25} />
                  </small>
                </Col>
                <Col lg={1} className="text-end middle">
                  <small>
                      <Skeleton borderRadius={15}  width={50} height={25} />
                  </small>
                </Col>
                <Col lg={3} className="text-end middle px-0" style={{ justifyContent: "end" }}>
                  <Skeleton width={80} height={25} />
                </Col>
              </Row>
            ))}
              {/* Additional task rows go here */}
            </div>
          </Card>
        </Col>
      </Row>
  );
};

export default TaskVerificationSkeleton;
