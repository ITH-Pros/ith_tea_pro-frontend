/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import './index.css';
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import { Modal } from 'react-bootstrap';
import { getAllProjects, createTask, updateTaskDetails } from '../../../services/user/api';
import Toaster from '../../../components/Toaster'
import { CONSTENTS } from '../../../constents';
import Select from "react-select";

import { getAllLeadsWithoutPagination } from '../../../services/user/api';
export default function AddTaskModal(props) {

    const {  selectedProjectFromTask,getNewTasks, showAddTask,closeModal,selectedTask } = props;
    const statusList = CONSTENTS.statusList
    const priorityList = CONSTENTS.priorityList
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState();
    const [projectList, setProjectList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [leadLists, setLeadList] = useState([]);
	// const leadList = [{name : 'Lead 1', _id : '1'}, {name : 'Lead 2', _id : '2'}, {name : 'Lead 3', _id : '3'}]

    const [taskFormValue, setTaskFormValue] = useState({
      projectId: "",
      category: "",
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      completedDate: "",
      priority: priorityList[0],
      status: statusList[0],
      attachment: "",
      tasklead: ""
    });
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");
	const [selectedLeads, setSelectedLeads] = useState();

    useEffect(() => {
		console.log(showAddTask)
        getLeadsList();
        getProjectList();
    }, []);


    useEffect(() => {
		if(showAddTask){
			setShowAddTaskModal(true);
			patchFormForAdd();
		}

    }, [showAddTask]);

	const patchFormForAdd=()=>{
		if(selectedProjectFromTask){
			let project = projectList?.filter((item)=> item?._id == selectedProjectFromTask?._id);
			console.log(project, projectList,selectedProjectFromTask);
			setCategoryList(project[0]?.categories)
			setUserList(project[0]?.accessibleBy)
			setTaskFormValue({ ...taskFormValue, projectId: project[0]?._id, category: selectedProjectFromTask?.category || project[0]?.categories?.[0] });
			
		}else if (selectedTask){
			let project = projectList?.filter((item)=> item?._id == selectedTask?.projectId);
			console.log(selectedTask, project)

			setCategoryList(project[0]?.categories);
			setUserList(project[0]?.accessibleBy);
			let leads =  [];
			if(selectedTask?.lead?.length){
				leads = leadLists?.filter((item)=> selectedTask?.lead?.includes(item?._id))
			}
			setSelectedLeads(leads);
			let dueDateData = new Date(selectedTask?.dueDate);
			let completedDateData = new Date(selectedTask?.completedDate);
			if(selectedTask?.completedDate){
				completedDateData = completedDateData.getFullYear() + '-' + (completedDateData.getMonth() + 1 <= 9 ? '0' + (completedDateData.getMonth() + 1) : (completedDateData.getMonth() + 1)) + '-' + (completedDateData.getDate() <= 9 ? '0' + completedDateData.getDate() : completedDateData.getDate())

			}else{
				completedDateData = ''
			}
			dueDateData = dueDateData.getFullYear() + '-' + (dueDateData.getMonth() + 1 <= 9 ? '0' + (dueDateData.getMonth() + 1) : (dueDateData.getMonth() + 1)) + '-' + (dueDateData.getDate() <= 9 ? '0' + dueDateData.getDate() : dueDateData.getDate())
			setTaskFormValue({projectId: selectedTask?.projectId,
			category: selectedTask?.category,
			title: selectedTask?.title,
			description: selectedTask?.description,
			assignedTo: selectedTask?.assignedTo?._id ? selectedTask?.assignedTo?._id : selectedTask?.assignedTo,
			dueDate:dueDateData,
			completedDate: completedDateData ? completedDateData : '',
			priority: selectedTask?.priority,
			status: selectedTask?.status,
			attachment: selectedTask?.attachment,
			tasklead: selectedTask?.lead})
		}else{
			resetFormValue();
		}
	}

    const getLeadsList = async function () {
      setLoading(true);
      try {
        const lead = await getAllLeadsWithoutPagination();
        setLoading(false);

        if (lead.error) {
          setToasterMessage(lead?.error?.message || "Something Went Wrong");
          setShowToaster(true);
        } else {
          setLeadList(lead.data);
        }
      } catch (error) {
        setToasterMessage(error?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setLoading(false);
        return error.message;
      }
    };

    const getProjectList = async () => {
        setLoading(true)
        try {
            const projects = await getAllProjects();
            setLoading(false);
            if (projects.error) {
                setToasterMessage(projects?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setProjectList(projects.data)
				setCategoryList(projects.data[0]?.categories);
				setUserList(projects.data[0]?.accessibleBy)				
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    }

    const onchangeSelectedProject = (e) => {
        let project = projectList.find((el) => el._id === e.target.value);
		setTaskFormValue({
			...taskFormValue,
			category: '', assignedTo: '', 
		})
		setCategoryList(project?.categories);
		setUserList(project?.accessibleBy);	
        updateTaskFormValue(e);
    };

    const updateTaskFormValue = (e) => {
        let updateValue = { ...taskFormValue, [e.target.name]: e.target.value }
        if (e.target.name === 'status' && !(e.target.value === "COMPLETED")) {
            updateValue['completedDate'] = null
        }
        if (e.target.name === 'status' && e.target.value === "COMPLETED") {
            let today = new Date()
            let patchDateValue = today.getFullYear() + '-' + (today.getMonth() + 1 <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate())
            updateValue['completedDate'] = patchDateValue
        }
        setTaskFormValue(updateValue);
        console.log(taskFormValue,'---------------taskFormValue-----------------------------------------');
    }

    const updateTaskDescriptionValue = (description) => {
        setTaskFormValue({ ...taskFormValue, description });
    }

    const submitTask = async () => {
        setValidated(true);
      
        if (!taskFormValue.projectId || !taskFormValue.category || !taskFormValue.title||!taskFormValue.tasklead) {
            return
        }

        setLoading(true);
        try {
            let { projectId, category, title, description, assignedTo, dueDate, priority, status,tasklead, attachment } = taskFormValue
            let dataToSend = {}
            projectId && (dataToSend["projectId"] = projectId)
            category && (dataToSend["category"] = category)
            title && (dataToSend["title"] = title)
            description && (dataToSend["description"] = description)
            assignedTo && (dataToSend["assignedTo"] = assignedTo)
            dueDate && (dataToSend["dueDate"] = dueDate)
            priority && (dataToSend["priority"] = priority)
            status && (dataToSend["status"] = status)
            tasklead && (dataToSend["tasklead"] = tasklead)

            const taskRes = await createTask(dataToSend);
            setLoading(false);
            if (taskRes.error) {
                setToasterMessage(taskRes?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setTaskFormValue({
                    ...taskFormValue,
                    title: '', description: '', assignedTo: '', dueDate: '', completedDate: '', priority: '', status: '', attachment: '',
                })
                setValidated(false);
				setSelectedLeads("");
                setShowAddTaskModal(false);
				getNewTasks(projectId);
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    }

    const submitTaskAnother = async () => {
        setValidated(true);
        if (!taskFormValue.projectId || !taskFormValue.category || !taskFormValue.title) {
            return
        }
        setLoading(true)
        try {
            let { projectId, category, title, description, assignedTo, dueDate, priority, status,tasklead,completedDate } = taskFormValue
            let dataToSend = {}
            projectId && (dataToSend["projectId"] = projectId)
            category && (dataToSend["category"] = category)
            title && (dataToSend["title"] = title)
            description && (dataToSend["description"] = description)
            assignedTo && (dataToSend["assignedTo"] = assignedTo)
            dueDate && (dataToSend["dueDate"] = dueDate)
            priority && (dataToSend["priority"] = priority)
            status && (dataToSend["status"] = status)
            tasklead && (dataToSend["tasklead"] = tasklead)
			completedDate && (dataToSend["completedDate"] = completedDate)



            const taskRes = await createTask(dataToSend);
            setLoading(false);
            if (taskRes.error) {
                setToasterMessage(taskRes?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setTaskFormValue({
                    ...taskFormValue,
                    title: '', description: '', assignedTo: '', dueDate: '', completedDate: '', priority: '', status: '', attachment: '',
                })
                setValidated(false)
				setSelectedLeads("");
                setShowAddTaskModal(true)
				getNewTasks(projectId);


            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    }
    const onLeadChange = (users) => {
		console.log(users)
      let leads = users?.map((item)=> item?._id)
	  setSelectedLeads(users)
    setTaskFormValue({
      ...taskFormValue,
      tasklead: leads,
    });
  };

 const resetModalData=()=>{
	closeModal();
	resetFormValue();
	setShowAddTaskModal(false);

  }
  const resetFormValue=()=>{
	setTaskFormValue({
		projectId: "",
		category: "",
		title: "",
		description: "",
		assignedTo: "",
		dueDate: "",
		completedDate: "",
		priority: priorityList[0],
		status: statusList[0],
		attachment: "",
		tasklead: ""
	  })
  }

  const updateTask = async () => {
	setValidated(true);
  
	if (!taskFormValue.projectId || !taskFormValue.category || !taskFormValue.title||!taskFormValue.tasklead) {
		return
	}

	setLoading(true);
	try {
		let { projectId, category, title, description, assignedTo, dueDate, priority, status,tasklead, attachment,completedDate } = taskFormValue
		let dataToSend = {}
		projectId && (dataToSend["projectId"] = projectId)
		category && (dataToSend["category"] = category)
		title && (dataToSend["title"] = title)
		description && (dataToSend["description"] = description)
		assignedTo && (dataToSend["assignedTo"] = assignedTo)
		dueDate && (dataToSend["dueDate"] = dueDate)
		priority && (dataToSend["priority"] = priority)
		status && (dataToSend["status"] = status)
		tasklead && (dataToSend["tasklead"] = tasklead)
		selectedTask && (dataToSend["taskId"]= selectedTask?._id)
		completedDate && (dataToSend["completedDate"] = completedDate)

		const taskRes = await updateTaskDetails(dataToSend);
		setLoading(false);
		if (taskRes.error) {
			setToasterMessage(taskRes?.error?.message || 'Something Went Wrong');
			setShowToaster(true);
			return
		} else {
			setSelectedLeads("");
			setTaskFormValue({
				...taskFormValue,
				title: '', description: '', assignedTo: '', dueDate: '', completedDate: '', priority: '', status: '', attachment: '',
			})
			setValidated(false);
			setShowAddTaskModal(false);
			getNewTasks(projectId);
			
		}
	} catch (error) {
		console.log(error)
		setLoading(false);
		setToasterMessage(error?.error?.message || 'Something Went Wrong');
		setShowToaster(true);
		return error.message;
	}
}

    return (
      <>
        {/* <button
          className="addTaskBtn"
          style={{
            float: "right", 
            bottom: "40px",
            right: "40px",
            marginTop:"10px"
          }}
          onClick={() => {
			resetFormValue();
            setShowAddTaskModal(true);
          }}
        >
          Add Task
        </button> */}
        <Modal
          show={showAddTaskModal}
          size="xl"
          className='taskModalForm'
          aria-labelledby="contained-modal-title-vcenter"
          onHide={() => resetModalData()}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Task
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="dv-50">
              <Form noValidate validated={validated}>
                                
                <Row className="mb-3">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Project</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      type="select"
                      onChange={onchangeSelectedProject}
                      value={taskFormValue.projectId}
                      name="projectId"
                    >
                      <option value="" disabled>
                        Select Project
                      </option>
                      {projectList?.map((project) => (
                        <option value={project._id} key={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Task List is required !!
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      type="select"
                      name="category"
                      onChange={updateTaskFormValue}
                      value={taskFormValue.category}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categoryList?.map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Task List is required !!
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Lead</Form.Label>
                    {/* <Form.Control
                      required
                      as="select"
                      type="select"
                      name="tasklead"
                      onChange={updateTaskFormValue}
                      value={taskFormValue.tasklead}
                    >   */}
					<Select
					isMulti
					value={selectedLeads}
                      onChange={onLeadChange}
                      getOptionLabel={(options) => options["name"]}
                      getOptionValue={(options) => options["_id"]}
                      options={leadLists}
                    />
					{/* <option value="" disabled>
                        Select Lead
                      </option>
                      {leadLists?.map((lead) => (
                        <option value={lead?._id} key={lead?._id}>
                          {lead?.name}
                        </option>
                      ))}
					</Form.Control> */}
                    <Form.Control.Feedback type="invalid">
                      Task List is required !!
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
               

                <Row className="mb-3">
                  <Form.Group as={Col} md="12">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Title"
                      value={taskFormValue.title}
                      name="title"
                      onChange={updateTaskFormValue}
                    />

                    <Form.Control.Feedback type="invalid">
                      Title is required !!
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <FroalaEditorComponent
                    tag="textarea"
                    onModelChange={updateTaskDescriptionValue}
					model = {taskFormValue?.description}
                  />
                </Row> 

                <Row className="mb-3">
                <Form.Group as={Col} md="3">
                    <Form.Label>Assigned To</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="assignedTo"
                      onChange={updateTaskFormValue}
                      value={taskFormValue.assignedTo}
                    >
                      <option value="">Select User</option>
                      {userList?.map((module) => (
                        <option value={module._id} key={module._id}>
                          {module.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3" className='px-0'>
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Due date"
                      name="dueDate"
					  value={taskFormValue.dueDate}
                      onChange={updateTaskFormValue}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Label>Priority</Form.Label>

                    <Form.Control
                      as="select"
                      type="select"
                      name="priority"
                      onChange={updateTaskFormValue}
                      value={taskFormValue.priority}
                    >
                      <option value="" disabled>
                        Select Priority
                      </option>
                      {priorityList.map((priority) => (
                        <option value={priority} key={priority}>
                          {priority}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3" className='ps-0'>
                    <Form.Label>Status</Form.Label>

                    <Form.Control
                      as="select"
                      type="select"
                      name="status"
                      onChange={updateTaskFormValue}
                      value={taskFormValue.status || statusList[0]}
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {statusList?.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  {taskFormValue?.status === "COMPLETED" && (
                    <Form.Group as={Col} md="4">
                      <Form.Label>Completed Date</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Completed date"
                        name="completedDate"
                        onChange={updateTaskFormValue}
                        value={taskFormValue.completedDate}
                      />
                    </Form.Group>
                  )}
                </Row>

                <div className='addFormBtn'>
                  {!selectedTask && <Button 
                    className=" btn-press  btn-gradient-border btnDanger"
                    type="button"
                    onClick={submitTask}
                  >
                    Create
                  </Button>}
				  {selectedTask && <Button 
                    className=" btn-press  btn-gradient-border btnDanger"
                    type="button"
                    onClick={updateTask}
                  >
                    Update
                  </Button>}
                  {!selectedTask && <Button
                    className="btn-press btn-gradient-border btnDanger"
                    type="button"
                    onClick={submitTaskAnother}
                  >
                    {" "}
                    Create And Add Another
                  </Button>}
                </div> 
              </Form>
              {toaster && (
                <Toaster
                  message={toasterMessage}
                  show={toaster}
                  close={() => showToaster(false)}
                />
              )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}
