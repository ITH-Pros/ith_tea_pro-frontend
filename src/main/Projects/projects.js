import { useEffect, useState } from 'react';
import { getAllProjects, getAllUsers, getUsersOfProject } from '../../services/user/api';
import { toast } from "react-toastify";

import './projects.css';
import Loader from '../../loader/loader';
import Modals from '../../components/modal';

export default function Project() {
	let projectBackColor = ['#ff942e', '#e9e7fd', '#dbf6fd', '#fee4cb', '#ff942e']

	const [loading, setLoading] = useState(false);
	const [projectList, setProjectListValue] = useState([]);
	const [allUserList, setAllUserListValue] = useState([]);
	const [modalShow, setModalShow] = useState(false);


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

	const handleAddUserToProject = async function (element) {
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
		setModalShow(true);
	};
	const GetModalBody = () => {
		return (
			<>
				{
					allUserList.map((proejctUser, index) => {
						console.log(proejctUser)
						return (
							<div key={proejctUser._id} >
								<input type='checkbox'></input>
								<span> {proejctUser.name}</span>
							</div>
						)

					})
				}
			</>
		)
	}
	const getProjectUserIcons = (projectUsers) => {
		let rows = [];
		console.log()
		for (let i = 0; i < projectUsers?.length; i++) {
			let user = projectUsers[i]
			if (i === 5) {
				rows.push(
					//PUT IMAGE/ICON for MORE here...
					<span key={user._id + i} onClick={handleMoreProjectUser}> (...) </span>
				);
				break
			}
			console.log(user)
			rows.push(
				<img key={user._id + i} src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="participant" />
			);
		}
		return rows;

	}
	const handleMoreProjectUser = () => {
		console.log('handleMoreProjectUser')
	}

	return (
		<>
			<h1 className="h1-text">
				<i className="fa fa-gg" aria-hidden="true"></i>  Projects
			</h1>
			<div className="project-boxes jsGridView">
				{
					projectList.map((element, projectIndex) => {
						return (
							<div key={element._id} className="project-box-wrapper">
								<div className="project-box" style={{ backgroundColor: projectBackColor[projectIndex % 5] }}>
									<div className="project-box-header">
										{/* <span>December 10, 2020</span> */}
										<div className="more-wrapper">
											<button  className="project-btn-more">
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
												getProjectUserIcons(element?.accessibleBy)
											}
											<button className="add-participant" style={{ color: '#ff942e' }} onClick={() => handleAddUserToProject(element)}>
												<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
													<path d="M12 5v14M5 12h14" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
			{loading ? <Loader /> : null}

			<Modals
				modalShow={modalShow}
				keyboardProp={true} 
				backdropProp='static'
				modalBody={<GetModalBody />}
				heading='Assign Project'
				onHide={() => setModalShow(false)}
			/>
		</>
	);
}