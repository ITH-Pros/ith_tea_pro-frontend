import React, { useEffect } from 'react';
import './tasks.css';
import Accordion from 'react-bootstrap/Accordion';
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {Row, Container} from "react-bootstrap";
import { useState } from "react";
import { getAllProjects, getProjectsTask } from '../../services/user/api';
import Loader from '../../components/Loader';
import TaskModal from './ShowTaskModal';
import AddTaskModal from './AddTaskModal';
import FilterModal from './FilterModal';
import Toaster from '../../components/Toaster'
import { useLocalStorage } from '../../auth/useLocalStorage';


export default function Tasks() {


    const [loading, setLoading] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [localStorageProject, setLocalStorageProject] = useLocalStorage("selectedProject");
    const [selectedProject, setSelectedProject] = useState('');
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");


    useEffect(() => {
        getProjectList();
    }, []);

    const getProjectList = async () => {
        setLoading(true)
        try {
            const projectList = await getAllProjects();
            setLoading(false);
            if (projectList.error) {
                setToasterMessage(projectList?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return
            } else {
                setProjectList(projectList.data)
                let project = projectList.data?.[0]
                if (localStorageProject) {
                    project = projectList.data?.find((el) => el._id === localStorageProject)
                }
                setSelectedProject(project)
            }
        } catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            return error.message;
        }
    }


    const onchangeOfSelectedProject = (e) => {
        let project = projectList.find((el) => el._id === e.target.value)
        setSelectedProject(project);
        setLocalStorageProject(project._id)
    };


    const TaskListComponent = (props) => {
        const { selectedProject } = props;

        const [projectTasks, setProjectTasks] = useState([]);
        const [localStorageTaskFilters, setLocalStorageTaskFilters] = useLocalStorage("taskFilters");
        const [taskFilters, setTaskFilters] = useState(localStorageTaskFilters || {})

        useEffect(() => {
            getAllTaskOfProject();
        }, [taskFilters]);


        const getAllTaskOfProject = async () => {
            // setLoading(true)
            try {
                let params = {
                    groupBy: "category",
                    projectId: selectedProject._id
                }
                taskFilters.groupBy && (params.groupBy = taskFilters.groupBy)

                taskFilters.createdBy && (params.createdBy = taskFilters.createdBy)
                taskFilters.assignedTo && (params.assignedTo = taskFilters.assignedTo)
                taskFilters.category && (params.category = taskFilters.category)
                taskFilters.priority && (params.priority = taskFilters.priority)
                taskFilters.status && (params.status = taskFilters.status)
                let dataToSend = {
                    params
                }
                const projectTasks = await getProjectsTask(dataToSend);
                // setLoading(false);
                if (projectTasks.error) {
                    setToasterMessage(projectTasks?.error?.message || 'Something Went Wrong');
                    setShowToaster(true);
                    return
                } else {
                    setProjectTasks(projectTasks.data)
                    // callback(true)
                }
            } catch (error) {
                // setLoading(false);
                setToasterMessage(error?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
                return error.message;
            }
        }

        const setSelectedProjectFromAddTask = (project, filterFormValue) => {
            if (project._id === selectedProject._id) {
                setSelectedProject(project)
                setLocalStorageProject(project._id)
                getAllTaskOfProject();
            } else {
                setSelectedProject(project)
                setLocalStorageProject(project._id)


            }
        }
        return (
            <div >
                <FilterModal selectedProject={selectedProject} setTaskFilters={setTaskFilters} />
                <AddTaskModal selectedProjectFromTask={selectedProject}
                    setSelectedProjectFromAddTask={setSelectedProjectFromAddTask}
                />
                {/* {
                    Object.keys(taskFilters).map(el => {
                        return (
                            <button> {taskFilters[el]}{el}</button>
                        )
                    })
                } */}

                {
                    projectTasks?.map((category) => {
                        let key = typeof category._id === 'object' ? (category._id?.name || "Not Assigned") : category._id
                        return (
                            <>
                            <Container>
                                <Accordion
                                id="dialog-window"
                                key={key}
                                defaultActiveKey="1"
                                >
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                    <div className="dotBeforeTitle">&nbsp;</div>
                                    {key}  ITH Technologies / Recru 2.0
                                    </Accordion.Header>
                                    <Accordion.Body id="scrollable-content">
                                    {category.tasks?.map((task) => {
                                        return (
                                        <TaskModal
                                            category={category}
                                            key={task._id}
                                            selectedTaskObj={task}
                                            selectedProject={selectedProject}
                                            getAllTaskOfProject={
                                            getAllTaskOfProject
                                            }
                                        />
                                        );
                                    })}
                                    </Accordion.Body>
                                </Accordion.Item>
                                </Accordion>
                            </Container>
                          </>
                        );
                    })
                }
            </div >
        )
    }

    return (
        <>
            <div className='tasks'>

                <div >
                    {/* {
                        selectedProject &&
                        <>
                            <FilterModal setProjectTasks={setProjectTasks} selectedProject={selectedProject} />

                            <AddTaskModal selectedProjectFromTask={selectedProject}
                setSelectedProjectFromAddTask={setSelectedProjectFromAddTask}
              />
                        </>
                    } */}


                    {/* <button className='btn btn-gradient-border btn-glow' style={{ float: "right" }} onClick={() => { setShowAddTaskModal(true) }}>Add Task</button> */}
                    {/* <Form noValidate >
                        <Row className="mb-3">
                            <Form.Group as={Col} md="3" >
                                <Form.Control
                                    as="select"
                                    type="select"
                                    onChange={onchangeOfSelectedProject}
                                    value={selectedProject._id}
                                >
                                    <option value="" disabled>Select project</option>
                                    {
                                        projectList?.map((project) => {
                                            return (
                                                <option value={project._id} key={project._id} >
                                                    {project.name}
                                                </option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Row>
                    </Form> */}
                    {selectedProject && <TaskListComponent selectedProject={selectedProject} />}
                </div>
            </div>

            {loading ? <Loader /> : null}
            {toaster && <Toaster
                message={toasterMessage}
                show={toaster}
                close={() => showToaster(false)} />}
        </>
    )


};


