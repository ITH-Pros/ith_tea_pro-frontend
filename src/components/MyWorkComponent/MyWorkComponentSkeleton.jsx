import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Card,
  Col,
  Row,
  Tooltip,
  OverlayTrigger,
  Badge,
  Dropdown,
} from "react-bootstrap";
import CustomLoader from "@components/Shared/CustomLoader";

export default function MyWorkComponentSkeleton() {
    const skeletonStyle = {
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
      };
  return (
    <Col lg={6} style={{ paddingLeft: "0px" }}>
      {/* Your My Work component code */}
      <Row>
        <Col lg={6} className="left-add">
          <span>
            <Skeleton />
          </span>
        </Col>
        <Col lg={6} className="right-filter"></Col>
      </Row>
      <Row>
      <Col lg={12} className="mt-3">
              <Card className="px-0">
                <div id="card-task">
                {Array.from({ length: 7 }).map((_, index) => (
                <Row className="d-flex justify-content-start list_task w-100 mx-0">
                  <Col lg={4} className="middle">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="success"
                        id="dropdown-basic"
                        style={{ padding: "0" }}
                      >
                        <Skeleton borderRadius={15} width={30} height={25} />
                      </Dropdown.Toggle>
                    </Dropdown>
                    <Skeleton style={{marginLeft:"10px"}} width={100} height={25} />
                  </Col>
                  <Col lg={2} className="middle">
                        <Skeleton height={25} width={60} />
                  </Col>
                  <Col lg={3} className="middle">
                    <Skeleton width={100} height={25} />
                  </Col>
                  <Col
                    lg={2}
                    className="text-end middle"
                    style={{ justifyContent: "end" }}
                  >
                    <small>
                        <Skeleton width={100} height={25} />
           
                    </small>
                  </Col>
                  <Col lg={1} id="dropdown_action" className="text-end middle">
                    <Dropdown>
                      <Dropdown.Toggle variant="defult" id="dropdown-basic">
                        <Skeleton width={30} height={25} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <Skeleton width={100} height={25} />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              ))}
                </div>
              </Card>
            </Col>
      </Row>
    </Col>
  );
}
