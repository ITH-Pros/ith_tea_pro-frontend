import { useEffect, useState } from 'react';
import { assignUserToProject, getAllProjects, getAllUsers, getUsersOfProject, unAssignUserToProject } from '../../services/user/api';
import { toast } from "react-toastify";

import './projects.css';
import Loader from '../../loader/loader';
import Modals from '../../components/modal';
import SureModals from '../../components/sureModal';
import { MDBTooltip } from 'mdb-react-ui-kit';

export default function Project() {
	let projectBackColor = ['#ff942e', '#e9e7fd', '#dbf6fd', '#fee4cb', '#ff942e']

	const [loading, setLoading] = useState(false);
	const [projectList, setProjectListValue] = useState([]);
	const [allUserList, setAllUserListValue] = useState([]);
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [selectedProject, setSelectedProject] = useState({ name: null, _id: null });
	const [selectedUser, setSelectedUser] = useState({ name: null, _id: null });
	const [showMoreUserDropDownId, setShowMoreUserDropDownId] = useState('');
	const [projectAssignedUsers, setProjectAssignedUsers] = useState([]);
	const [modalShow, setModalShow] = useState(false);
	const [sureModalShow, setSureModalShow] = useState(false);
	const userListToAddInProject = new Set();


	useEffect(() => {
		onInit();
	}, []);

	function onInit() {
		getAndSetAllProjects();
	}
	const getAndSetAllProjects = async function () {
		setLoading(true);
		try {
			const projects = await getAllProjects();
			setLoading(false);
			if (projects.error) {
				toast.error(projects.error.message, {
					position: toast.POSITION.TOP_CENTER,
					className: "toast-message",
				});
			} else {
				setProjectListValue(projects.data);
			}
		} catch (error) {
			setLoading(false);
			return error.message;
		}
	};

	const addAndRemveUserFromList = (userId) => {
		userListToAddInProject.has(userId) ? userListToAddInProject.delete(userId) : userListToAddInProject.add(userId)
		console.log(userListToAddInProject)
	}

	const checkAndGetProjectUsers = (element) => {
		if (element._id === showMoreUserDropDownId) {
			setShowMoreUserDropDownId('')
			return
		}
		getProjectAssignedUsers(element)
	}
	const getProjectAssignedUsers = async (element) => {
		console.log("element: " + element)
		try {
			let dataToSend = {
				params: { projectId: element._id }
			}
			const projectAssignedUsers = await getUsersOfProject(dataToSend);
			setLoading(false);
			if (projectAssignedUsers.error) {
				toast.error(projectAssignedUsers.error.message, {
					position: toast.POSITION.TOP_CENTER,
					className: "toast-message",
				});
				return
			} else {
				setProjectAssignedUsers(projectAssignedUsers.data);
				setShowMoreUserDropDownId(element._id);
				setSelectedProject(element);
				console.log("projectAssignedUsers.data---", projectAssignedUsers.data)
			}
		} catch (error) {
			setLoading(false);
			return error.message;
		}
	}

	const handleAddUserToProjectButton = async function (element) {
		console.log("AddUserToProject", element);
		setLoading(true);
		try {

			const projectUsers = await getAllUsers();
			setLoading(false);
			if (projectUsers.error) {
				toast.error(projectUsers.error.message, {
					position: toast.POSITION.TOP_CENTER,
					className: "toast-message",
				});
				return
			} else {
				setAllUserListValue(projectUsers.data);
			}
		} catch (error) {
			setLoading(false);
			return error.message;
		}
		try {
			let dataToSend = {
				params: { projectId: element._id }
			}
			const projectAssignedUsers = await getUsersOfProject(dataToSend);
			setLoading(false);
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
				console.log("projectAssignedUsers.data---", projectAssignedUsers.data)
			}
		} catch (error) {
			setLoading(false);
			return error.message;
		}
		// setSelectedUserId(userId)
	};
	const GetModalBody = () => {
		return (
			<>
				{
					allUserList && allUserList.map((proejctUser, index) => {
						console.log(proejctUser)
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
		console.log('GetSureModalBody', selectedProject)
		return (
			<>
				User <strong>{selectedUser.name}</strong> will be removed from Project <strong>{selectedProject.name}</strong>
				<hr></hr>
				<small>Note : <strong>{selectedUser.name}</strong> will not be able add or see tasks  </small>
			</>
		)
	}
	const removeUserFromProject = (user, project) => {
		console.log("ON", user, project)
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
		}
		return rows;

	}
	const GetShowMoreUsersModalBody = () => {
		console.log('handleMoreProjectUser', allUserList, projectAssignedUsers)
		return (
			<div className='moreParticipants'>
				{
					projectAssignedUsers && projectAssignedUsers.map((proejctUser, index) => {
						console.log(proejctUser)
						return (
							<MDBTooltip
								tag="p"
								wrapperProps={{ href: "#" }}
								title={`click to Remove ${proejctUser.name}`}
								key={proejctUser._id + index}
							>
								<img
									className='moreUserDropdownImg'
									src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
									alt={proejctUser.name}
									onClick={() => { removeUserFromProject({ name: proejctUser.name, _id: proejctUser._id }, { name: selectedProject.name, _id: selectedProject._id }) }}
								/>
								<span> {proejctUser.name}</span>
							</MDBTooltip>
						)

					})
				}
			</div>

		)
	}
	const AddSelectedUsersToProject = async () => {
		setLoading(true);
		try {
			let dataToSend = {
				projectId: selectedProjectId,
				userIds: [...userListToAddInProject]
			}
			const addRes = await assignUserToProject(dataToSend);
			console.log("AddSelectedUsersToProject", addRes);
			setLoading(false);
			if (addRes.error) {
				toast.error(addRes.error.message, {
					position: toast.POSITION.TOP_CENTER,
					className: "toast-message",
				});
				return
			} else {
				toast.success(addRes.message, {
					position: toast.POSITION.TOP_CENTER,
					className: "toast-message",
				});
				getAndSetAllProjects();
				setModalShow(false)
				userListToAddInProject.clear()
			}
		} catch (error) {
			setLoading(false);
			return error.message;
		}
	}
	const closeSureModals = () => {
		setSureModalShow(false);
		setSelectedProject({});
		setSelectedUser({});
	}
	const removeSelectedUsersFromProject = async () => {
		setLoading(true);
		try {
			let dataToSend = {
				projectId: selectedProject._id,
				userId: selectedUser._id
			}
			const removeRes = await unAssignUserToProject(dataToSend);
			console.log("unAssignUserToProject", removeRes);
			setLoading(false);
			if (removeRes.error) {
				toast.error(removeRes.error.message, {
					position: toast.POSITION.TOP_CENTER,
					className: "toast-message",
				});
				return
			} else {
				toast.success(removeRes.message, {
					position: toast.POSITION.TOP_CENTER,
					className: "toast-message",
				});
				getAndSetAllProjects();
				setShowMoreUserDropDownId('')
				// getProjectAssignedUsers(selectedProject);
				setSureModalShow(false)
			}
		} catch (error) {
			setLoading(false);
			return error.message;
		}
	}

	return (
		<>
			<h1 className="h1-text">
				<i className="fa fa-gg" aria-hidden="true"></i>  Projects
			</h1>
			<div className="project-boxes jsGridView">
				{
					projectList && projectList.map((element, projectIndex) => {
						return (
							<div key={element._id} className="project-box-wrapper">
								<div className="project-box" style={{ backgroundColor: projectBackColor[projectIndex % 5] }}>
									<div className="project-box-header">
										{/* <span>December 10, 2020</span> */}
										<div className="more-wrapper">
											<button className="project-btn-more">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical">
													<circle cx="12" cy="12" r="1" />
													<circle cx="12" cy="5" r="1" />
													<circle cx="12" cy="19" r="1" />
												</svg>
											</button>
										</div>
									</div>
									<div className="project-box-content-header">
										<p className="box-content-header">{element.name}</p>
										<p className="box-content-subheader">{element.description}</p>
									</div>
									<div className="box-progress-wrapper">
										<p className="box-progress-header">Progress</p>
										<div className="box-progress-bar">
											<span className="box-progress" style={{ width: '60%', backgroundColor: '#ff942e' }}></span>
										</div>
										<p className="box-progress-percentage">60%</p>
									</div>
									<div className="project-box-footer">
										<div className="participants">
											{
												getProjectUserIcons(element)
											}
											<button className="add-participant" style={{ color: '#ff942e' }} onClick={() => handleAddUserToProjectButton(element)}>
												<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
													<path d="M12 5v14M5 12h14" />
												</svg>
											</button>
										</div>
									</div>
								</div>
								{showMoreUserDropDownId === element._id && <GetShowMoreUsersModalBody />}
							</div>
						)
					})
				}
			</div>
			{loading ? <Loader /> : null}

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