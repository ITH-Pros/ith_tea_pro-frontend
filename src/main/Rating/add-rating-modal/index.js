/* eslint-disable default-case */
import React from "react";
import { useState, useEffect } from "react";
import "react-date-picker/dist/DatePicker.css";
import "../rating.css";
// import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import { addRating } from "../../services/user/api";
// import Dashboard from "../Dashboard/dashboard";
// import Loader from "../../components/Loader";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';
// import { getAllUserDataForRating } from "../../services/user/api";
import "react-toastify/dist/ReactToastify.css";
// import { useLocation, useNavigate } from "react-router-dom";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
// import Toaster from "../../components/Toaster";
// import { useAuth } from "../../auth/AuthProvider";
// import ViewRatings from "./View-Rating";
// import Modal from "react-modal";
import { useAuth } from "../../../auth/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { addRating, getAllAssignedProject, getAllProjects, getAllUserDataForRating, getProjectsTask, getTaskDetailsByProjectId } from "../../../services/user/api";



export default function AddRatingModal(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { userDetails } = useAuth();

	const { selectedRating } = props;
	// console.log(selectedRating, "pendingRating");

	useEffect(() => {


		if (selectedRating) {
			const today = new Date();
			let patchDateValue =
			today.getFullYear() +
			"-" +
			(today.getMonth() + 1 <= 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1) +
			"-" +
			(today.getDate() <= 9 ? "0" + today.getDate() : today.getDate());
			setDate(patchDateValue);
		  	setProject(selectedRating.projectId);
		  	setTeam(selectedRating.assignedTo);
		  if (selectedRating.dueDate) {
			const formattedDate = new Date(selectedRating.dueDate).toISOString().substr(0, 10);
			setDate(formattedDate);
		  }
		//   setRating(selectedRating.rating);
		  setComments(selectedRating.ratingComments);
		}

		getTaskList();
	  }, [selectedRating]);


	//   const patchTask = () => {
		
	//   };

	function splitDate(dateStr) {
		const dateList = dateStr.split("T")[0].split("-");
		const year = dateList[0];
		const month = dateList[1];
		const day = dateList[2];
		return `${year}-${month}-${day}`;
	  }

	const [isOpen, setIsOpen] = useState(false);

	const handleOpenModal = () => {
	  setIsOpen(true);
	};
  
	const handleCloseModal = () => {
	  setIsOpen(false);
	};

    useEffect(() => {
        onInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onInit() {
		getAndSetAllProjects();
        getUsersList();
    }
    let today = new Date();
    let patchDateValue = today.getFullYear() + '-' + (today.getMonth() + 1 <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate())
    const [loading, setLoading] = useState(false);
	
    // const [currentView, setCurrentView] = useState("View");
	const [projectOptions, setProjectOptions] = useState([]);
	const [project, setProject] = useState("");
	const [taskOptions, setTaskOptions] = useState([]);
	const [task , setTask] = useState("");
    const [teamOptions, setTeamOptions] = useState([]);
    const [team, setTeam] = useState("");
    const [date, setDate] = useState(patchDateValue);
    const [rating, setRating] = useState("");
    const [comments, setComments] = useState("");
    const [validated, setValidated] = useState(false);
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");

	const [selectedProject, setSelectedProject] = useState({});
    if (!team && location && location.state && location.state.userId) {
        setTeam(location.state.userId)
    }
    if (location && location.state && location.state.date && location.state.date !== date) {
        setDate(location.state.date)
        location.state.date = '';
    }

	const onChangeOfTask = (e) => {
		setTask(e.target.value);
		
	};

	const onChangeOfProject = (e) => {
		setProject(e.target.value);
		console.log("e.target.value", e.target.value);
		// get project on basis of project id
		const selectedProject = projectOptions.find((project) => project._id === e.target.value);
		console.log("selectedProject", selectedProject);
		setSelectedProject(selectedProject);
		setTeamOptions(selectedProject?.accessibleBy);
		console.log("selectedProject.accessibleBy", selectedProject?.accessibleBy);
		console.log("teamOptions", teamOptions);

	};

    const onchangeTeam = (e) => {
        setTeam(e.target.value);
		// team = e.target.value;
		console.log("e.target.value", e.target.value);
		console.log("team", team);
		getTaskList(e.target.value);

    };

    const handleChangeDate = (e) => {
        setDate(e.target.value);
		// date = e.target.value;
		console.log("date", e.target.value);
		getTaskList(e.target.value);
    };

	const getTaskList = async function (data) {
	
        setLoading(true);

		try {
			const dataToSend = {
			};

			if (selectedRating) {
				console.log("selectedRating.projectId", selectedRating.projectId);
				dataToSend.projectId = selectedRating.projectId;
				dataToSend.userId = selectedRating.assignedTo;
				dataToSend.dueDate = date;
			}
			else if(team==''){
				dataToSend.projectId = project;
				dataToSend.userId = data;
				dataToSend.dueDate = date;
				// console.log("dataToSend", dataToSend);
			}
			else {
				dataToSend.projectId = project;
				dataToSend.userId = team;
				dataToSend.dueDate = data;
			}

			// else {
			// 	dataToSend.projectId = project;
			// 	dataToSend.userId = team;
			// 	dataToSend.dueDate = date;
			// }



			const response = await getTaskDetailsByProjectId(dataToSend);
			console.log("response", response);
			if (response.error ) {
				// setToasterMessage(response.error);
				// setShowToaster(true);
				console.log("error", response.error);
				
			}else {
				setTaskOptions(response.data);

				if(selectedRating._id){
					console.log("selectedRating._id", selectedRating._id);
					setTask(selectedRating._id);
				}
				// setRating(selectedRating.rating);
			}
			
		} catch (error) {
			console.log("error", error);
		}

        setLoading(false);

	};





    const onChangeOfComments = (e) => {
        setComments(e)
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleSubmit = (e) => {
        setValidated(true);
        e.preventDefault();
        e.stopPropagation();

        if (!team || !date || !rating || rating > 5 || rating < 0) {
            return;
        } else {
            let dataToSend = {
                userId: team,
                date: date?.split("-")[2],
                year: date?.split("-")[0],
                month: date?.split("-")[1],
                rating: rating,
                comment: comments,
				taskId: task,
				projectId: project,
                // taggedUsers: tags,
            };

            addRatingFunc(dataToSend);
        }
    };


	const getAndSetAllProjects = async function () {
		//setloading(true);
		try {
			const dataToSend = {
				alphabetical:true
			}

		  const projects = await getAllAssignedProject(dataToSend);
		  //setloading(false);
		  if (projects.error) {
			setToasterMessage(projects?.error?.message || "Something Went Wrong");
			setShowToaster(true);
		  } else {
			setProjectOptions(projects.data);
		  }
		} catch (error) {
		  setToasterMessage(error?.error?.message || "Something Went Wrong");
		  setShowToaster(true);
		  //setloading(false);
		  return error.message;
		}
	  };





    const getUsersList = async function () {

        setLoading(true);
        try {

            const user = await getAllUserDataForRating();
            setLoading(false);

            if (user.error) {
                setToasterMessage(user?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {

                setTeamOptions(user?.data);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
    };

    async function addRatingFunc(data) {
        setLoading(true);
        try {
            const rating = await addRating(data);
            setLoading(false);
            if (rating.error) {
                setToasterMessage(rating?.error?.message || 'Something Went Wrong');
                setShowToaster(true);

            } else {
                setToasterMessage('Rating Added Succesfully');
                setShowToaster(true);
                navigate('/rating')
            }
        }
        catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
        }
    }



		return (
			<div className="dv-50-rating ">
				<Form className="margin-form" noValidate validated={validated}>
					<Row className="mb-3">

					<Form.Group as={Col} md="4" >
							<Form.Label>Select Project</Form.Label>
							<Form.Control
								required
								as="select"
								type="select"
								name="select_project"
								onChange={onChangeOfProject}
								value={project}
							>
								<option value="">Select Project</option>
								{projectOptions.map((module) => (
									<option value={module._id} key={module._id}>
										{module.name}
									</option>
								))}
							</Form.Control>
							<Form.Control.Feedback type="invalid">
								User name is required !!
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>

						<Form.Group as={Col} md="4" >
							<Form.Label>Select User</Form.Label>
							<Form.Control
								required
								as="select"
								type="select"
								name="select_team"
								onChange={onchangeTeam}
								value={team}
							>
								<option value="">Select User</option>
								{teamOptions.map((module) => (
									<option value={module._id} key={module._id}>
										{module.name}
									</option>
								))}
							</Form.Control>
							<Form.Control.Feedback type="invalid">
								User name is required !!
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
						<Form.Group as={Col} md="4" controlId="rating_date">
							<Form.Label>Date</Form.Label>
							<Form.Control
								required
								type="date"
								name="rating_date"
								placeholder="Rating  date"
								onChange={handleChangeDate}
								max={new Date().toISOString().split("T")[0]}
								value={date}
							/>
							<Form.Control.Feedback type="invalid">
								Date is required !!
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>


						<Form.Group as={Col} md="4" >
							<Form.Label>Select Task</Form.Label>
							<Form.Control
								required
								as="select"
								type="select"
								name="select_task"
								onChange={onChangeOfTask}
								value={task}
							>
								<option value="">Select Task</option>
								{taskOptions.map((module) => (
									<option value={module._id} key={module._id}>
										{module.title}
									</option>
								))}
							</Form.Control>
							<Form.Control.Feedback type="invalid">
								Task is required !!
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>





						<Form.Group as={Col} md="4" controlId="validationCustom01">
							<Form.Label>Rating</Form.Label>
							<Form.Control
								required
								type="number"
								placeholder="Rating"
								value={rating}
								onChange={handleRatingChange}
								pattern="[0-9]*"
								inputMode="numeric"
								min="0"
								max="5"
							/>
							<Form.Control.Feedback type="invalid">
								Rating is required, value must be in range [0,5] !!
							</Form.Control.Feedback>
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
						</Form.Group>
					</Row>
					<Row className="mb-3 desc">
						<Form.Label>Comment</Form.Label>
						<FroalaEditorComponent tag='textarea' onModelChange={onChangeOfComments} />
					</Row>

									<div className="text-right">
					<button onClick={handleSubmit} className="btn-gradient-border btnDanger submit">Submit</button>
					</div>
				</Form>
			</div>
		);


  
}
