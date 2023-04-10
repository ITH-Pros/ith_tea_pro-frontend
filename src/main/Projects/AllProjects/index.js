/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  archiveProjectById,
  deleteProjectById,
  getAllProjects,
  getTaskStatusAnalytics,
} from "../../../services/user/api";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../auth/AuthProvider";
import Toaster from "../../../components/Toaster";
import ProjectCard from "../ProjectCard/projectCard";
import { Modal, Button } from "react-bootstrap";

export default function AllProject() {
  const { userDetails } = useAuth();
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectListValue] = useState([]);
  const [projectTaskAnalytics, setProjectTaskAnalytics] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    name: null,
    _id: null,
  });

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [isArchive, setIsArchive] = useState(false);

  const [categoriesModalShow, setCategoriesModalShow] = useState(false);

  const handleIsArchive = () => {
    setProjectListValue([])
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
    navigate(
      `/task/${JSON.stringify({
        projectId: project._id,
        isArchive: isArchive,
      })}/}`
    );
  };

  const navigate = useNavigate();

  useEffect(() => {
    getAndsetTaskStatusAnalytics();
    getAndSetAllProjects();
  }, []);

  useEffect(() => {
    getAndSetAllProjects();
  }, [isArchive]);

  const getAndSetAllProjects = async function () {
    let dataToSend = {};
    if (isArchive) {
      dataToSend.isArchived = true;
    }
    try {
    setLoading(true);
      const projects = await getAllProjects(dataToSend);
      if (projects.error) {
        setLoading(false)
        setToasterMessage(projects?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setProjectListValue(projects?.data);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const getAndsetTaskStatusAnalytics = async () => {
    try {
      const projects = await getTaskStatusAnalytics();
      if (projects.error) {
        setToasterMessage(projects?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setProjectTaskAnalytics(projects?.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const confirmation = (project) => {
    setSelectedProject(project);
    setConfirmModalShow(true);
  };

  const deleteProject = async () => {
    setLoading(true);
    try {
      let dataToSend = {
        projectId: selectedProject._id,
      };
      const removeRes = await deleteProjectById(dataToSend);
      setLoading(false);

      if (removeRes.error) {
        setToasterMessage(removeRes?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage(removeRes?.message || "Something Went Wrong");
        setShowToaster(true);
        getAndSetAllProjects();
        setConfirmModalShow(false);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  const [isArchiveModalShow, setIsArchiveModalShow] = useState(false);

  const handleArchiveModalShow = (project) => {
    // console.log("project", project);
    setSelectedProject(project);
    setConfirmModalShow(true);
    setIsArchiveModalShow(true);
  };

  const archiveProject = async () => {
    setLoading(true);
    try {
      let dataToSend = {
        projectId: selectedProject._id,
      };
      if (selectedProject.isArchived) {
        dataToSend.isArchived = false;
      } else {
        dataToSend.isArchived = true;
      }

      const removeRes = await archiveProjectById(dataToSend);
      setLoading(false);

      if (removeRes.error) {
        setToasterMessage(removeRes?.message || "Something Went Wrong");
        setShowToaster(true);
        setConfirmModalShow(false);
        setIsArchiveModalShow(false);
        return;
      } else {
        setToasterMessage(removeRes?.message || "Something Went Wrong");
        setShowToaster(true);
        getAndSetAllProjects();
        setConfirmModalShow(false);
        setIsArchiveModalShow(false);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setConfirmModalShow(false);
      setIsArchiveModalShow(false);
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  return (
    <>
      <div className="rightDashboard" style={{ marginTop: "7%" }}>
        <h1 className="h1-text">
          <i className="fa fa-database" aria-hidden="true"></i> Projects
          <div className="projects-button">
          {(userDetails.role === "SUPER_ADMIN" || userDetails.role === "ADMIN") && !isArchive && (
          
          <Link style={{float:'left'}}
            to={{
              pathname: "/project/add",
            }}
          >
            <i
              className="fa fa-plus-circle fa-3x addBtn"
             
              aria-hidden="true"
            > &nbsp; Add Project </i> 
          </Link>
      
    )}
     {
    (userDetails.role ==="ADMIN" || userDetails.role === "SUPER_ADMIN") && 
  <button className="btn btn-primary" onClick={handleIsArchive}> {isArchive ? 'Active Projects':'Archive List'}</button>
  }

          </div>
        </h1>

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
                    getAndSetAllProjects={() => getAndSetAllProjects()}
                    handleArchiveModalShow={() =>
                      handleArchiveModalShow(element)
                    }
                    isArchive={isArchive}
                  />
                </div>
              );
            })}
          {!projectList?.length && userDetails.role === "CONTRIBUTOR" && (
            <h6>No Project Found</h6>
          )}
        </div>
      </div>
      {loading ? <Loader /> : null}
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}

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
        <Modal.Body className="delete-popup">
          <h6>
            Are you sure you want to{" "}
            {isArchiveModalShow
              ? !isArchive
                ? "archive"
                : "unarchive"
              : "delete"}{" "}
            this project?
          </h6>

          <div className="button-center-corformain">
            {!isArchiveModalShow && (
              <Button
                style={{ marginLeft: "16px" }}
                className="btn btn-danger mb-3 mr-3"
                onClick={() => deleteProject()}
              >
                Delete
              </Button>
            )}
            {isArchiveModalShow && (
              <Button
                style={{ marginLeft: "16px" }}
                className="btn btn-danger mb-3 mr-3"
                onClick={() => archiveProject()}
              >
                {!isArchive ? "Archive" : "Unarchive"}
              </Button>
            )}
            <Button
              style={{ marginLeft: "16px" }}
              className="btn mb-3 mr-3"
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
