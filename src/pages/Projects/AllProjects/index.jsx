/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import {
  archiveProjectById,
  deleteProjectById,
  getAllProjects,
  getTaskStatusAnalytics,
} from "@services/user/api";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Link } from "react-router-dom";
import Loader from "@components/Shared/Loader";
// import { useAuth } from "../../../auth/AuthProvider";

import ProjectCard from "@components/ProjectCard/projectCard";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { FaGem } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../../utlis/AuthProvider";
import { useMutation, useQuery } from "react-query";

export default function AllProject() {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectListValue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    name: null,
    _id: null,
  });
  const navigate = useNavigate();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [isArchive, setIsArchive] = useState(false);
  const [isArchiveModalShow, setIsArchiveModalShow] = useState(false);
  const [categoriesModalShow, setCategoriesModalShow] = useState(false);

  const handleIsArchive = () => {
    setProjectListValue([]);
    setIsArchive(!isArchive);
  };

  const handleCategorie = (project) => {
    setCategories(project.categories);
    setCategoriesModalShow(true);
  };

  const editProject = async (project) => {
    navigate(`/project/add/${project._id}`);
  };

  const handleToRedirectTask = (project) => {
    let data = {
      projectId: project._id,
      isArchive: isArchive,
    };
    if (userDetails?.role !== "GUEST") {
      localStorage.setItem("project_details", JSON.stringify(data));
      navigate(`/task/${project._id}`);
    }
  };

  const handleArchiveModalShow = (project) => {
    setSelectedProject(project);
    setConfirmModalShow(true);
    setIsArchiveModalShow(true);
  };

  useEffect(() => {
    fetchAllProjects();
  }, [isArchive]);

  /*
   * @desc: This function is used to get all projects
   * @param: isArchive
   * @return: all projects
   * */

  const fetchAllProjects = async () => {
    let dataToSend = {};
    if (isArchive) {
      dataToSend.isArchived = true;
    }
    projectMutation.mutate(dataToSend);
  };

  const projectMutation = useMutation(getAllProjects, {
    onSuccess: (data) => {
      if (data?.error) {
        setLoading(false);
        toast.dismiss();
        toast.info(data?.message || "Something Went Wrong");
        // set
      } else {
        setProjectListValue(data?.data);
        setLoading(false);
      }
    },
    onError: (error) => {
      setLoading(false);
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      return error.message;
    },
  });

  const {isLoading } = projectMutation;

  /*
   * @desc: This function is used to get all projects analytics
   */

  const { data: projectTaskAnalytics } = useQuery(
    "projectTaskAnalytics",
    getTaskStatusAnalytics,
    {
      select: (data) => {
        if (data?.error) {
          toast.dismiss();
          toast.info(data?.message || "Something Went Wrong");
          // set
        } else {
          return data?.data;
        }
      },
      onError: (error) => {
        toast.dismiss();
        toast.info(error?.message || "Something Went Wrong");
        return error.message;
      },
    }
  );


  const confirmation = (project) => {
    setSelectedProject(project);
    setConfirmModalShow(true);
  };

  /*
    * @desc: This function is used to delete project
    * @param: projectId
    * @return: delete project
    * */


  const deleteProject = async () => {
      let dataToSend = {
        projectId: selectedProject._id,
      };
      deleteMutation.mutate(dataToSend);
  };

  const deleteMutation = useMutation(deleteProjectById , {
    onSuccess: (data) => {
      if (data.error) {
        toast.dismiss();
        toast.info(data?.message || "Something Went Wrong");
        return;
      } else {
        toast.dismiss();
        toast.info(data?.message || "Something Went Wrong");
        fetchAllProjects();
        setConfirmModalShow(false);
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
      return error.message;
    },
  });

  /*
    * @desc: This function is used to archive project
    * @param: projectId
    * @return: archive project
    * */

  const archiveProject = async () => {
      let dataToSend = {
        projectId: selectedProject._id,
      };
      if (selectedProject.isArchived) {
        dataToSend.isArchived = false;
      } else {
        dataToSend.isArchived = true;
      }
      archiveProjectMutation.mutate(dataToSend)
  };

  const archiveProjectMutation = useMutation(archiveProjectById, {
    onSuccess: (data) => {
      if (data.error) {
        toast.dismiss();
        toast.info(data?.message || "Something Went Wrong");
        setConfirmModalShow(false);
        setIsArchiveModalShow(false);
        return;
      } else {
        toast.dismiss();
        toast.info(data?.message || "Something Went Wrong");
        fetchAllProjects();
        setConfirmModalShow(false);
        setIsArchiveModalShow(false);
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
      setConfirmModalShow(false);
      setIsArchiveModalShow(false);
      return error.message;
    },
  });


  return (
    <>
      <div className="rightDashboard" style={{ marginTop: "7%" }}>
        <Row>
          <Col lg={6}>
            <h1 className="h1-text mt-0">
              <i>
                <FaGem />
              </i>{" "}
              Projects
            </h1>
          </Col>
          <Col lg={6}>
            <div className="text-end">
              {(userDetails?.role === "SUPER_ADMIN" ||
                userDetails?.role === "ADMIN") &&
                !isArchive && (
                  <Link to="/project/add" style={{ marginRight: "10px" }}>
                    <button className="btn btn-primary">
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                      &nbsp; Add Project
                    </button>
                  </Link>
                )}
              {(userDetails?.role === "ADMIN" ||
                userDetails?.role === "SUPER_ADMIN") && (
                <button className="btn btn-primary" onClick={handleIsArchive}>
                  {" "}
                  {isArchive ? "Active Projects" : "Archive List"}
                </button>
              )}
            </div>
          </Col>
        </Row>

        <div className="project-boxes jsGridView">
          {projectList &&
            projectList.map((element, projectIndex) => {
              return (
                <div key={projectIndex}>
                  <ProjectCard
                    name={element.name}
                    background={element?.colorCode}
                    description={element?.description || "--"}
                    managedBy={element.managedBy || []}
                    accessibleBy={element.accessibleBy || []}
                    categroies={element.categories?.length}
                    element={element}
                    handleEdit={() => editProject(element)}
                    handleDelete={() => confirmation(element)}
                    taskData={projectTaskAnalytics?.[element._id]}
                    handleCategories={() => handleCategorie(element)}
                    handleToRedirectTask={() => handleToRedirectTask(element)}
                    getAndSetAllProjects={() => fetchAllProjects()}
                    handleArchiveModalShow={() =>
                      handleArchiveModalShow(element)
                    }
                    isArchive={isArchive}
                  />
                </div>
              );
            })}
          {!projectList?.length &&  !isLoading && (
            <div>
              <p className="alig-nodata">No Project Found</p>
            </div>
          )}
          {isLoading && (
            <div>
              <p className="alig-nodata">Loading...</p>
            </div>
          )
            }
        </div>
      </div>
      {loading ? <Loader /> : null}

      <Modal
        show={confirmModalShow}
        onHide={() => {
          setConfirmModalShow(false);
          setIsArchiveModalShow(false);
        }}
        animation={false}
        className="confirmation-popup"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h6>
            Are you sure you want to{" "}
            {isArchiveModalShow
              ? !isArchive
                ? "archive"
                : "unarchive"
              : "delete"}{" "}
            this project?
          </h6>

          <div className="button-center-corformain mt-3">
            {!isArchiveModalShow && (
              <Button
                style={{ marginLeft: "10px" }}
                className="btn btn-danger btn-sm"
                onClick={() => deleteProject()}
              >
                Delete
              </Button>
            )}
            {isArchiveModalShow && (
              <Button
                className="btn btn-danger btn-sm "
                onClick={() => archiveProject()}
              >
                {!isArchive ? "Archive" : "Unarchive"}
              </Button>
            )}
            <Button
              style={{ marginLeft: "10px" }}
              className="btn btn-light btn-sm"
              onClick={() => {
                setConfirmModalShow(false);
                setIsArchiveModalShow(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={categoriesModalShow}
        onHide={() => setCategoriesModalShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
              <i
                className="fa fa-plus-circle fa-3x addBtn"
                title="Add Project"
                aria-hidden="true"
              ></i>
            </ul>
          </div>
        </Modal.Body>

        <Button
          style={{ marginLeft: "16px" }}
          className="btn mr-3"
          onClick={() => setCategoriesModalShow(false)}
        >
          Cancel
        </Button>
      </Modal>
    </>
  );
}
