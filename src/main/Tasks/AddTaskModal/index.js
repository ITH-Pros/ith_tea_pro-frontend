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
import { getAllProjects, createTask } from '../../../services/user/api';
import Toaster from '../../../components/Toaster'
export default function AddTaskModal(props) {

    const { setSelectedProjectFromAddTask, selectedProjectFromTask, projectListFromProjectsTab } = props;
    const statusList = ["NO_PROGRESS", "ONGOING", "COMPLETED", "ONHOLD"]
    const priorityList = ["LOW", "REPEATED", "MEDIUM", "HIGH"]
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState();
    const [projectList, setProjectList] = useState(projectListFromProjectsTab || []);
    const [userList, setUserList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [selectedProject, setSelectedProject] = useState(selectedProjectFromTask);
    const [taskFormValue, setTaskFormValue] = useState({
        projectId: '', category: '', title: '', description: '',
        assignedTo: '', dueDate: '', completedDate: '',
        priority: '', status: '', attachment: '',
    });
	const [toaster, showToaster] = useState(false);
	const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");
    
    useEffect(() => {
        console.log('s*********************************s')
        !projectList?.length && getProjectList();
    }, []);

    useEffect(() => {
        setTaskFormValue({ ...taskFormValue, projectId: selectedProject._id, category: selectedProject.categories?.[0] })
        setCategoryList(selectedProject.categories)
        setUserList(selectedProject.accessibleBy)
    }, [selectedProject]);

    const getProjectList = async () => {
        setLoading(true)
        try {
            const projectList = await getAllProjects();
            setLoading(false);
            if (projectList.error) {
                setToasterMessage(projectList?.error?.message||'Something Went Wrong');
				setShowToaster(true);
                return
            } else {
                setProjectList(projectList.data)
                console.log("selectedProjectFromTask", selectedProjectFromTask)
                setSelectedProject(selectedProjectFromTask)
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message||'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    }

    const onchangeSelectedProject = (e) => {
        let project = projectList.find((el) => el._id === e.target.value)
        setSelectedProject(project);
        updateTaskFormValue(e)
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
    }

    const updateTaskDescriptionValue = (description) => {
        setTaskFormValue({ ...taskFormValue, description });
    }

    const submitTask = async () => {
        setValidated(true);

        if (!taskFormValue.projectId || !taskFormValue.category || !taskFormValue.title) {
            return
        }

        setLoading(true);
        try {
            let { projectId, category, title, description, assignedTo, dueDate, priority, status, attachment } = taskFormValue
            let dataToSend = {}
            projectId && (dataToSend["projectId"] = projectId)
            category && (dataToSend["category"] = category)
            title && (dataToSend["title"] = title)
            description && (dataToSend["description"] = description)
            assignedTo && (dataToSend["assignedTo"] = assignedTo)
            dueDate && (dataToSend["dueDate"] = dueDate)
            priority && (dataToSend["priority"] = priority)
            status && (dataToSend["status"] = status)
            const taskRes = await createTask(dataToSend);
            setLoading(false);
            if (taskRes.error) {
                setToasterMessage(taskRes?.error?.message||'Something Went Wrong');
				setShowToaster(true);
                return
            } else {
                setTaskFormValue({
                    ...taskFormValue,
                    title: '', description: '', assignedTo: '', dueDate: '', completedDate: '', priority: '', status: '', attachment: '',
                })
                setValidated(false)
                setSelectedProjectFromAddTask && setSelectedProjectFromAddTask(selectedProject, false)
                setShowAddTaskModal(false)
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message||'Something Went Wrong');
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
            let { projectId, category, title, description, assignedTo, dueDate, priority, status, attachment } = taskFormValue
            let dataToSend = {}
            projectId && (dataToSend["projectId"] = projectId)
            category && (dataToSend["category"] = category)
            title && (dataToSend["title"] = title)
            description && (dataToSend["description"] = description)
            assignedTo && (dataToSend["assignedTo"] = assignedTo)
            dueDate && (dataToSend["dueDate"] = dueDate)
            priority && (dataToSend["priority"] = priority)
            status && (dataToSend["status"] = status)

            const taskRes = await createTask(dataToSend);
            setLoading(false);
            if (taskRes.error) {
                setToasterMessage(taskRes?.error?.message||'Something Went Wrong');
				setShowToaster(true);
                return
            } else {
                console.log("taskRes.data---", taskRes.data)
                setTaskFormValue({
                    ...taskFormValue,
                    title: '', description: '', assignedTo: '', dueDate: '', completedDate: '', priority: '', status: '', attachment: '',
                })
                setValidated(false)
                setSelectedProjectFromAddTask && setSelectedProjectFromAddTask(selectedProject, true)
                setShowAddTaskModal(true)

            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message||'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    }


    return (
        <>
            <button className='btn btn-gradient-border btn-glow' style={{ float: "right" }} onClick={() => { setShowAddTaskModal(true) }}>Add Task</button>
            <Modal
                show={showAddTaskModal}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setShowAddTaskModal(false)}
                backdrop='static'
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
                                        name="projectId">
                                        <option value="" disabled>Select Project</option>
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
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        required
                                        as="select"
                                        type="select"
                                        name='category'
                                        onChange={updateTaskFormValue}
                                        value={taskFormValue.category}>
                                        <option value="" disabled>Select Category</option>
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
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="10">
                                    <Form.Label>Task Title</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Title"
                                        value={taskFormValue.title}
                                        name='title'
                                        onChange={updateTaskFormValue}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        Title is required !!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>

                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <FroalaEditorComponent tag='textarea' onModelChange={updateTaskDescriptionValue} />
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="3" >
                                    <Form.Label>Assigned To</Form.Label>
                                    <Form.Control
                                        as="select"
                                        type="select"
                                        name='assignedTo'
                                        onChange={updateTaskFormValue}
                                        value={taskFormValue.assignedTo}>
                                        <option value="">Select User</option>
                                        {userList?.map((module) => (
                                            <option value={module._id} key={module._id}>
                                                {module.name}
                                            </option>
                                        ))}
                                    </Form.Control>

                                </Form.Group>
                                <Form.Group as={Col} md="4">
                                    <Form.Label>Due Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Due date"
                                        name='dueDate'
                                        onChange={updateTaskFormValue}/>
                                </Form.Group>

                                <Form.Group as={Col} md="3" >
                                    <Form.Label>Priority</Form.Label>

                                    <Form.Control
                                        as="select"
                                        type="select"
                                        name='priority'
                                        onChange={updateTaskFormValue}
                                        value={taskFormValue.priority}>
                                        <option value="" disabled>Select Priority</option>
                                        {priorityList.map((priority) => (
                                            <option value={priority} key={priority}>
                                                {priority}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="2" >
                                    <Form.Label>Status</Form.Label>

                                    <Form.Control
                                        as="select"
                                        type="select"
                                        name='status'
                                        onChange={updateTaskFormValue}
                                        value={taskFormValue.status || statusList[0]}>
                                        <option value="" disabled>Select Status</option>
                                        {statusList?.map((status) => (
                                            <option value={status} key={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                {
                                    taskFormValue?.status === "COMPLETED" &&
                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Completed Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Completed date"
                                            name='completedDate'
                                            onChange={updateTaskFormValue}
                                            value={taskFormValue.completedDate}

                                        />
                                    </Form.Group>
                                }

                            </Row>

                            <div style={{ float: 'right', marginRight: '10px' }}>

                                <Button className="btn-gradient-border btnDanger"
                                    type="button"
                                    onClick={submitTask}>Create</Button>
                                <Button
                                    className="btn-gradient-border btnDanger"
                                    type="button"onClick={submitTaskAnother}> Create And Add Another
                                </Button>
                            </div>
                        </Form>
                        {toaster && <Toaster
                    message={toasterMessage}
                    show={toaster}
                    close={() => showToaster(false)} />
                }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
