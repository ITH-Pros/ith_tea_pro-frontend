/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { assignUserToProject, deleteProjectById, getAllProjects, getAllUsers, getTaskStatusAnalytics, getUsersOfProject, unAssignUserToProject } from '../../../services/user/api';
import { toast } from "react-toastify";
import './index.css';
import Loader from '../../../components/Loader';
import Modals from '../../../components/modal';
import SureModals from '../../../components/sureModal';
import { MDBTooltip } from 'mdb-react-ui-kit';
import AddTaskModal from '../../Tasks/AddTaskModal';
import { useAuth } from '../../../auth/AuthProvider';
import { Link } from 'react-router-dom';
import Toaster from '../../../components/Toaster';
import ProjectCard from "../ProjectCard/projectCard";

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
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [projectTaskAnalytics, setProjectTaskAnalytics] = useState('');
    const [selectedProject, setSelectedProject] = useState({ name: null, _id: null });
    const [selectedUser, setSelectedUser] = useState({ name: null, _id: null });
    const [showMoreUserDropDownId, setShowMoreUserDropDownId] = useState('');
    const [projectAssignedUsers, setProjectAssignedUsers] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [sureModalShow, setSureModalShow] = useState(false);
    const userListToAddInProject = new Set();


    useEffect(() => {
        getAndSetAllProjects()
        getAndsetTaskStatusAnalytics()
    }, []);


    const getAndSetAllProjects = async function () {
        //setloading(true);
        try {
            const projects = await getAllProjects();
            //setloading(false);
            if (projects.error) {
                setToasterMessage(projects?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {
                setProjectListValue(projects.data)
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
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
                setToasterMessage(projects?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {
                setProjectTaskAnalytics(projects.data)
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            //setloading(false);
            return error.message;
        }
    }

    const addAndRemveUserFromList = (userId) => {
        userListToAddInProject.has(userId) ? userListToAddInProject.delete(userId) : userListToAddInProject.add(userId)
    }

    const checkAndGetProjectUsers = (element) => {
        if (element._id === showMoreUserDropDownId) {
            setShowMoreUserDropDownId('')
            return
        }
        getProjectAssignedUsers(element)
    }
    const getProjectAssignedUsers = async (element) => {
        //setloading(true);
        try {
            let dataToSend = {
                params: { projectId: element._id }
            }
            const projectAssignedUsers = await getUsersOfProject(dataToSend);
            //setloading(false);
            if (projectAssignedUsers.error) {
                setToasterMessage(projectAssignedUsers?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setProjectAssignedUsers(projectAssignedUsers.data);
                setShowMoreUserDropDownId(element._id);
                setSelectedProject(element);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            //setloading(false);
            return error.message;
        }
    }

    const handleAddUserToProjectButton = async function (element) {
        //setloading(true);
        try {

            const projectUsers = await getAllUsers();
            //setloading(false);
            if (projectUsers.error) {
                setToasterMessage(projectUsers?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setAllUserListValue(projectUsers.data);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            //setloading(false);
            return error.message;
        }
        try {
            let dataToSend = {
                params: { projectId: element._id }
            }
            const projectAssignedUsers = await getUsersOfProject(dataToSend);
            //setloading(false);
            if (projectAssignedUsers.error) {
                toast.error(projectAssignedUsers.error.message, {
                    position: toast.POSITION.TOP_CENTER,
                    className: "toast-message",
                });
                return
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
                {
                    allUserList && allUserList.map((proejctUser, index) => {
                        let checkAlreadyAssigned = projectAssignedUsers.find((ele) => ele._id === proejctUser._id)
                        return (
                            <div key={proejctUser._id} >
                                <input
                                    disabled={checkAlreadyAssigned}
                                    checked={checkAlreadyAssigned}
                                    onClick={() => addAndRemveUserFromList(proejctUser._id)}
                                    type="checkbox" ></input>
                                <span> {proejctUser.name}</span>
                            </div>
                        )

                    })
                }
            </>
        )
    }
    const GetSureModalBody = () => {
        return (
            <>
                User <strong>{selectedUser.name}</strong> will be removed from Project <strong>{selectedProject.name}</strong>
                <hr></hr>
                <small>Note : <strong>{selectedUser.name}</strong> will not be able add or see tasks  </small>
            </>
        )
    }
    const removeUserFromProject = (user, project) => {
        setSelectedProject(project)
        setSelectedUser(user)
        setSureModalShow(true)
    }
    const getProjectUserIcons = (project) => {
        let rows = [];
        let projectUsers = project?.accessibleBy
        for (let i = 0; i < projectUsers?.length; i++) {
            let user = projectUsers[i]
            if (i === 5) {
                rows.push(
                    <MDBTooltip
                        key={user._id + i}
                        tag="a"
                        wrapperProps={{ href: "#" }}
                        title={"View More..."}
                    >
                        <div >
                            <i className="fa fa-chevron-circle-down" style={{ cursor: 'grab' }} aria-hidden="true" onClick={() => { checkAndGetProjectUsers(project) }}></i>
                        </div>
                    </MDBTooltip>
                );
                break
            }
            if (showMoreUserDropDownId && showMoreUserDropDownId === project._id) {
                continue
            }
            if (userDetails.role === 'SUPER_ADMIN') {
                rows.push(
                    <MDBTooltip
                        tag="a"
                        wrapperProps={{ href: "#" }}
                        title={`click to Remove ${user.name}`}
                        key={user._id + i}
                    >
                        <img
                            onClick={() => { removeUserFromProject({ name: user.name, _id: user._id }, { name: project.name, _id: project._id }) }}
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                            alt="participant" />
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
                            alt="participant" />
                    </MDBTooltip>
                );

            }
        }
        return rows;

    }
    const GetShowMoreUsersModalBody = () => {
        return (
            <div className='moreParticipants'>
                {
                    projectAssignedUsers && projectAssignedUsers.map((proejctUser, index) => {
                        return (
                            <div key={proejctUser._id + index}>
                                {
                                    userDetails.role === 'SUPER_ADMIN' ?
                                        <MDBTooltip
                                            tag="p"
                                            wrapperProps={{ href: "#" }}
                                            title={`click to Remove ${proejctUser.name}`}
                                        >
                                            <img
                                                className='moreUserDropdownImg'
                                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                                                alt={proejctUser.name}
                                                onClick={() => { removeUserFromProject({ name: proejctUser.name, _id: proejctUser._id }, { name: selectedProject.name, _id: selectedProject._id }) }}
                                            />
                                            <span> {proejctUser.name}</span>
                                        </MDBTooltip>
                                        :
                                        <MDBTooltip
                                            tag="p"
                                            wrapperProps={{ href: "#" }}
                                            title={`${proejctUser.name}`}
                                        >
                                            <img
                                                className='moreUserDropdownImg'
                                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                                                alt={proejctUser.name}
                                            />
                                            <span> {proejctUser.name}</span>
                                        </MDBTooltip>
                                }
                            </div>
                        )

                    })
                }
            </div>

        )
    }
    const AddSelectedUsersToProject = async () => {
        //setloading(true);
        try {
            let dataToSend = {
                projectId: selectedProjectId,
                userIds: [...userListToAddInProject]
            }
            const addRes = await assignUserToProject(dataToSend);
            //setloading(false);
            if (addRes.error) {
                setToasterMessage(addRes?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setToasterMessage(addRes?.message || 'Something Went Wrong');
                setShowToaster(true);
                getAndSetAllProjects();
                setModalShow(false)
                userListToAddInProject.clear()
            }
        } catch (error) {
            //setloading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    }
    const closeSureModals = () => {
        setSureModalShow(false);
        // setSelectedProject({});
        // setSelectedUser({});
    }
    const removeSelectedUsersFromProject = async () => {
        //setloading(true);
        try {
            let dataToSend = {
                projectId: selectedProject._id,
                userId: selectedUser._id
            }
            const removeRes = await unAssignUserToProject(dataToSend);
            //setloading(false);
            if (removeRes.error) {
                setToasterMessage(removeRes?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setToasterMessage(removeRes?.message || 'Something Went Wrong');
                setShowToaster(true);
                getAndSetAllProjects();
                setShowMoreUserDropDownId('')
                // getProjectAssignedUsers(selectedProject);
                setSureModalShow(false)
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            //setloading(false);
            return error.message;
        }
    }

 

        const deleteProject = async (project) => {
console.log(project,'------------------------props')
            setLoading(true);
            try {
                let dataToSend = {
                    projectId: project._id,
                }
                const removeRes = await deleteProjectById(dataToSend);
                setLoading(false);

                if (removeRes.error) {
                    setToasterMessage(removeRes?.error?.message || 'Something Went Wrong');
                    setShowToaster(true);
                    return
                } else {
                    setToasterMessage(removeRes?.message || 'Something Went Wrong');
                    setShowToaster(true);
                    getAndSetAllProjects();
                }
            } catch (error) {
                setToasterMessage(error?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                setLoading(false);
                return error.message;
            }
        }



     

    const ProgressBarComp = (props) => {

        const { project } = props;
        return (

            <div className="box-progress-wrapper">
                <p className="box-progress-header">Progress</p>
                <div className="progress">
                    <div className="progress-bar bg-success" data-container="body" data-toggle="tooltip" title={`Completed ${projectTaskAnalytics?.[project._id]?.['COMPLETED']?.toFixed(2)}%`} style={{ width: `${projectTaskAnalytics?.[project._id]?.["COMPLETED"]?.toFixed(2)}%` }} >
                    </div>
                    <div className="progress-bar bg-warning" data-container="body" data-toggle="tooltip" title={`In Progress ${projectTaskAnalytics?.[project._id]?.["ONGOING"]?.toFixed(2)}%`} style={{ width: `${projectTaskAnalytics?.[project._id]?.["ONGOING"]?.toFixed(2)}%` }}>
                    </div>
                    <div className="progress-bar bg-danger" data-container="body" data-toggle="tooltip" title={`On Hold ${projectTaskAnalytics?.[project._id]?.["ONHOLD"]?.toFixed(2)}%`} style={{ width: `${projectTaskAnalytics?.[project._id]?.["ONHOLD"]?.toFixed(2)}%` }}>
                    </div>
                    <div className="progress-bar bg-white" data-container="body" data-toggle="tooltip" title={`No Progress ${projectTaskAnalytics?.[project._id]?.["NO_PROGRESS"]?.toFixed(2)}%`} style={{ width: `${projectTaskAnalytics?.[project._id]?.["NO_PROGRESS"]?.toFixed(2)}%` }}>
                    </div>
                </div>
            </div>
        )


    }

    return (
        <>
           <div>
            <h1 className="h1-text">
                <i className="fa fa-database" aria-hidden="true"></i>  Projects
            </h1>
            <div className="project-boxes jsGridView">
                {
                    projectList && projectList.map((element, projectIndex) => {
                        return (
                          <div
                            key={element._id}
                            style={{ height: "300px" }}
                            className="project-box-wrapper"
                          >
                            {/* <div className="project-box" style={{ backgroundColor: projectBackColor[projectIndex % 12] }}> */}
                            {/* <div className="project-box-header">

                                        <ProjectMenuIcon project={element} />
                                    </div>
                                    <div className="project-box-content-header">
                                        <p className="box-content-header">{element.name}</p>
                                        <p className="box-content-subheader">{element.description?.slice(0, 50)+'...'}</p>
                                    </div> */}

                            {/* {projectTaskAnalytics && <ProgressBarComp project={element} />} */}

                            {/* <div className="project-box-footer">
                                        <div className="participants">
                                            {
                                                getProjectUserIcons(element)
                                            }
                                            {
                                                userDetails.role === 'SUPER_ADMIN' &&
                                                <button className="add-participant" style={{ color: '#ff942e' }} onClick={() => handleAddUserToProjectButton(element)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                                        <path d="M12 5v14M5 12h14" />
                                                    </svg>
                                                </button>
                                            }
                                        </div> */}
                            {/* </div> */}
                            {/* </div > */}
                            {/* {
                                    // showMoreUserDropDownId === element._id && <GetShowMoreUsersModalBody />
                                } */}
                            {/* <ProjectCard
                              name="Project Name"
                              description="Project description goes here."
                              handleEdit={() => console.log("Edit clicked.")}
                              handleDelete={() =>
                                console.log("Delete clicked.")
                              }
                            /> */}
                            <ProjectCard
                              name={element.name}
                              description={
                                element.description?.slice(0, 20) + "..."
                              }
                              handleEdit={() => console.log("Edit clicked")}
                              handleDelete={() => deleteProject(element)}
                              //   backgroundColor="#00ADEF"
                            />
                          </div>
                        );
                    })
                }
                {
                    userDetails.role === "SUPER_ADMIN" &&
                    <div key='AddProject' style={{    display: "flex"}} className="project-box add-project-button">
                        <div className="content">
                            <Link to={{
                                pathname: "/project/add",
                            }}>
                                <i className="fa fa-plus-circle fa-3x addBtn" title='Add Project' aria-hidden="true" ></i>
                            </Link>
                        </div>
                    </div>
                }
            </div >
            </div>
            {loading ? <Loader /> : null}
            {toaster && <Toaster
                message={toasterMessage}
                show={toaster}
                close={() => showToaster(false)} />
            }

            {
                modalShow && <Modals
                    modalShow={modalShow}
                    keyboardProp={true}
                    backdropProp='static'
                    modalBody={<GetModalBody />}
                    heading='Assign Project'
                    onClick={AddSelectedUsersToProject}
                    onHide={() => setModalShow(false)}
                />
            }
            {
                sureModalShow && <SureModals
                    modalShow={sureModalShow}
                    keyboardProp={true}
                    backdropProp='static'
                    modalBody={<GetSureModalBody />}
                    heading='Are You Sure'
                    onReject={() => { closeSureModals() }}
                    onAccept={removeSelectedUsersFromProject}
                    onHide={() => setSureModalShow(false)}
                />
            }

        </>
    );
}