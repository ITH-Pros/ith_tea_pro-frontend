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
import TaskModal from '../../components/TaskModal';
import { getIconClassForStatus } from './../../../src/helpers/taskStatusIcon'


export default function Tasks() {

  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [taskModalShow, setTaskModalShow] = React.useState(false);
  // const [userAssigned, setUserAssigned] = useState("");
  // const [createdBy, setCreatedBy] = useState("");
  // const [stream, setStream] = useState("");
  // const [status, setStatus] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [searchText, setSearchText] = useState("");
  // const [priority, setPriority] = useState("");
  // const [userList, setUserList] = useState([]);
  // const [priorityList, setpriorityList] = useState([]);
  // const [streamList, setstreamList] = useState([]);
  // const [statusList, setStatusList] = useState([]);
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
  const getAllTaskOfProject = async () => {
    setLoading(true)
    try {
      let dataToSend = {
        params: {
          groupBy: "category",
          projectId: selectedProject._id
        }
      }
      console.log("000000000000", selectedProject)
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

  const updateTaskTitle = async (title) => {
    console.log("updateTaskTitle", title)
    setLoading(true)
    try {
      let dataToSend = {
        taskId: selectedTaskDetails._id,
        title
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
        getAllTaskOfProject()

      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }


  }

  const updateTaskCategory = async (category) => {
    console.log("updateTaskCategory", category)
    setLoading(true)
    try {
      let dataToSend = {
        taskId: selectedTaskDetails._id,
        category
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
        getAllTaskOfProject();
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }


  }

  const updateTaskAssignedTo = async (assignedTo) => {
    console.log("updateTaskAssignedTo", assignedTo)
    setLoading(true)
    try {
      let dataToSend = {
        taskId: selectedTaskDetails._id,
        assignedTo
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
        // getAllTaskOfProject();
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  }

  const updateTaskDueDate = async (dueDate) => {
    console.log("updateTaskDueDate", dueDate)
    setLoading(true)
    try {
      let dataToSend = {
        taskId: selectedTaskDetails._id,
        dueDate
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
        // getAllTaskOfProject();
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }


  }

  // const FilterModal = (props) => {
  //   return (
  //     <Modal
  //       {...props}
  //       size="lg"
  //       aria-labelledby="contained-modal-title-vcenter"
  //       centered
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title id="contained-modal-title-vcenter">
  //           Task Filter
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Form noValidate >
  //           <Row className="mb-3">
  //             <Form.Group as={Col} md="3" >
  //               <Form.Control
  //                 as="select"
  //                 type="select"
  //                 onChange={onChangeOfCreatedBy}
  //                 value={createdBy}
  //               >
  //                 <option value="">Created By</option>
  //                 {userList.map((module) => (
  //                   <option value={module._id} key={module._id}>
  //                     {module.name}
  //                   </option>
  //                 ))}
  //               </Form.Control>

  //             </Form.Group>
  //             <Form.Group as={Col} md="3" >
  //               <Form.Control
  //                 as="select"
  //                 type="select"
  //                 onChange={onChangeOfUserAssigned}
  //                 value={userAssigned}
  //               >
  //                 <option value="">User Assigned</option>
  //                 {userList.map((module) => (
  //                   <option value={module._id} key={module._id}>
  //                     {module.name}
  //                   </option>
  //                 ))}
  //               </Form.Control>
  //             </Form.Group>
  //             <Form.Group as={Col} md="3" >
  //               <Form.Control
  //                 as="select"
  //                 type="select"
  //                 onChange={onChangeOfStream}
  //                 value={stream}
  //               >
  //                 <option value="">Select Stream</option>
  //                 {streamList.map((module) => (
  //                   <option value={module._id} key={module._id}>
  //                     {module.name}
  //                   </option>
  //                 ))}
  //               </Form.Control>
  //             </Form.Group>
  //             <Form.Group as={Col} md="3" >
  //               <Form.Control
  //                 as="select"
  //                 type="select"
  //                 onChange={onchangeOfPriority}
  //                 value={priority}
  //               >
  //                 <option value="">Select Priority</option>
  //                 {priorityList.map((module) => (
  //                   <option value={module._id} key={module._id}>
  //                     {module.name}
  //                   </option>
  //                 ))}
  //               </Form.Control>
  //             </Form.Group>
  //           </Row>

  //           <Row className="mb-3">
  //             <Form.Group as={Col} md="3" >
  //               <Form.Control
  //                 as="select"
  //                 type="select"
  //                 onChange={onchangeOfStatus}
  //                 value={status}
  //               >
  //                 <option value="">Select Status</option>
  //                 {statusList.map((module) => (
  //                   <option value={module._id} key={module._id}>
  //                     {module.name}
  //                   </option>
  //                 ))}
  //               </Form.Control>

  //             </Form.Group>
  //             <Form.Group as={Col} md="3" >
  //               {/* <Form.Label>Start Date</Form.Label> */}

  //               <Form.Control
  //                 type="date"
  //                 placeholder="Start Date"
  //                 onChange={onchangeOfStartDate}
  //               />

  //             </Form.Group>
  //             <Form.Group as={Col} md="3" >
  //               {/* <Form.Label>End Date</Form.Label> */}

  //               <Form.Control
  //                 type="date"
  //                 placeholder="End Date"
  //                 onChange={onchangeOfEndDate}
  //               />
  //             </Form.Group>
  //             <Form.Group as={Col} md="3" >
  //               <Form.Control
  //                 type="text"
  //                 placeholder="Search Text"
  //                 value={searchText}
  //                 onChange={onchangeOfSearchText}
  //               />

  //             </Form.Group>
  //           </Row>

  //           <Button
  //             className="btnDanger"
  //             type="submit"
  //             onClick={handleSubmit}
  //           >
  //             Search
  //           </Button>
  //           <Button
  //             className="btn-gradient-border btnDanger"
  //             type="submit"
  //             onClick={handleFormReset}
  //           >
  //             Clear Filter
  //           </Button>

  //         </Form>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <button className='btn btn-gradient-border ' onClick={props.onHide}>Close</button>
  //       </Modal.Footer>
  //     </Modal>
  //   );
  // }

  return (
    <>
      <div className='tasks'>
        <div >
          <button className='btn btn-gradient-border btn-glow' onClick={() => setModalShow(true)} style={{ float: "left" }}>Filter </button>
          <Link to="/task/add" >
            {(<button className='btn btn-gradient-border btn-glow' style={{ float: "right" }}><span>Add Task</span></button>)}
          </Link>
          {/* <button className='btn btn-gradient-border btn-glow' variant="primary" style={{ float: "right" }}>Add Tasks</button> */}
          <Form noValidate >
            <Row className="mb-3">
              <Form.Group as={Col} md="3" >
                <Form.Control
                  as="select"
                  type="select"
                  onChange={onchangeOfSelectedProject}
                  value={selectedProject._id}
                >
                  <option value="">Select project</option>
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

        {/* <button className='clrfltr btn btn-gradient-border btn-glow' >Clear Filter</button> */}
      </div>

      {/* <FilterModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
      /> */}

      <div className='mt-5'>
        {
          projectTasks?.map((category) => {
            console.log(category)
            return (

              <Accordion key={category._id} defaultActiveKey="1" className='mt-5'>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{category._id}</Accordion.Header>
                  <Accordion.Body>
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
                              title={task.status}
                            >
                              <i className={getIconClassForStatus(task.status)} aria-hidden="true"></i>
                            </MDBTooltip>
                            {task.title + '.......'}
                            <i className='fa fa-comments' aria-hidden="true"></i>{'  ' + task.comments?.length}
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

      {loading ? <Loader /> : null}
      {
        taskModalShow &&
        <TaskModal
          show={taskModalShow}
          selectedTaskDetails={selectedTaskDetails}
          selectedProject={selectedProject}
          updateTaskDescription={updateTaskDescription}
          addCommentOnTask={addCommentOnTask}
          updateTaskTitle={updateTaskTitle}
          updateTaskCategory={updateTaskCategory}
          updateTaskAssignedTo={updateTaskAssignedTo}
          updateTaskDueDate={updateTaskDueDate}
          onHide={() => setTaskModalShow(false)}
        />
      }
    </>
  )


};



