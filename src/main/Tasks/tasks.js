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
  const [selectedProject, setSelectedProject] = useState('');
  const setShowToaster = (param) => showToaster(param);
    
  useEffect(() => {
      getAllProjectsData();
  }, []);
    
    const getAllProjectsData =async () => {
        
           setLoading(true);
           try {
             const lead = await getAllProjects();
             setLoading(false);

             if (lead.error) {
               setToasterMessage(
                 lead?.error?.message || "Something Went Wrong"
               );
               setShowToaster(true);
             } else {
                 setProjects(lead.data);
                 console.log(lead.data)
             }
           } catch (error) {
             setToasterMessage(error?.error?.message || "Something Went Wrong");
             setShowToaster(true);
             setLoading(false);
             return error.message;
           }

    }

  const [taskData, setTaskData] = useState({});


    
     const getTasksDataUsingProjectId = async (_id) => {
         setLoading(true);
         try {
             let data = {};
             data = {
                 groupBy:'projectId',
                  projectId: _id
             };
             console.log(data)
         const lead = await getProjectsTask(data);
         setLoading(false);

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
    

  const handleClick = (projectId) => {
    // If we already have task data for this project, don't fetch it again
    if (taskData[projectId]) {
      return;
    }

    getTasksDataUsingProjectId(projectId);
  };
  const setSelectedProjectFromAddTask = (project, filterFormValue) => {
	if (project._id === selectedProject._id) {
	  console.log("project._id === selectedProject._id", project._id === selectedProject._id)
	  setSelectedProject(project)
	//   getAllTaskOfProject();
	} else {
	  setSelectedProject(project)
	}
  }

  return (
    <div className="w-100 mr-3">
		<FilterModal  selectedProject={selectedProject} setTaskFilters={setTaskFilters} />
        <AddTaskModal selectedProjectFromTask={selectedProject}
          setSelectedProjectFromAddTask={setSelectedProjectFromAddTask}
        />
    <div className="accordion">
      {projects.map((project) => (
        <div className="accordion-item" key={project._id}>
          <div
            className="accordion-header"
            onClick={() => handleClick(project._id)}
          >
            {project.name}
          </div>
          <div className="accordion-body">
            {taskData[project._id] && (
              <ul>
                {taskData[project._id].map((task) => (
                  <li key={task._id}>{task.title}</li>
                ))}
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



