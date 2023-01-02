


// const TaskListComponent = (props) => {
//     return (
//       <div className='mt-5'>
//         {
//           projectTasks?.map((category) => {
//             console.log(category)
//             return (
//               <Accordion id="dialog-window" key={category._id} defaultActiveKey="1" className='mt-3 neo-box'>
//                 <Accordion.Item eventKey="0">
//                   <Accordion.Header>{category._id}</Accordion.Header>
//                   <Accordion.Body id="scrollable-content" className="accorback-neo">
//                     {
//                       category.tasks?.map((task) => {
//                         console.log(task)
//                         return (
//                           <div className='taskCard' key={task._id}
//                             onClick={() => { getProjectsTaskDetails(task) }}
//                           >
//                             <MDBTooltip
//                               tag="span"
//                               wrapperProps={{ href: "#" }}
//                               title={task.status || 'Not Set'}
//                             >
//                               <i style={{ marginRight: '20px' }} className={getIconClassForStatus(task.status)} aria-hidden="true"></i>
//                             </MDBTooltip>

//                             {task.title?.slice(0, 100) + '.......'}

//                             {getPriorityTag(task)}
//                             {getDueDateTag(task)}
//                             {getAssignedToTag(task)}
//                             {getCompletedDateTag(task)}

//                             <i style={{ marginLeft: '20px' }} className='fa fa-comments' aria-hidden="true"></i>{'  ' + task.comments?.length}
//                           </div>
//                         )
//                       })
//                     }
//                   </Accordion.Body>
//                 </Accordion.Item>
//               </Accordion>

//             )
//           })
//         }
//       </div>
//     )
//   }