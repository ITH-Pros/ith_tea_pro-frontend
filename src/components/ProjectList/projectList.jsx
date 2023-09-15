import { getAllProjects } from "@services/user/api";
import React from "react";
import { useQuery } from "react-query";
import { Row, Card, Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Avatar from "react-avatar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const ProjectList = ({
  openAddtask,
  handleToRedirectTask,
  showAllProjects,
  setShowAllProjects,
}) => {
  const {
    data: projectList,
    isLoading,
    error,
  } = useQuery("projectList", () => getAllProjects(), {
    refetchOnWindowFocus: false,
    select: (data) => data?.data,
  });

  return (
    <Row className="row-bg ">
      {projectList
        ?.slice(0, showAllProjects ? projectList.length : 2)
        .map((project) => (
          <Col lg={6}>
            <Card id={`card-${project.id}`} key={project?.id} className="mb-1">
              <Row className="d-flex justify-content-start">
                <Col lg={6} className="middle">
                  <Avatar name={project.name} size={40} round="20px" />{" "}
                  {/* <h5 className="text-truncate">{project?.name}</h5> */}
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{project?.name}</Tooltip>}
                  >
                    <h5
                      className="text-truncate"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleToRedirectTask(project?._id);
                      }}
                    >
                      {project?.name}
                    </h5>
                  </OverlayTrigger>
                </Col>
                <Col lg={4} className="middle">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{project?.description || "--"}</Tooltip>}
                  >
                    <p className="text-truncate">
                      {project?.description || "--"}
                    </p>
                  </OverlayTrigger>
                </Col>
                <Col
                  lg={2}
                  className="text-end middle"
                  style={{ justifyContent: "end" }}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    style={{
                      float: "right",
                      padding: "4px 7px",
                      fontSize: "10px",
                    }}
                    onClick={() => {
                      openAddtask(project);
                    }}
                  >
                    Add Task
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}

      {projectList && projectList.length > 2 && (
        <button className="expend" onClick={() => setShowAllProjects()}>
          {showAllProjects ? (
            <i className="fas fa-expand"></i>
          ) : (
            <i className="fas fa-expand-alt"></i>
          )}
        </button>
      )}
    </Row>
  );
};

export default ProjectList;
