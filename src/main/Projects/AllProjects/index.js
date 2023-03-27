/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
	archiveProjectById,
  assignUserToProject,
  deleteProjectById,
  getAllProjects,
  getAllUsers,
  getProjectDetailsById,
  getTaskStatusAnalytics,
  getUsersOfProject,
  unAssignUserToProject,
} from "../../../services/user/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.css";
import Loader from "../../../components/Loader";
import Modals from "../../../components/modal";
import SureModals from "../../../components/sureModal";
import { MDBTooltip } from "mdb-react-ui-kit";
import AddTaskModal from "../../Tasks/AddTaskModal";
import { useAuth } from "../../../auth/AuthProvider";
import { Link } from "react-router-dom";
import Toaster from "../../../components/Toaster";
import ProjectCard from "../ProjectCard/projectCard";
// import { Button } from "bootstrap";
import { Modal ,  Button } from "react-bootstrap";
// import { useNavigate } from 'react-router-dom';

export default function AllProject() {
  let projectBackColor = [
    "#e9e7fd",
    "#dbf6fd",
    "#fee4cb",
    "#ff942e",
    "#8490a3",
    "#b477e0",
    "#f0da37",
    "#e3595f",
    "#e3e3e3",
    "#5fc9de",
    "#7ae03f",
    "#9399bf",
  ];
  const { userDetails } = useAuth();
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectListValue] = useState([]);
  const [allUserList, setAllUserListValue] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectTaskAnalytics, setProjectTaskAnalytics] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    name: null,
    _id: null,
  });
  const [selectedUser, setSelectedUser] = useState({ name: null, _id: null });
  const [showMoreUserDropDownId, setShowMoreUserDropDownId] = useState("");
  const [projectAssignedUsers, setProjectAssignedUsers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [sureModalShow, setSureModalShow] = useState(false);
  const [confirmModalShow , setConfirmModalShow] = useState(false);
  const [isArchive , setIsArchive] = useState(false)

  const [categoriesModalShow, setCategoriesModalShow] = useState(false);

  const handleIsArchive = () =>{
    setIsArchive(!isArchive)
    // getAndSetAllProjects()
  }


  const handleCategorie = (project) => {
	setCategories(project.categories)
	setCategoriesModalShow(true);
	  };

	  const editProject = async (project) => {
  
		navigate(`/project/add/${project._id}`);
	
	  };

	  const handleToRedirectTask =(project) => {
		navigate(`/task/${project._id}`);
	}



  const userListToAddInProject = new Set();
  const navigate = useNavigate();
  // const navigate = useNavigate();

  useEffect(() => {
	  getAndsetTaskStatusAnalytics();
    getAndSetAllProjects();
  }, []);

  useEffect(() => {
    getAndSetAllProjects()
  }, [isArchive]);

  const getAndSetAllProjects = async function () {
    let dataToSend = {}
    if(isArchive){
      dataToSend.isArchived = true
    }
    //setloading(true);
    try {
      const projects = await getAllProjects(dataToSend);
      //setloading(false);
      if (projects.error) {
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setProjectListValue(projects?.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      //setloading(false);
      return error.message;
    }
  };
  const getAndsetTaskStatusAnalytics = async () => {
    //setloading(true);
    try {
      const projects = await getTaskStatusAnalytics();
      //setloading(false);
      if (projects.error) {
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setProjectTaskAnalytics(projects.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      //setloading(false);
      return error.message;
    }
  };

  const addAndRemveUserFromList = (userId) => {
    userListToAddInProject.has(userId)
      ? userListToAddInProject.delete(userId)
      : userListToAddInProject.add(userId);
  };

  const checkAndGetProjectUsers = (element) => {
    if (element._id === showMoreUserDropDownId) {
      setShowMoreUserDropDownId("");
      return;
    }
    getProjectAssignedUsers(element);
  };
  const getProjectAssignedUsers = async (element) => {
    //setloading(true);
    try {
      let dataToSend = {
        params: { projectId: element._id },
      };
      const projectAssignedUsers = await getUsersOfProject(dataToSend);
      //setloading(false);
      if (projectAssignedUsers.error) {
        setToasterMessage(
          projectAssignedUsers?.error?.message || "Something Went Wrong"
        );
        setShowToaster(true);
        return;
      } else {
        setProjectAssignedUsers(projectAssignedUsers.data);
        setShowMoreUserDropDownId(element._id);
        setSelectedProject(element);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      //setloading(false);
      return error.message;
    }
  };

  const handleAddUserToProjectButton = async function (element) {
    //setloading(true);
    try {
      const projectUsers = await getAllUsers();
      //setloading(false);
      if (projectUsers.error) {
        setToasterMessage(
          projectUsers?.error?.message || "Something Went Wrong"
        );
        setShowToaster(true);
        return;
      } else {
        setAllUserListValue(projectUsers.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      //setloading(false);
      return error.message;
    }
    try {
      let dataToSend = {
        params: { projectId: element._id },
      };
      const projectAssignedUsers = await getUsersOfProject(dataToSend);
      //setloading(false);
      if (projectAssignedUsers.error) {
        toast.error(projectAssignedUsers.error.message, {
          position: toast.POSITION.TOP_CENTER,
          className: "toast-message",
        });
        return;
      } else {
        setProjectAssignedUsers(projectAssignedUsers.data);
        setSelectedProjectId(element._id);

        setModalShow(true);
      }
    } catch (error) {
      //setloading(false);
      return error.message;
    }
    // setSelectedUserId(userId)
  };
  const GetModalBody = () => {
    return (
      <>
        {allUserList &&
          allUserList.map((proejctUser, index) => {
            let checkAlreadyAssigned = projectAssignedUsers.find(
              (ele) => ele._id === proejctUser._id
            );
            return (
              <div key={proejctUser._id}>
                <input
                  disabled={checkAlreadyAssigned}
                  checked={checkAlreadyAssigned}
                  onClick={() => addAndRemveUserFromList(proejctUser._id)}
                  type="checkbox"
                ></input>
                <span> {proejctUser.name}</span>
              </div>
            );
          })}
      </>
    );
  };
  const GetSureModalBody = () => {
    return (
      <>
        User <strong>{selectedUser.name}</strong> will be removed from Project{" "}
        <strong>{selectedProject.name}</strong>
        <hr></hr>
        <small>
          Note : <strong>{selectedUser.name}</strong> will not be able add or
          see tasks{" "}
        </small>
      </>
    );
  };
  const removeUserFromProject = (user, project) => {
    setSelectedProject(project);
    setSelectedUser(user);
    setSureModalShow(true);
  };
  const getProjectUserIcons = (project) => {
    let rows = [];
    let projectUsers = project?.accessibleBy;
    for (let i = 0; i < projectUsers?.length; i++) {
      let user = projectUsers[i];
      if (i === 5) {
        rows.push(
          <MDBTooltip
            key={user._id + i}
            tag="a"
            wrapperProps={{ href: "#" }}
            title={"View More..."}
          >
            <div>
              <i
                className="fa fa-chevron-circle-down"
                style={{ cursor: "grab" }}
                aria-hidden="true"
                onClick={() => {
                  checkAndGetProjectUsers(project);
                }}
              ></i>
            </div>
          </MDBTooltip>
        );
        break;
      }
      if (showMoreUserDropDownId && showMoreUserDropDownId === project._id) {
        continue;
      }
      if (userDetails.role === "SUPER_ADMIN") {
        rows.push(
          <MDBTooltip
            tag="a"
            wrapperProps={{ href: "#" }}
            title={`click to Remove ${user.name}`}
            key={user._id + i}
          >
            <img
              onClick={() => {
                removeUserFromProject(
                  { name: user.name, _id: user._id },
                  { name: project.name, _id: project._id }
                );
              }}
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
              alt="participant"
            />
          </MDBTooltip>
        );
      } else {
        rows.push(
          <MDBTooltip
            tag="a"
            wrapperProps={{ href: "#" }}
            title={`${user.name}`}
            key={user._id + i}
          >
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
              alt="participant"
            />
          </MDBTooltip>
        );
      }
    }
    return rows;
  };
  const GetShowMoreUsersModalBody = () => {
    return (
      <div className="moreParticipants">
        {projectAssignedUsers &&
          projectAssignedUsers.map((proejctUser, index) => {
            return (
              <div key={proejctUser._id + index}>
                {userDetails.role === "SUPER_ADMIN" ? (
                  <MDBTooltip
                    tag="p"
                    wrapperProps={{ href: "#" }}
                    title={`click to Remove ${proejctUser.name}`}
                  >
                    <img
                      className="moreUserDropdownImg"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                      alt={proejctUser.name}
                      onClick={() => {
                        removeUserFromProject(
                          { name: proejctUser.name, _id: proejctUser._id },
                          {
                            name: selectedProject.name,
                            _id: selectedProject._id,
                          }
                        );
                      }}
                    />
                    <span> {proejctUser.name}</span>
                  </MDBTooltip>
                ) : (
                  <MDBTooltip
                    tag="p"
                    wrapperProps={{ href: "#" }}
                    title={`${proejctUser.name}`}
                  >
                    <img
                      className="moreUserDropdownImg"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                      alt={proejctUser.name}
                    />
                    <span> {proejctUser.name}</span>
                  </MDBTooltip>
                )}
              </div>
            );
          })}
      </div>
    );
  };
  const AddSelectedUsersToProject = async () => {
    //setloading(true);
    try {
      let dataToSend = {
        projectId: selectedProjectId,
        userIds: [...userListToAddInProject],
      };
      const addRes = await assignUserToProject(dataToSend);
      //setloading(false);
      if (addRes.error) {
        setToasterMessage(addRes?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage(addRes?.message || "Something Went Wrong");
        setShowToaster(true);
        getAndSetAllProjects();
        setModalShow(false);
        userListToAddInProject.clear();
      }
    } catch (error) {
      //setloading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };
  const closeSureModals = () => {
    setSureModalShow(false);
    // setSelectedProject({});
    // setSelectedUser({});
  };
  const removeSelectedUsersFromProject = async () => {
    //setloading(true);
    try {
      let dataToSend = {
        projectId: selectedProject._id,
        userId: selectedUser._id,
      };
      const removeRes = await unAssignUserToProject(dataToSend);
      //setloading(false);
      if (removeRes.error) {
        setToasterMessage(removeRes?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage(removeRes?.message || "Something Went Wrong");
        setShowToaster(true);
        getAndSetAllProjects();
        setShowMoreUserDropDownId("");
        // getProjectAssignedUsers(selectedProject);
        setSureModalShow(false);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      //setloading(false);
      return error.message;
    }
  };

  const confirmation = (project) => {
	setSelectedProject(project);
	setConfirmModalShow(true);
	};




  const deleteProject = async () => {

	// setSelectedProject(project);

	// setConfirmModalShow(true);


    // console.log(project, "------deleteProject");
    setLoading(true);
    try {
      let dataToSend = {
        projectId: selectedProject._id,
      };
      const removeRes = await deleteProjectById(dataToSend);
      setLoading(false);

      if (removeRes.error) {
        setToasterMessage(removeRes?.error?.message || "Something Went Wrong");
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


//   ////////////////////////  Archive project modal  ////////////////////////

const [isArchiveModalShow, setIsArchiveModalShow] = useState(false);

const handleArchiveModalShow = (project) => {
	setSelectedProject(project);
	console.log(project, "------deleteProject");
	setConfirmModalShow(true);
	setIsArchiveModalShow(true);
};

const archiveProject = async () => {
	setLoading(true);
	try {
		let dataToSend = {
			projectId: selectedProject._id,
			isArchived: true,
		};
		const removeRes = await archiveProjectById(dataToSend);
		setLoading(false);

		if (removeRes.error) {
			setToasterMessage(removeRes?.error?.message || "Something Went Wrong");
			setShowToaster(true);
			return;
		} else {
			setToasterMessage(removeRes?.message || "Something Went Wrong");
			setShowToaster(true);
			getAndSetAllProjects();
			setConfirmModalShow(false);
			setIsArchiveModalShow(false);
		}
	}
	catch (error) {
		setToasterMessage(error?.error?.message || "Something Went Wrong");
		setShowToaster(true);
		setLoading(false);
		return error.message;
	}
};

 

  const ProgressBarComp = (props) => {
    const { project } = props;
    return (
      <div className="box-progress-wrapper">
        <p className="box-progress-header">Progress</p>
        <div className="progress">
          <div
            className="progress-bar bg-success"
            data-container="body"
            data-toggle="tooltip"
            title={`Completed ${projectTaskAnalytics?.[project._id]?.[
              "COMPLETED"
            ]?.toFixed(2)}%`}
            style={{
              width: `${projectTaskAnalytics?.[project._id]?.[
                "COMPLETED"
              ]?.toFixed(2)}%`,
            }}
          ></div>
          <div
            className="progress-bar bg-warning"
            data-container="body"
            data-toggle="tooltip"
            title={`In Progress ${projectTaskAnalytics?.[project._id]?.[
              "ONGOING"
            ]?.toFixed(2)}%`}
            style={{
              width: `${projectTaskAnalytics?.[project._id]?.[
                "ONGOING"
              ]?.toFixed(2)}%`,
            }}
          ></div>
          <div
            className="progress-bar bg-danger"
            data-container="body"
            data-toggle="tooltip"
            title={`On Hold ${projectTaskAnalytics?.[project._id]?.[
              "ONHOLD"
            ]?.toFixed(2)}%`}
            style={{
              width: `${projectTaskAnalytics?.[project._id]?.[
                "ONHOLD"
              ]?.toFixed(2)}%`,
            }}
          ></div>
          <div
            className="progress-bar bg-white"
            data-container="body"
            data-toggle="tooltip"
            title={`No Progress ${projectTaskAnalytics?.[project._id]?.[
              "NOT_STARTED"
            ]?.toFixed(2)}%`}
            style={{
              width: `${projectTaskAnalytics?.[project._id]?.[
                "NOT_STARTED"
              ]?.toFixed(2)}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="rightDashboard">
        <h1 className="h1-text">
          <i className="fa fa-database" aria-hidden="true"></i> Projects
        </h1>
        <button className="btn btn-primary pull-right" onClick={handleIsArchive} style={{cursor:"pointer"}}  > {isArchive ? 'Back':'Archive List'}</button>
        <div className="project-boxes jsGridView">
          {userDetails.role === "SUPER_ADMIN" && !isArchive && (
            <div
              key="AddProject"
              style={{ display: "flex" }}
              className="project-box add-project-button"
            >
              <div className="content">
                <Link
                  to={{
                    pathname: "/project/add",
                  }}
                >
                  <i
                    className="fa fa-plus-circle fa-3x addBtn"
                    title="Add Project"
                    aria-hidden="true"
                  ></i>
                </Link>
              </div>
            </div>
          )}
          {projectList &&
            projectList.map((element, projectIndex) => {
              return (
                <div
                  key={element._id}
                  className="project-box-wrapper"
                >
                  <ProjectCard
				   
                    name={element.name}
                    description={element?.description||'--'}
                    managedBy={element.managedBy || []}
                    accessibleBy={element.accessibleBy || []}
					categroies={element.categories?.length}
                    element={element}
                    handleEdit={() => editProject(element)}
                    handleDelete={() => confirmation(element)}
                    taskData={projectTaskAnalytics?.[element._id]}
					handleCategories = {() => handleCategorie(element)}
					handleToRedirectTask = {() => handleToRedirectTask(element)}
					getAndSetAllProjects = {() => getAndSetAllProjects()}
					handleArchiveModalShow = {() => handleArchiveModalShow(element)}
          isArchive = {isArchive}
                    //   backgroundColor="#00ADEF"
                  />
                </div>
              );
            })}
            {projectList && projectList.length === 0 && <p>No projects archived.</p>}
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

      {modalShow && (
        <Modals
          modalShow={modalShow}
          keyboardProp={true}
          backdropProp="static"
          modalBody={<GetModalBody />}
          heading="Assign Project"
          onClick={AddSelectedUsersToProject}
          onHide={() => setModalShow(false)}
        />
      )}
      {sureModalShow && (
        <SureModals
          modalShow={sureModalShow}
          keyboardProp={true}
          backdropProp="static"
          modalBody={<GetSureModalBody />}
          heading="Are You Sure"
          onReject={() => {
            closeSureModals();
          }}
          onAccept={removeSelectedUsersFromProject}
          onHide={() => setSureModalShow(false)}
        />
      )}
	  
        <Modal 
          show={confirmModalShow}
          onHide={() => {setConfirmModalShow(false);setIsArchiveModalShow(false)}}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
			  <p>Are you sure you want to {isArchiveModalShow?'archive':'delete'} this project?</p>

       
		   	</div>

			<div className="button-center-corformain">

			   {!isArchiveModalShow && (
			<Button style={{marginLeft:"16px"}} className="btn btn-danger mb-3 mr-3" onClick={() => deleteProject()}>
            Delete
          </Button>
		  )}
		  {isArchiveModalShow && (
			<Button style={{marginLeft:"16px"}} className="btn btn-danger mb-3 mr-3" onClick={() => archiveProject()}>
			Archive
		  </Button>
		  )}
          <Button style={{marginLeft:"16px"}} className="btn mb-3 mr-3"  onClick={() => {setConfirmModalShow(false) ; setIsArchiveModalShow(false)} }>
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
			  {/* Show data list with index  */}
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
          {/* <Button style={{marginLeft:"16px"}} className="btn btn-danger mb-3 mr-3" onClick={() => deleteProject()}>
            Delete
          </Button> */}

          <Button style={{marginLeft:"16px"}} className="btn mr-3"  onClick={() => setCategoriesModalShow(false)}>
            Cancel
          </Button>
        </Modal>
    
    </>
  );
  
}
