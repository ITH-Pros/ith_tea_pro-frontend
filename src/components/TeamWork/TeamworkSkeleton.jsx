import React from "react";
import { Row, Container, Col, Card, Badge } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TeamworkSkeleton = () => {
  return (
    <Row className="px-0">
      {Array.from({ length: 5 }).map((_, index) => (
        <React.Fragment key={index}>
          <>
            <Col lg={1} className="v-align "></Col>
            <Col key={index}
              lg={11}
              className="border-start border-bottom d-flex justify-content-start px-0"
            >
              <Row className="d-flex justify-content-start list_task w-100 mx-0 mb-0 px-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <>
                    <Col lg={4} className="middle">
                      <span>
                        <Skeleton circle={true} height={20} width={20} />
                      </span>
                      <h5 className="text-truncate">
                        <Skeleton
                          style={{ marginLeft: "5px" }}
                          borderRadius={5}
                          height={20}
                          width={300}
                        />
                      </h5>
                    </Col>
                    <Col lg={2} className="middle">
                      <small>
                        <Skeleton borderRadius={5} height={20} width={80} />
                      </small>
                    </Col>
                    <Col lg={3} className="middle">
                      <small>
                        <span
                          className="nameTag text-truncate pt-2"
                          title="Assigned To"
                        >
                          <Skeleton borderRadius={5} height={20} width={80} />
                        </span>
                      </small>
                    </Col>
                    <Col
                      lg={2}
                      className="text-end middle"
                      style={{ justifyContent: "end" }}
                    >
                      <small>
                        <Skeleton borderRadius={5} height={20} width={80} />
                      </small>
                    </Col>
                    <Col
                      lg={1}
                      id="dropdown_action"
                      className="text-end"
                      style={{ position: "absolute", right: "20px" }}
                    >
                      <Skeleton circle={true} height={30} width={30} />
                    </Col>
                  </>
                ))}
              </Row>
            </Col>
          </>
        </React.Fragment>
      ))}
    </Row>
  );
};

export default TeamworkSkeleton;
