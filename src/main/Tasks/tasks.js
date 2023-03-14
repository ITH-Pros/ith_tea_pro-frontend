import React, { useState, useEffect } from "react";
import './tasks.css';
import {  getProjectsTask } from "../../services/user/api";
import Loader from "../../components/Loader";
import Toaster from "../../components/Toaster";
import FilterModal from "./FilterModal";
import AddTaskModal from "./AddTaskModal";
import TaskModal from "./ShowTaskModal";
import {Accordion, ProgressBar, Row, Col, Dropdown, Badge } from 'react-bootstrap'
import avtar from '../../assests/img/avtar.png'
import moment from "moment";

const Tasks=()=> {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [taskFilters, setTaskFilters] = useState({});
  const [selectedProject, setSelectedProject] = useState({});
  const [taskData, setTaskData] = useState({});
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});

  const setShowToaster = (param) => showToaster(param);
    
  useEffect(() => {
	getTasksDataUsingProjectId();
  }, []);
    
    



    
     const getTasksDataUsingProjectId = async ( ) => {
         setLoading(true);
         try {
             let data = {};
             data = {
                 groupBy:"default"
             };
			 if(localStorage.getItem('taskFilters')){
				let filterData = JSON.parse(localStorage.getItem('taskFilters'))
				if(filterData?.projectIds){
					filterData.projectIds = JSON.stringify(filterData?.projectIds)
				}
				if(filterData?.createdBy){
					filterData.createdBy = JSON.stringify(filterData?.createdBy)
				}
				if(filterData?.assignedTo){
					filterData.assignedTo = JSON.stringify(filterData?.assignedTo)
				}
				if(filterData?.category){
					filterData.category = JSON.stringify(filterData?.category)
				}
				if(filterData?.priority){
					filterData.priority = JSON.stringify(filterData?.priority)
				}
				if(filterData?.status){
					filterData.status = JSON.stringify(filterData?.status)
				}
				data = filterData;
				data.groupBy = "default"
				console.log(data, "filter data")
			}
         const tasks = await getProjectsTask(data);
         setLoading(false);
         if (tasks.error) {
           setToasterMessage(tasks?.error?.message || "Something Went Wrong");
           setShowToaster(true);
         } else {
			let allTask = tasks?.data;
			allTask?.forEach((item, i)=>{
				item?.tasks?.map((task, j)=>{
					if(task?.dueDate){
						let dateMonth = task?.dueDate?.split('T')[0]
						let today = new Date();
						
						today = today.getFullYear() + '-' + (today.getMonth() + 1 <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate())
						if(dateMonth == today){
							task.dueToday = true;
						}else if(new Date().getTime() > new Date(task?.dueDate).getTime()){
							task.dueToday = true;
						}
					   else{
							task.dueToday = false;
						}
						if(task?.completedDate && new Date(task?.completedDate).getTime() > new Date(task?.dueDate).getTime() ){
							task.dueToday = true;
						}
						 if( task?.completedDate && dateMonth == task?.completedDate?.split('T')[0]){
							task.dueToday = false;
						}
					}
			})	
			allTask[i].tasks = item?.tasks
			
		})
			setProjects(allTask)
         }
       } catch (error) {
         setToasterMessage(error?.error?.message || "Something Went Wrong");
         setShowToaster(true);
         setLoading(false);
         return error.message;
       }
     };
    


 
const getNewTasks = (id)=>{
	closeModal();
	getTasksDataUsingProjectId();
}
const getTaskFilters = ()=>{
	getTasksDataUsingProjectId();
}
const closeModal=()=>{
	setShowAddTask(false);
	setSelectedProject();
	setSelectedTask();
}
  return (
	
    <div className="rightDashboard">
      <h1 className="h1-text" >
          <i  className="fa fa-list-ul" aria-hidden="true"></i>Task
      </h1>

            <button className="addTaskBtn"
              style={{
                float: "right" 
              }}  onClick={() => {
				setSelectedTask();
				setShowAddTask(true);
				setSelectedProject();
			  }}>
              Add Task
            </button>
            
		<FilterModal   getTaskFilters={getTaskFilters} />
        <AddTaskModal selectedProjectFromTask={selectedProject} selectedTask={selectedTask} getNewTasks={getNewTasks} showAddTask={showAddTask} closeModal={closeModal} />
        <Accordion  alwaysOpen="true">
        {projects.map((project, index) => (
      <Accordion.Item key={index} eventKey={index}>
      <Accordion.Header >  

       {project?._id?.projectId?.name} / {project?._id?.category}
      </Accordion.Header>
      <div className="d-flex rightTags">
        <ProgressBar >
          <ProgressBar  variant="success" now={100*(project?.completedTasks/project?.completedTasks)} key={1} />
          <ProgressBar variant="warning" now={100*(project?.ongoingTasks/project?.completedTasks)} key={2} />
		  <ProgressBar   variant="info" now={100*(project?.onHoldTasks/project?.completedTasks)} key={3} />
          <ProgressBar   variant="danger" now={100*(project?.noProgressTasks/project?.completedTasks)} key={3} />

        </ProgressBar>
        <div>
        <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
        <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => {
			setSelectedTask();
            setShowAddTask(true);
			setSelectedProject({_id: project?._id?.projectId?._id, category: project?._id?.category});
          }}>Add Task</Dropdown.Item>
		  
          {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
      
        </div>
        </div>
      <Accordion.Body  >
      
            <ul className="mb-0">
             {project?.tasks?.map((task)=>
       <li key={task?._id}>{task?.status === 'ONGOING' && <i className="fa fa-check-circle warning" aria-hidden="true"></i>}
	   {task?.status === 'NO_PROGRESS'  && <i className="fa fa-check-circle secondary" aria-hidden="true"></i>}
	   { task?.status === 'ONHOLD'  && <i className="fa fa-check-circle primary" aria-hidden="true"></i>}
	   {task?.status === 'COMPLETED' && <i className="fa fa-check-circle" aria-hidden="true"></i>} {task?.title} 
	  {task?.status === 'NO_PROGRESS' &&  <Badge  bg="secondary">NO PROGRESS</Badge>}
                        {task?.status === 'ONGOING' &&  <Badge  bg="warning">ONGOING</Badge>}
                        {task?.status === 'COMPLETED' &&  <Badge bg="success">completed {moment(task?.completedDate).format('MMM DD,YYYY')}</Badge>}
                        {task?.status === 'ONHOLD' &&  <Badge  bg="primary">ON HOLD</Badge>}
	  {/* {task?.priority === 'None' &&  <Badge  bg="secondary">None</Badge>} */}
	  {task?.priority === 'LOW' &&  <Badge  bg="primary">LOW</Badge>}
	  {task?.priority === 'REPEATED' &&  <Badge  bg="warning">REPEATED</Badge>}

                        {task?.priority === 'MEDIUM' &&  <Badge  bg="warning">MEDIUM</Badge>}
                        {task?.priority === 'HIGH' &&  <Badge  bg="danger">HIGH</Badge>}
       <span className="nameTag"> <img src={avtar} alt="userAvtar" /> {task?.assignedTo?.name}</span>
      {task?.dueDate && <Badge bg={ task?.dueToday ? "danger" : "primary"}>Due {moment(task?.dueDate).format('MMM DD,YYYY')}</Badge>}
	   <a style={{float: "right",
    color: "#8602ff", cursor:"pointer", marginRight: "10px"}} onClick={() => {
		setSelectedProject();
            setShowAddTask(true);
			setSelectedTask(task);
          }}>Edit</a>
      
       </li>
       )}
            </ul>
         
      </Accordion.Body>
    </Accordion.Item> 
      ))}
            
    </Accordion>
    {/* <div className="accordion">
      {projects.map((project) => (
        <div className="accordion-item" key={project._id}>
          <div
            className="accordion-header"
            onClick={() => handleClick(project)}
          >
            <Row>
              <Col sm={7}>
              <div>
               <i className="fa fa-angle-down" aria-hidden="true"></i> {project.name}              
              </div> 
              </Col>
              <Col sm={5}>
                <div className="d-flex">
                <ProgressBar>
                  <ProgressBar striped variant="success" now={35} key={1} />
                  <ProgressBar variant="warning" now={20} key={2} />
                  <ProgressBar striped variant="danger" now={10} key={3} />
                </ProgressBar>
                <div>
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                </div>
                </div>
              </Col>
               
            </Row>
                      
           
          </div>
          <div className="accordion-body">
            {taskData[project._id] && (
              <ul className="mb-0">
               {taskData[project._id].map((task)=>
			   <li><i className="fa fa-check-circle" aria-hidden="true"></i> {task?.title}</li>
 )} 
              </ul>
            )}
          </div>
        </div>
      ))}
      {loading && <Loader />}
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
    </div> */}
    </div>
  );
}

export default Tasks;



