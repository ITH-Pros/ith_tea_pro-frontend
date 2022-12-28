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

export default function AddTaskModal(props) {
    const { show, onHide } = props;

    const statusList = ["NO_PROGRESS", "ONGOING", "COMPLETED", "ONHOLD"]
    const priorityList = ["LOW", "REPEATED", "MEDIUM", "HIGH"]

    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [userList, setUserList] = useState([]);
    // const [taskListArray, setTaskListArray] = useState([]);
    const [validated, setValidated] = useState(false);
    const [selectedProject, setSelectedProject] = useState({});

    const [taskFormValue, setTaskFormValue] = useState({
        projectId: '',
        category: '',
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "",
        status: "",
        attachment: "",
    });

    useEffect(() => {
        getProjectList();
    }, []);
    useEffect(() => {
        setTaskFormValue({ ...taskFormValue, projectId: selectedProject._id, category: selectedProject.categories?.[0] })
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
                // toast.error(projectList.error.message, {
                //   position: toast.POSITION.TOP_CENTER,
                //   className: "toast-message",
                // });
                return
            } else {
                setProjectList(projectList.data)
                setSelectedProject(projectList.data?.[0])
                // setTaskFormValue({ ...taskFormValue, projectId: projectList.data?.[0]._id, category: projectList.data?.[0].categories?.[0] })
                // setTaskFormValue({ ...taskFormValue, projectId: projectList.data?.[0]._id, category: projectList.data?.[0].categories?.[0] })
                // setCategoryList(projectList.data?.[0].categories)
                // setUserList(projectList.data?.[0].accessibleBy)
            }
        } catch (error) {
            setLoading(false);
            return error.message;
        }
    }

    const onchangeSelectedProject = (e) => {
        let project = projectList.find((el) => el._id === e.target.value)
        setSelectedProject(project);
        updateTaskFormValue(e)
    };
    const updateTaskFormValue = (e) => {
        console.log("updateTaskFormValue", e.target.name, e.target.value);
        setTaskFormValue({ ...taskFormValue, [e.target.name]: e.target.value });
    }
    const updateTaskDescriptionValue = (description) => {
        console.log("updateTaskDescriptionValue", description);
        setTaskFormValue({ ...taskFormValue, description });
    }

    const submitTask = async () => {
        setValidated(true);
        setLoading(true)
        try {
            const taskRes = await createTask(taskFormValue);
            setLoading(false);
            if (taskRes.error) {
                // toast.error(taskRes.error.message, {
                //   position: toast.POSITION.TOP_CENTER,
                //   className: "toast-message",
                // });
                return
            } else {
                console.log("taskRes.data---", taskRes.data)
                // getProjectList()
                // getAllTaskOfProject();
                // getProjectsTaskDetails(selectedTaskDetails)
            }
        } catch (error) {
            setLoading(false);
            return error.message;
        }
        // e.preventDefault();
        // e.stopPropagation();
    }


    return (
        <Modal
            show={show}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Task
                </Modal.Title>
            </Modal.Header>
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
                                {/* {'jjjjjjjjj' + taskFormValue.project} */}
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
                                value={taskFormValue.category}
                            >
                                <option value="">Select</option>
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
                        <Form.Group as={Col} md="3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Due date"
                                name='dueDate'
                                onChange={updateTaskFormValue}
                            />

                        </Form.Group>

                        <Form.Group as={Col} md="3" >
                            <Form.Label>Priority</Form.Label>

                            <Form.Control
                                as="select"
                                type="select"
                                name='priority'
                                onChange={updateTaskFormValue}
                                value={taskFormValue.priority}
                            >
                                <option value="" disabled>Select Priority</option>
                                {priorityList.map((priority) => (
                                    <option value={priority} key={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} md="2" >
                            <Form.Label>Status</Form.Label>

                            <Form.Control
                                as="select"
                                type="select"
                                name='status'
                                onChange={updateTaskFormValue}
                                value={taskFormValue.status}
                            >
                                <option value="" disabled>Select Status</option>
                                {statusList.map((status) => (
                                    <option value={status} key={status}>
                                        {status}
                                    </option>
                                ))}
                            </Form.Control>

                        </Form.Group>
                    </Row>

                    {/* <Row className="mb-3">
                        <Form.Group as={Col} md="2" >
                            <Form.Label>Attachment</Form.Label>
                            <input type="file" />
                        </Form.Group>
                        </Row > */}

                    <div style={{ float: 'right', marginRight: '10px' }}>

                        <Button
                            className="btn-gradient-border btnDanger"
                            type="button"
                            onClick={submitTask}
                        >
                            Create
                        </Button>
                        <Button
                            className="btn-gradient-border btnDanger"
                            type="submit"
                        // onClick={handleSubmit}
                        >
                            Create And Add Another
                        </Button>

                        {/* <Button
                            className="btn-gradient-border btnDanger"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Copy From Another Task
                        </Button> */}
                    </div>

                </Form>


            </div>
        </Modal >
    );
}
