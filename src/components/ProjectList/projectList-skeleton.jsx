import React from "react";
import { Row, Card, OverlayTrigger } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProjectListSkeleton = () => {
  const numberOfSkeletons = 2;

  return (
    <SkeletonTheme color="#f0f0f0" highlightColor="#f5f5f5">
      <Row className="row-bg">
        {[...Array(numberOfSkeletons)].map((_, index) => (
          <Col lg={6} key={index}>
            <Card className="mb-1">
              <Row className="d-flex justify-content-start">
                <Row lg={12} className="middle">
                  <Col lg={2}>
                    <Skeleton
                      style={{ marginLeft: "5px" }}
                      circle={true}
                      width={50}
                      height={50}
                    />
                  </Col>

                  <Col lg={4} >
                    <Skeleton
                      style={{ marginLeft: "10px" }}
                      width={200}
                      height={25}
                    />
                  </Col>
                  <Col lg={4} >
                    <Skeleton width={100} />
                  </Col>
                  <Col lg={2} className="text-end ">
                    <Skeleton width={70} height={25} />
                  </Col>
                </Row>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </SkeletonTheme>
  );
};

export default ProjectListSkeleton;
