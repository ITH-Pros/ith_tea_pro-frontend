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
import { getAllProjects, getProjectsTask, getTaskDetailsByTaskId } from '../../services/user/api';
import Loader from '../../loader/loader';

export default function Tasks() {

  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [userAssigned, setUserAssigned] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [stream, setStream] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [priority, setPriority] = useState("");
  const [userList, setUserList] = useState([]);
  const [priorityList, setpriorityList] = useState([]);
  const [streamList, setstreamList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");


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
        setSelectedProject(projectList.data?.[0]._id)
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
          projectId: selectedProject
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
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }

  }

  const onchangeOfSelectedProject = (e) => {
    setSelectedProject(e.target.value);
    console.log("onchangeOfSelectedProject", e.target.value);

  };

  const onChangeOfUserAssigned = (e) => {
    setUserAssigned(e.target.value);
  };

  const onChangeOfCreatedBy = (e) => {
    setCreatedBy(e.target.value);
  };

  const onChangeOfStream = (e) => {
    setStream(e.target.value);
  };

  const onchangeOfPriority = (e) => {
    setPriority(e.target.value);
  };

  const onchangeOfStatus = (e) => {
    setStatus(e.target.value);
  };
  const onchangeOfStartDate = (e) => {
    setStartDate(e.target.value);
  };
  const onchangeOfEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const onchangeOfSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const handleFormReset = (e) => {
    e.preventDefault();

    console.log('filter reseted succesfully')

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('filter form searched  succesfully')

  }

  function FilterModal(props) {
    return (
      <Modal
        {...props}
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
                  onChange={onChangeOfCreatedBy}
                  value={createdBy}
                >
                  <option value="">Created By</option>
                  {userList.map((module) => (
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
              </Form.Group>
              <Form.Group as={Col} md="3" >
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
                  ))}
                </Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
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
                {/* <Form.Label>Start Date</Form.Label> */}

                <Form.Control
                  type="date"
                  placeholder="Start Date"
                  onChange={onchangeOfStartDate}
                />

              </Form.Group>
              <Form.Group as={Col} md="3" >
                {/* <Form.Label>End Date</Form.Label> */}

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
            </Row>

            <Button
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
            </Button>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-gradient-border ' onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  function getIconClassForStatus(status) {
    let className;
    switch (status) {
      case 'COMPLETED':
        className = 'fa fa-check-circle'
        break;
      case 'ONHOLD':
        className = 'fa fa-stop'
        break;
      case 'NO_PROGRESS':
        className = 'fa fa-bath'
        break;
      case "ONGOING":
        className = 'fa fa-line-chart'
        break;
      default:
        className = "fa fa-exclamation-circle"
    }
    return className
  }


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
                  // className="project-filter"
                  onChange={onchangeOfSelectedProject}
                  value={selectedProject}
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

      <FilterModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
      />

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
                            <i className={getIconClassForStatus(task.status)} aria-hidden="true"></i> {task.title + '.......'}
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



    </>
  )


};





