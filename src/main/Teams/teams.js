import React from 'react';
import { useEffect, useState } from 'react';
import { getAllUsers, getAllProjects, getUserAssignedProjects, assignUserToProject } from '../../services/user/api';
import './teams.css'
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import Modals from '../../components/modal';
import { useAuth } from '../../auth/AuthProvider';
import Toaster from '../../components/Toaster'

export default function Teams(props) {

    const { userDetails } = useAuth()

    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [usersList, setUsersListValue] = useState([]);
    const [projectList, setProjectListValue] = useState([]);
    const [userAssignedProjects, setUserAssignedProjects] = useState([]);
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");

    useEffect(() => {
        onInit();
    }, []);

    function onInit() {
        getAndSetAllUsers();
    }
    const getAndSetAllUsers = async function () {
        setLoading(true);
        try {
            const projects = await getAllUsers();
            setLoading(false);
            if (projects.error) {
                setToasterMessage(projects?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {
                setUsersListValue(projects.data);
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    };


    const handleSelectProject = (projectId) => {
        setSelectedProjectId(projectId)
    }

    const handleAddUserToProject = async function (userId) {
        setLoading(true);
        try {
            const projects = await getAllProjects();
            setLoading(false);
            if (projects.error) {
                setToasterMessage(projects?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setProjectListValue(projects.data);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
        try {
            let dataToSend = {
                params: { userId }
            }
            const userAssignedProjects = await getUserAssignedProjects(dataToSend);
            setLoading(false);
            if (userAssignedProjects.error) {
                setToasterMessage(userAssignedProjects?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setUserAssignedProjects(userAssignedProjects.data);
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
        setSelectedUserId(userId)
        setModalShow(true);
    };

    const GetModalBody = () => {
        return (
            <>
                {
                    projectList && projectList.map((proejct, index) => {
                        let checkAlreadyAssigned = userAssignedProjects.find((ele) => ele._id === proejct._id)
                        return (
                            <div key={proejct._id} >
                                <input
                                    disabled={checkAlreadyAssigned}
                                    checked={checkAlreadyAssigned || selectedProjectId === proejct._id}
                                    onChange={() => handleSelectProject(proejct._id)}
                                    type="checkbox" ></input>
                                <span> {proejct.name}</span>
                            </div>
                        )

                    })
                }
            </>
        )
    }
    const handleAssignUserProjectSubmit = async () => {
        setLoading(true);
        try {
            let dataToSend = {
                projectId: selectedProjectId,
                userIds: [selectedUserId]
            }
            const assignRes = await assignUserToProject(dataToSend);
            setLoading(false);
            if (assignRes.error) {
                setToasterMessage(assignRes?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                setModalShow(false);

                return
            } else {
                setProjectListValue(assignRes.data);
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setModalShow(false);
            return error.message;
        }
        setModalShow(false);
    }

    return (
        <>
            <h1 className="h1-text">
                <i className="fa fa-users" aria-hidden="true"></i>Team Members
            </h1>
            <div className="container-team">
                {
                    usersList && usersList.map((user) => {
                        return (
                            <div key={user._id} className="box">
                                <div className="top-bar"></div>
                                <div className="top">
                                    <Link to={{
                                        pathname: "/user/view/" + user._id,
                                    }}>
                                        <i className="fa fa-check-circle" id="heart-btn-1" style={{ cursor: "grab" }} aria-hidden="true"></i>
                                        {/* <i className="fa fa-plus-circle fa-3x addBtn" aria-hidden="true" ></i> */}
                                    </Link>
                                    <label className="heart" ></label>
                                </div>
                                <div className="content">
                                    <img src="https://images.pexels.com/photos/2570145/pexels-photo-2570145.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" />
                                    <strong>{user.name}</strong>
                                    <p>{user.email}</p>
                                </div>
                                {

                                    userDetails.role !== "USER" &&
                                    <div className="btn">

                                        <button className='btn-glow' onClick={() => { handleAddUserToProject(user._id) }}> <i className="fa fa-check" aria-hidden="true"></i>Assign</button>

                                        <Link to={{
                                            pathname: "/rating",
                                        }} state={{ userId: user._id }}>
                                            Add Rating
                                        </Link>

                                    </div>
                                }
                            </div>
                        )
                    })
                }
                {

                    userDetails.role !== "USER" &&
                    <div key='AddNewUser' className="box " style={{padding:'90px'}}>

                        <div className="content">
                            <Link to={{
                                pathname: "/user/add",

                            }}>
                                <i className="fa fa-user-plus fa-3x addBtn " title='Add User' aria-hidden="true" ></i>
                            </Link>
                        </div>

                    </div>
                }



            </div>
            {loading ? <Loader /> : null}
            {toaster && <Toaster
                message={toasterMessage}
                show={toaster}
                close={() => showToaster(false)} />}

            <Modals
                modalShow={modalShow}
                modalBody={<GetModalBody />}
                heading='Assign Project'
                onHide={() => setModalShow(false)}
                submitBtnDisabled={!selectedProjectId}
                onClick={handleAssignUserProjectSubmit} />

        </>
    )
};

