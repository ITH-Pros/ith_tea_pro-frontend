import React, { useState, useEffect } from "react";
import './tasks.css';
import { getAllProjects, getProjectsTask } from "../../services/user/api";
import Loader from "../../components/Loader";
import Toaster from "../../components/Toaster";

const Tasks=()=> {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
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
             setTaskData({ [_id]: lead.data })
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
  return (
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
                  <li key={task._id}>{task.name}</li>
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
  );
}

export default Tasks;



