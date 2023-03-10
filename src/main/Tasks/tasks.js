import React, { useState, useEffect } from "react";
import './tasks.css';
import { getAllProjects, getProjectsTask } from "../../services/user/api";
import Loader from "../../components/Loader";
import Toaster from "../../components/Toaster";
import FilterModal from "./FilterModal";
import AddTaskModal from "./AddTaskModal";
import TaskModal from "./ShowTaskModal";

const Tasks=()=> {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [taskFilters, setTaskFilters] = useState({});
  const [selectedProject, setSelectedProject] = useState({});
  const [taskData, setTaskData] = useState({});

  const setShowToaster = (param) => showToaster(param);
    
  useEffect(() => {
      getAllProjectsData();
  }, []);
    
    const getAllProjectsData =async (data) => {
        
           setLoading(true);
		   
           try {
             const lead = await getAllProjects(data);
             setLoading(false);

             if (lead.error) {
               setToasterMessage(
                 lead?.error?.message || "Something Went Wrong"
               );
               setShowToaster(true);
             } else {
                 setProjects(lead.data);
				 setSelectedProject(lead?.data[0]);
             }
           } catch (error) {
             setToasterMessage(error?.error?.message || "Something Went Wrong");
             setShowToaster(true);
             setLoading(false);
             return error.message;
           }

    }



    
     const getTasksDataUsingProjectId = async (_id, filterData) => {
         setLoading(true);
         try {
             let data = {};
             data = {
                 groupBy:'projectId',
                  projectId: _id
             };
            
         const lead = await getProjectsTask(data);
         setLoading(false);
console.log(data)
         if (lead.error) {
           setToasterMessage(lead?.error?.message || "Something Went Wrong");
           setShowToaster(true);
         } else {
             setTaskData({ [_id]: lead.data[0]?.tasks })
         }
       } catch (error) {
         setToasterMessage(error?.error?.message || "Something Went Wrong");
         setShowToaster(true);
         setLoading(false);
         return error.message;
       }
     };
    

  const handleClick = (project) => {
    // If we already have task data for this project, don't fetch it again
    if (taskData[project?._id]) {
      return;
    }
	// if(selectedProject?._id == project?._id){

	// }
	console.log(selectedProject)
	setSelectedProject(project)
    getTasksDataUsingProjectId(project?._id);
  };
 
const getNewTasks = (id)=>{
	getTasksDataUsingProjectId(id);
}
const getTaskFilters = (data)=>{
	getAllProjectsData( data)
}
  return (
    <div className="w-100 mr-3">
      <h1 className="h1-text">
          <i className="fa fa-list-ul" aria-hidden="true"></i>Task
      </h1>
		<FilterModal  selectedProject={selectedProject} getTaskFilters={getTaskFilters} />
        <AddTaskModal selectedProjectFromTask={selectedProject} getNewTasks={getNewTasks} />
    <div className="accordion">
      {projects.map((project) => (
        <div className="accordion-item" key={project._id}>
          <div
            className="accordion-header"
            onClick={() => handleClick(project)}
          >
            <i className="fa fa-angle-down" aria-hidden="true"></i> {project.name}
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
    </div>
    </div>
  );
}

export default Tasks;



