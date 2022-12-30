import React, { useEffect } from 'react';
import './tasks.css';
import Modal from 'react-bootstrap/Modal'
import Accordion from 'react-bootstrap/Accordion';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { getAllProjects, getProjectsTask, getTaskDetailsByTaskId, updateTaskDetails, addCommentOnTaskById } from '../../services/user/api';
import Loader from '../../loader/loader';
import { MDBTooltip } from 'mdb-react-ui-kit';
import TaskModal from './ShowTaskModal';
import { getIconClassForStatus } from './../../../src/helpers/taskStatusIcon'
import AddTaskModal from './AddTaskModal';


export default function Tasks() {

  const [loading, setLoading] = useState(false);
  const [filterModalShow, setFilterModalShow] = React.useState(false);
  const [taskModalShow, setTaskModalShow] = React.useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);

  const [projectList, setProjectList] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedTaskDetails, setSelectedTaskDetails] = useState({});


  useEffect(() => {
    getProjectList();
  }, []);

  useEffect(() => {
    getAllTaskOfProject();
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
        console.log("projectList.data---", projectList.data, projectList.data?.[0]._id)
        setSelectedProject(projectList.data?.[0])
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  }
  const getAllTaskOfProject = async (data) => {
    setLoading(true)
    try {
      let dataToSend = {
        params: {
          groupBy: "category",
          projectId: selectedProject._id
        }
      }
      console.log("000000000000", selectedProject, dataToSend)
      const projectTasks = await getProjectsTask(dataToSend);
      setLoading(false);
      if (projectTasks.error) {
        // toast.error(projectTasks.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        return
      } else {
        setProjectTasks(projectTasks.data)
        console.log("projectTasks.data---", projectTasks.data)
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  }

  const getProjectsTaskDetails = async (task) => {
    setLoading(true)
    try {
      let dataToSend = {
        params: {
          taskId: task._id
        }
      }
      const taskRes = await getTaskDetailsByTaskId(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        // toast.error(taskRes.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        return
      } else {
        console.log("taskRes.data---", taskRes.data)
        setSelectedTaskDetails(taskRes.data)
        setTaskModalShow(true)
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  }


  const addCommentOnTask = async (comment) => {
    let dataToSend = {
      comment,
      taskId: selectedTaskDetails._id,
    };
    setLoading(true);
    try {
      const comment = await addCommentOnTaskById(dataToSend);
      setLoading(false);

      if (comment.error) {
        console.log(comment.error);
        // toast.error(rating.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
      } else {
        // toast.success("Submitted succesfully !", {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        console.log("comment added succesfully ");
        // getProjectList()
        getAllTaskOfProject()
        getProjectsTaskDetails(selectedTaskDetails)
      }
    } catch (error) {
      setLoading(false);
    }
  }


  const onchangeOfSelectedProject = (e) => {
    let project = projectList.find((el) => el._id === e.target.value)
    setSelectedProject(project);
    console.log("onchangeOfSelectedProject", project);

  };
  const updateTaskDescription = async (description) => {
    console.log("updateTaskDescription", description)
    setLoading(true)
    try {
      let dataToSend = {
        taskId: selectedTaskDetails._id,
        description
      }
      const taskRes = await updateTaskDetails(dataToSend);
      setLoading(false);
      if (taskRes.error) {
        // toast.error(taskRes.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        return
      } else {
        console.log("taskRes.data---", taskRes.data)
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  }

  const updateTaskCompletedStatusAndDate = async (data) => {
    console.log("updateTaskCompletedStatusAndDate", data)
    setLoading(true)
    try {
      let dataToSend = {
        taskId: selectedTaskDetails._id,
        ...data
      }
      const taskRes = await updateTaskDetails(dataToSend);
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
        getAllTaskOfProject();
        getProjectsTaskDetails(selectedTaskDetails)
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  }

  const updateMutipleTaskDetails = async (data, taskDetails) => {
    console.log("updateMutipleTaskDetails", data)
    setLoading(true)
    try {
      let dataToSend = {
        taskId: taskDetails._id,
      }
      data.projectId && (dataToSend["projectId"] = data.projectId)
      data.category && (dataToSend["category"] = data.category)
      data.title && (dataToSend["title"] = data.title)
      data.description && (dataToSend["description"] = data.description)
      data.assignedTo && (dataToSend["assignedTo"] = data.assignedTo)
      data.dueDate && (dataToSend["dueDate"] = data.dueDate)
      data.priority && (dataToSend["priority"] = data.priority)
      data.status && (dataToSend["status"] = data.status)
      data.completedDate && (dataToSend["completedDate"] = data.completedDate)

      const taskRes = await updateTaskDetails(dataToSend);
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
        getAllTaskOfProject();
        getProjectsTaskDetails(selectedTaskDetails)
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  }

  const getPriorityTag = (task) => {
    if (task.priority) {

      return (

        <small className='priority_tag' style={{ marginLeft: '10px' }}>
          {task?.priority}
        </small>
      )
    }
  }

  const getAssignedToTag = (task) => {
    if (task.assignedTo) {

      return (

        <span className='assigned_tag' style={{ marginLeft: '10px' }}>
          <img className='img-logo' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-z3LzM-wYXYiWslzq9RADq0mAdVfFrn91gRqxcl9K&s" alt='img'></img>
          {task?.assignedTo?.name}
        </span>
      )
    }
  }

  const getDueDateTag = (task) => {
    if (task.dueDate) {
      return (
        <span className='date_tag' style={{ marginLeft: '10px' }}>
          Due {task?.dueDate?.split('T')[0]}
        </span>
      )
    }
  }

  const getCompletedDateTag = (task) => {
    if (task.completedDate) {
      return (
        <span className='date_tag' style={{ marginLeft: '10px' }}>
          Completed  {task?.completedDate?.split('T')[0]}
        </span>
      )
    }
  }

  const setSelectedProjectFromAddTask = (project, closeAndOpen) => {
    if (project._id === selectedProject._id) {
      console.log("project._id === selectedProject._id", project._id === selectedProject._id)
      setSelectedProject(project)
      !closeAndOpen && getAllTaskOfProject();
    } else {
      setSelectedProject(project)
    }
    setShowAddTaskModal(false)
    if (closeAndOpen) {
      setShowAddTaskModal(true)
    }
  }





  const FilterModal = (props) => {
    const { show } = props
    const [filterFormValue, setFilterFormValue] = useState({
      createdBy: '',
    });

    console.log("filterFormValue", filterFormValue)
    const updateFilterFormValue = (e) => {
      console.log("updateFilterFormValue  ", e.target.name, e.target.value);
      setFilterFormValue({ ...filterFormValue, [e.target.name]: e.target.value })
    }
    const closeModalAndgetAllTaskOfProject = () => {

      getAllTaskOfProject();
    }

    return (
      <Modal
        show={show}
        onHide={() => setFilterModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Task Filter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate >
            <Row className="mb-3">
              <Form.Group as={Col} md="3" >
                <Form.Control
                  as="select"
                  type="select"
                  name='createdBy'
                  onChange={updateFilterFormValue}
                  value={filterFormValue.createdBy}
                >
                  <option value="">Created By</option>
                  {selectedProject?.accessibleBy?.map((user) => (
                    <option value={user._id} key={user._id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Control>

              </Form.Group>

              {/* <Form.Group as={Col} md="3" >
                <Form.Control
                  as="select"
                  type="select"
                  onChange={onChangeOfUserAssigned}
                  value={userAssigned}
                >
                  <option value="">User Assigned</option>
                  {userList.map((module) => (
                    <option value={module._id} key={module._id}>
                      {module.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group> */}
              {/* <Form.Group as={Col} md="3" >
                <Form.Control
                  as="select"
                  type="select"
                  onChange={onChangeOfStream}
                  value={stream}
                >
                  <option value="">Select Stream</option>
                  {streamList.map((module) => (
                    <option value={module._id} key={module._id}>
                      {module.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} md="3" >
                <Form.Control
                  as="select"
                  type="select"
                  onChange={onchangeOfPriority}
                  value={priority}
                >
                  <option value="">Select Priority</option>
                  {priorityList.map((module) => (
                    <option value={module._id} key={module._id}>
                      {module.name}
                    </option>
                  ))}assignedTo
                </Form.Control>
              </Form.Group> */}
            </Row>

            {/* <Row className="mb-3">
              <Form.Group as={Col} md="3" >
                <Form.Control
                  as="select"
                  type="select"
                  onChange={onchangeOfStatus}
                  value={status}
                >
                  <option value="">Select Status</option>
                  {statusList.map((module) => (
                    <option value={module._id} key={module._id}>
                      {module.name}
                    </option>
                  ))}
                </Form.Control>

              </Form.Group>
              <Form.Group as={Col} md="3" >

                <Form.Control
                  type="date"
                  placeholder="Start Date"
                  onChange={onchangeOfStartDate}
                />

              </Form.Group>
              <Form.Group as={Col} md="3" >

                <Form.Control
                  type="date"
                  placeholder="End Date"
                  onChange={onchangeOfEndDate}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" >
                <Form.Control
                  type="text"
                  placeholder="Search Text"
                  value={searchText}
                  onChange={onchangeOfSearchText}
                />

              </Form.Group>
            </Row> */}

            {/* <Button
              className="btnDanger"
              type="submit"
              onClick={handleSubmit}
            >
              Search
            </Button>
            <Button
              className="btn-gradient-border btnDanger"
              type="submit"
              onClick={handleFormReset}
            >
              Clear Filter
            </Button> */}

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-gradient-border' onClick={() => setFilterModalShow(false)}>Close</button>
          <button className='btn btn-gradient-border' onClick={closeModalAndgetAllTaskOfProject}>Submit</button>
        </Modal.Footer>
      </Modal>
    );
  }

  const TaskListComponent = () => {
    return (
      <div className='mt-5'>
        {
          projectTasks?.map((category) => {
            console.log(category)
            return (
              <Accordion id="dialog-window" key={category._id} defaultActiveKey="1" className='mt-3 neo-box'>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{category._id}</Accordion.Header>
                  <Accordion.Body id="scrollable-content" className="accorback-neo">
                    {
                      category.tasks?.map((task) => {
                        console.log(task)
                        return (
                          <div className='taskCard' key={task._id}
                            onClick={() => { getProjectsTaskDetails(task) }}
                          >
                            <MDBTooltip
                              tag="span"
                              wrapperProps={{ href: "#" }}
                              title={task.status || 'Not Set'}
                            >
                              <i style={{ marginRight: '20px' }} className={getIconClassForStatus(task.status)} aria-hidden="true"></i>
                            </MDBTooltip>

                            {task.title?.slice(0, 100) + '.......'}

                            {getPriorityTag(task)}
                            {getDueDateTag(task)}
                            {getAssignedToTag(task)}
                            {getCompletedDateTag(task)}

                            <i style={{ marginLeft: '20px' }} className='fa fa-comments' aria-hidden="true"></i>{'  ' + task.comments?.length}
                          </div>
                        )
                      })

                    }
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

            )
          })
        }
      </div>
    )
  }

  return (
    <>
      <div className='tasks'>
        <div >
          <button className='btn btn-gradient-border btn-glow' onClick={() => setFilterModalShow(true)} style={{ float: "left" }}>Filter </button>

          <button className='btn btn-gradient-border btn-glow' style={{ float: "right" }} onClick={() => { setShowAddTaskModal(true) }}>Add Task</button>
          <Form noValidate >
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
          </Form>
        </div>

      </div>
      {/* <button className='clrfltr btn btn-gradient-border btn-glow' >Clear Filter</button> */}

      {
        filterModalShow && <FilterModal
          show={filterModalShow}
          // onHide={() => setFilterModalShow(false)}
          backdrop="static"
          keyboard={false}
        />
      }

      <TaskListComponent />

      {loading ? <Loader /> : null}
      {
        taskModalShow &&
        <TaskModal
          show={taskModalShow}
          selectedTaskDetails={selectedTaskDetails}
          selectedProject={selectedProject}
          updateTaskDescription={updateTaskDescription}
          addCommentOnTask={addCommentOnTask}
          updateTaskCompletedStatusAndDate={updateTaskCompletedStatusAndDate}
          updateMutipleTaskDetails={updateMutipleTaskDetails}
          onHide={() => setTaskModalShow(false)}
        />
      }
      {
        showAddTaskModal &&
        <AddTaskModal
          show={showAddTaskModal}
          selectedProjectFromTask={selectedProject}
          setSelectedProjectFromAddTask={setSelectedProjectFromAddTask}
          onHide={() => setShowAddTaskModal(false)}
        />
      }
    </>
  )


};


