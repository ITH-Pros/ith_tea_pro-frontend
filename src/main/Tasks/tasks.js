import React, { useEffect } from 'react';
import './tasks.css';
import Accordion from 'react-bootstrap/Accordion';
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { getAllProjects, getProjectsTask } from '../../services/user/api';
import Loader from '../../components/Loader';
import TaskModal from './ShowTaskModal';
import AddTaskModal from './AddTaskModal';
import FilterModal from './FilterModal';
import Toaster from '../../components/Toaster'


export default function Tasks() {

  const [loading, setLoading] = useState(false);
  // const [taskModalShow, setTaskModalShow] = React.useState(false);
  // const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);

  const [projectList, setProjectList] = useState([]);
  // const [projectTasks, setProjectTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  // const [selectedTaskDetails, setSelectedTaskDetails] = useState({});
	const [toaster, showToaster] = useState(false);
	const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");

  useEffect(() => {
    console.log("CALLLLED CALLED CALLED CALLED ")
    getProjectList();

  }, []);

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
        
        setSelectedProject(projectList.data?.[0])
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message||'Something Went Wrong');
      setShowToaster(true);
      return error.message;
    }
  }
  // const getAllTaskOfProject = async () => {
  //   // setLoading(true)
  //   try {
  //     let dataToSend = {
  //       params: {
  //         groupBy: "category",
  //         projectId: selectedProject._id
  //       }
  //     }
  //     // filterFormValue.createdBy && (dataToSend.createdBy = filterFormValue.createdBy)
  //     console.log("000000000000", selectedProject, dataToSend)
  //     const projectTasks = await getProjectsTask(dataToSend);
  //     // setLoading(false);
  //     if (projectTasks.error) {
  //       // toast.error(projectTasks.error.message, {
  //       //   position: toast.POSITION.TOP_CENTER,
  //       //   className: "toast-message",
  //       // });
  //       return
  //     } else {
  //       setProjectTasks(projectTasks.data)
  //       console.log("projectTasks.data---", projectTasks.data)
  //       console.log("callback called here")
  //       // callback(true)
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     return error.message;
  //   }
  // }


  const onchangeOfSelectedProject = (e) => {
    let project = projectList.find((el) => el._id === e.target.value)
    setSelectedProject(project);
    console.log("onchangeOfSelectedProject", project);

  };


  // const setSelectedProjectFromAddTask = (project) => {
  //   if (project._id === selectedProject._id) {
  //     console.log("project._id === selectedProject._id", project._id === selectedProject._id)
  //     setSelectedProject(project)
  //     getAllTaskOfProject();
  //   } else {
  //     setSelectedProject(project)
  //   }
  // }

  const TaskListComponent = (props) => {
    const { selectedProject } = props;

    const [projectTasks, setProjectTasks] = useState([]);
    const [taskFilters, setTaskFilters] = useState({})

    console.log("taskFilterstaskFilterstaskFilterstaskFilterstaskFilters", taskFilters)
    useEffect(() => {
      console.log("selectedProjectselectedProjectselectedProjectselectedProjectselectedProjectselectedProject", selectedProject)
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
        console.log("000000000000", selectedProject, dataToSend)
        const projectTasks = await getProjectsTask(dataToSend);
        // setLoading(false);
        if (projectTasks.error) {
          setToasterMessage(projectTasks?.error?.message||'Something Went Wrong');
				setShowToaster(true);
          return
        } else {
          setProjectTasks(projectTasks.data)
          console.log("projectTasks.data---", projectTasks.data)
          console.log("callback called here")
          // callback(true)
        }
      } catch (error) {
        // setLoading(false);
        setToasterMessage(error?.error?.message||'Something Went Wrong');
				setShowToaster(true);
        return error.message;
      }
    }

    const setSelectedProjectFromAddTask = (project, filterFormValue) => {
      if (project._id === selectedProject._id) {
        console.log("project._id === selectedProject._id", project._id === selectedProject._id)
        setSelectedProject(project)
        getAllTaskOfProject();
      } else {
        setSelectedProject(project)
      }
    }
    console.log(projectTasks)
    return (
      <div className='mt-5'>
        <FilterModal  selectedProject={selectedProject} setTaskFilters={setTaskFilters} />
        <AddTaskModal selectedProjectFromTask={selectedProject}
          setSelectedProjectFromAddTask={setSelectedProjectFromAddTask}
        />

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
                        // console.log(task)
                        return (
                          <TaskModal key={task._id} selectedTaskObj={task} selectedProject={selectedProject} getAllTaskOfProject={getAllTaskOfProject} />
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
          {
            selectedProject &&
            <>
              {/* <FilterModal setProjectTasks={setProjectTasks} selectedProject={selectedProject} /> */}

              {/* <AddTaskModal selectedProjectFromTask={selectedProject}
                setSelectedProjectFromAddTask={setSelectedProjectFromAddTask}
              /> */}
            </>
          }


          {/* <button className='btn btn-gradient-border btn-glow' style={{ float: "right" }} onClick={() => { setShowAddTaskModal(true) }}>Add Task</button> */}
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


