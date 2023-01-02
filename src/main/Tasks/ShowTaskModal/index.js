import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { MDBTooltip } from "mdb-react-ui-kit";
import { getIconClassForStatus } from "../../../helpers/taskStatusIcon";
import DatePicker from "react-date-picker";
import './index.css'
import { addCommentOnTaskById, getTaskDetailsByTaskId, updateTaskDetails } from "../../../services/user/api";
import Loader from "../../../loader/loader";

function TaskModal(props) {
  const { selectedTaskObj, selectedProject, getAllTaskOfProject } = props;


  const [loading, setLoading] = useState(false);
  const [taskModalShow, setTaskModalShow] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(selectedTaskObj);

  console.log("taskModalShow----------------------------------", taskModalShow)


  const CommentsForm = () => {
    const [commentValue, setCommentValue] = useState('');
    console.log('render comments')
    return (
      <>

        <Row className="mb-3 mt-6" >
          <Form.Group as={Col} md="12" className="mt-2" >
            {/* <Form.Label>Comment</Form.Label> */}
            <hr></hr>
            <Form.Control
              as="textarea"
              // required
              // type="text"
              placeholder="Comment"
              // value={commentValue}
              onChange={(e) => { setCommentValue(e.target.value) }}
            />
          </Form.Group>

          <Button className="btn btn-gradient-border" style={{ width: '100px', marginTop: '10px' }} onClick={() => { addCommentOnTask(commentValue) }}>
            Add
          </Button>
        </Row >
      </>

    )

  };

  const EditTitleBox = () => {
    const [titleValue, setTitleValue] = useState(selectedTaskDetails.title);
    const [editTitleBoxEnable, setEditTitleBoxEnable] = useState(false);

    const checkAndUpdateTitleValue = () => {
      if (!titleValue) {
        return
      }
      updateMutipleTaskDetails({ title: titleValue }, selectedTaskDetails);
      // setEditTitleBoxEnable(false);
    }

    return (
      <>
        {
          editTitleBoxEnable ?
            <input className="pop-title-input"
              autoFocus
              type="text"
              value={titleValue}
              onChange={(e) => { setTitleValue(e.target.value) }}
              // onMouseLeave={(e) => { console.log('-----------------------', e.target.value) }}
              onBlur={checkAndUpdateTitleValue}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  checkAndUpdateTitleValue()
                }
              }}
            ></input>
            :
            <>
              <span className="pop-title">{titleValue || <i>No Title</i>}</span>
              <i
                className="fa fa-pencil-square-o"
                style={{ cursor: "pointer", margin: '10px' }}
                aria-hidden="true"
                onClick={() => setEditTitleBoxEnable(true)}
              ></i>
            </>
        }
      </>
    )
  }

  const EditDescriptionBox = () => {
    const [editDescBoxEnable, setEditDescBoxEnable] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState(selectedTaskDetails.description || "");
    function showEditDescriptionBox() {
      setEditDescBoxEnable(true);
    }
    const editTaskDescriptionValue = (e) => {
      setDescriptionValue(e.target.value);
    };
    console.log("EditDescriptionBox---------------", descriptionValue, '\nselectedTaskDetails=----------', selectedTaskDetails)
    return (
      <>
        {editDescBoxEnable ?
          <>
            <div className="editDescBox">
              <input className="edit-box-input"
                autoFocus
                type="text"
                value={descriptionValue}
                onChange={(e) => {
                  editTaskDescriptionValue(e);
                }}
              ></input>
            </div>
            <div>
              <button className="btn btn-gradient-border" style={{ width: '100px', padding: '4px 23px' }}
                onClick={() => {
                  setDescriptionValue(selectedTaskDetails.description);
                  setEditDescBoxEnable(false);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-gradient-border" style={{ width: '100px', padding: '4px 23px' }}
                onClick={() => {
                  updateMutipleTaskDetails({ description: descriptionValue }, selectedTaskDetails);
                  setEditDescBoxEnable(false);
                }}
              >
                Save
              </button>
            </div>
          </>
          :
          <div className="descriptionBox">
            <span>{descriptionValue || <i>No description</i>}</span>
            <i
              className="fa fa-pencil-square-o"
              style={{ cursor: "pointer", float: "right" }}
              aria-hidden="true"
              onClick={showEditDescriptionBox}
            ></i>
          </div>
        }
      </>
    )
  }

  const UpdateCategoryBox = (props) => {

    const { selectedTaskDetails, selectedProject } = props

    const [categoryValue, setCategoryValue] = useState(selectedTaskDetails.category || '');
    const [editCategoryEnable, setEditCategoryEnable] = useState(false);
    console.log("selectedProject", selectedProject)

    const checkAndUpdateCategory = (e) => {
      if (e.target.value === categoryValue) {
        return
      }
      updateMutipleTaskDetails({ category: e.target.value }, selectedTaskDetails)
      // setEditCategoryEnable(false);
      // console.log()
    }
    return (
      < >
        {
          editCategoryEnable ?
            <Form.Group as={Col} md="12" >
              <Form.Control
                as="select"
                type="select"
                autoFocus
                onBlur={() => setEditCategoryEnable(false)}
                onChange={checkAndUpdateCategory}
                value={categoryValue}
              >
                <option value='' disabled >Select Category </option>
                {selectedProject?.categories?.map((category) => {
                  if (categoryValue === category) {
                    return (
                      <option value={category} key={category} disabled >
                        {category}
                      </option>
                    )
                  }
                  return (
                    <option value={category} key={category} >
                      {category}
                    </option>
                  )
                })
                }
              </Form.Control>
            </Form.Group>
            :
            <small style={{ cursor: 'pointer' }} className='pop-category' onClick={() => setEditCategoryEnable(true)}>{categoryValue}</small>
        }
      </>
    )
  }

  const UpdateAssignedToBox = () => {
    const [assignedToValue, setAssignedToValue] = useState(selectedTaskDetails.assignedTo || '');
    const [editAssignedToEnable, setEditAssignedToEnable] = useState(false);
    console.log("selectedProject", selectedProject)

    const checkAndUpdateAssignedTo = (e) => {
      console.dir(e.target)
      if (e.target.value === assignedToValue?._id) {
        return
      }
      updateMutipleTaskDetails({ assignedTo: e.target.value }, selectedTaskDetails)
      // let assignedToObj = selectedProject?.accessibleBy?.find((el) => el._id === e.target.value)
      // setAssignedToValue({ _id: e.target.value, name: assignedToObj.name })
      setEditAssignedToEnable(false);
      // selectedTaskDetails.assignedTo = { _id: e.target.value, name: assignedToObj.name }
    }
    return (
      <>
        <span className="pop-2-span">
          Assigned to
        </span>
        {
          editAssignedToEnable ?
            <Form.Group as={Col} md="12" >
              <Form.Control
                as="select"
                type="select"
                autoFocus
                onBlur={() => setEditAssignedToEnable(false)}
                onChange={checkAndUpdateAssignedTo}
                value={assignedToValue?._id || "Not Assigned"}

              >
                <option value='' disabled>Assign to </option>
                {selectedProject?.accessibleBy?.map((user) => {
                  if (assignedToValue?._id === user._id) {
                    return (
                      <option value={user._id} key={user._id} disabled >
                        {user.name}
                      </option>
                    )
                  }
                  return (
                    <option value={user._id} key={user._id}>
                      {user.name}
                    </option>
                  )
                })
                }
              </Form.Control>
            </Form.Group>
            :
            <>
              <b style={{ cursor: 'pointer' }} onClick={() => setEditAssignedToEnable(true)}>{assignedToValue?.name || "Not Assigned"}</b>
              <br></br>
            </>
        }
      </>
    )
  }

  const UpdatePriorityBox = () => {
    const [priorityValue, setPriorityValue] = useState(selectedTaskDetails.priority || '');
    const [editPriorityEnable, setEditPriorityEnable] = useState(false);
    console.log("selectedProject", priorityValue)

    const checkAndUpdatePriority = (e) => {
      console.log("updatePriority", e.target.value, priorityValue)
      if (e.target?.value === priorityValue) {
        return
      }
      // updateTaskPriority(e.target?.value)
      updateMutipleTaskDetails({ priority: e.target.value }, selectedTaskDetails)

      setEditPriorityEnable(false);
      // selectedTaskDetails.priority = e.target?.value
    }
    return (
      <>
        <span className="pop-2-span">
          Priority
        </span>
        {
          editPriorityEnable ?
            <Form.Group as={Col} md="12" >
              <Form.Control
                as="select"
                type="select"
                autoFocus
                onBlur={() => setEditPriorityEnable(false)}
                onChange={checkAndUpdatePriority}
                value={priorityValue}
              >
                <option value='' disabled >Set Priority </option>
                <option value='' disabled={priorityValue === ''}>None </option>
                <option value='LOW' disabled={priorityValue === 'LOW'}>Low </option>
                <option value='MEDIUM' disabled={priorityValue === 'MEDIUM'}>Medium </option>
                <option value='HIGH' disabled={priorityValue === 'HIGH'} >High </option>
                <option value='REPEATED' disabled={priorityValue === 'REPEATED'} >Repeated </option>

              </Form.Control>
            </Form.Group>
            :
            <>
              <b style={{ cursor: 'pointer' }} onClick={() => setEditPriorityEnable(true)}>{priorityValue ? priorityValue.at(0) + priorityValue.slice(1)?.toLowerCase() : "Not set"}</b>
              <br></br>
            </>
        }
      </>
    )
  }

  const UpdateStatusBox = () => {
    const [statusValue, setStatusValue] = useState(selectedTaskDetails.status || '');
    const [editStatusEnable, setEditStatusEnable] = useState(false);
    console.log("selectedProject", statusValue)

    const checkAndUpdateStatus = (e) => {
      console.log("updatePriority", e.target.value, statusValue)
      if (e.target?.value === statusValue) {
        return
      }
      if (e.target?.value === "COMPLETED") {
        updateTaskCompletedStatusAndDate({ status: e.target?.value, completedDate: new Date() })
        // selectedTaskDetails.status = e.target?.value
        // selectedTaskDetails.completedDate = new Date()
      } else {
        // updateTaskStatus(e.target?.value)
        updateMutipleTaskDetails({ status: e.target?.value, completedDate: new Date() }, selectedTaskDetails)

        setEditStatusEnable(false);
      }
      selectedTaskDetails.status = e.target?.value
    }
    return (
      <>
        <span className="pop-2-span">  Status</span>
        {
          editStatusEnable ?
            <Form.Group as={Col} md="12" >
              <Form.Control className="pop-class-select"
                as="select"
                type="select"
                autoFocus
                // clearAriaLabel
                onBlur={() => setEditStatusEnable(false)}
                onChange={checkAndUpdateStatus}
                value={statusValue}
              >
                <option value='' disabled >Set Status </option>
                <option value='NO_PROGRESS' disabled={statusValue === 'NO_PROGRESS'}>No Progress </option>
                <option value='ONGOING' disabled={statusValue === 'ONGOING'}>Ongoing </option>
                <option value='COMPLETED' disabled={statusValue === 'COMPLETED'} >Completed </option>
                <option value='ONHOLD' disabled={statusValue === 'ONHOLD'} >On Hold </option>

              </Form.Control>
            </Form.Group>
            :
            <>
              <span >
                <i style={{ cursor: 'pointer' }} onClick={() => setEditStatusEnable(true)} className={getIconClassForStatus(selectedTaskDetails.status)} aria-hidden="true"></i>
                <b style={{ cursor: 'pointer' }} onClick={() => setEditStatusEnable(true)}> {statusValue || "Not set"} </b>
              </span>
              {statusValue === 'COMPLETED' && <UpdateCompletedDateBox />}
            </>
        }
      </>
    )
  }

  const UpdateDueDateBox = () => {
    const [dueDateValue, setDueDateValue] = useState(selectedTaskDetails.dueDate ? new Date(selectedTaskDetails.dueDate) : new Date());
    const [editDueDateEnable, setEditDueDateEnable] = useState(false);
    console.log("selectedProject", dueDateValue)

    const checkAndUpdateDueDate = (e) => {
      if (!e || e?.toDateString() === dueDateValue?.toDateString()) {
        return
      }
      // updateTaskDueDate(e.toDateString())
      updateMutipleTaskDetails({ dueDate: e.toDateString() }, selectedTaskDetails)
      // setDueDateValue(e)
      setEditDueDateEnable(false);
      // selectedTaskDetails.dueDate = e
    }
    return (
      <>
        <span className="pop-2-span">
          Due Date
        </span>
        {
          editDueDateEnable ?
            <div className="taskDueDate">
              <span className="pop-2-span">
                Due Date

              </span>
              <DatePicker
                autoFocus
                format="dd-MM-y"
                // selected={dueDateValue}
                value={dueDateValue}
                // selected={dueDateValue}
                onCalendarClose={() => setEditDueDateEnable(false)}
                // onBlur={() => setEditDueDateEnable(false)}
                onChange={checkAndUpdateDueDate}
              >

              </DatePicker>
            </div>
            :
            <b style={{ cursor: 'pointer' }} onClick={() => setEditDueDateEnable(true)}>{dueDateValue.toDateString() || "Not set"}</b>
        }
      </>
    )
  }

  const UpdateCompletedDateBox = () => {
    const [completedDateValue, setDueDateValue] = useState(selectedTaskDetails.completedDate ? new Date(selectedTaskDetails.completedDate) : new Date());
    const [editCompletedDateEnable, setEditCompletedDateEnable] = useState(false);
    console.log("selectedProject", completedDateValue)

    const checkAndUpdateDueDate = (e) => {
      if (!e || e?.toDateString() === completedDateValue?.toDateString()) {
        return
      }
      // updateTaskCompletedDate(e.toDateString())
      updateMutipleTaskDetails({ completedDate: e.toDateString() }, selectedTaskDetails)

      // setDueDateValue(e)
      setEditCompletedDateEnable(false);
      // selectedTaskDetails.completedDate = e
    }
    return (
      <>
        {
          editCompletedDateEnable ?
            <div className="taskDueDate">
              <span className="pop-2-span">
                Completed Date

              </span>
              <DatePicker
                autoFocus
                format="dd-MM-y"
                // selected={completedDateValue}
                value={completedDateValue}
                // selected={completedDateValue}
                onCalendarClose={() => setEditCompletedDateEnable(false)}
                // onBlur={() => setEditCompletedDateEnable(false)}
                onChange={checkAndUpdateDueDate}
              >

              </DatePicker>
            </div>
            :
            <p  >
              <span className="pop-2-span">
                Completed Date

              </span>

              <b style={{ cursor: 'pointer' }} onClick={() => setEditCompletedDateEnable(true)}>{completedDateValue.toDateString() || "Not set"}</b>{" "}
            </p>
        }
      </>
    )
  }

  const CommentsListBox = () => {

    return (
      <>
        {selectedTaskDetails?.comments?.map((commentObj) => {
          return (
            <div
              key={commentObj?._id}
              style={{ borderBottom: "1px solid #b86bff", padding: "10px" }}
            >
              <b>{commentObj?.commentedBy?.name}</b>
              <small>
                {moment(commentObj?.createdAt).format(
                  "Do MMMM  YYYY, h:mm a"
                )}
              </small>{" "}
              <br />
              <p style={{ marginTop: "10px" }}> {commentObj?.comment}</p>
            </div>
          );
        })}
      </>
    )
  }

  const getProjectsTaskDetails = async (task) => {
    // setLoading(true)
    try {
      let dataToSend = {
        params: {
          taskId: task._id
        }
      }
      const taskRes = await getTaskDetailsByTaskId(dataToSend);
      // setLoading(false);
      if (taskRes.error) {
        // toast.error(taskRes.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        return
      } else {
        console.log("taskRes.data---", taskRes.data)
        setSelectedTaskDetails(taskRes.data)
        console.log("INNNNNNNNNNNNNNNNNNNNNNNNNNN taskModalShow-----------------------------", taskModalShow)
        !taskModalShow && setTaskModalShow(true)
        console.log("INNNNNNNNNNNNNNNNNNNNNNNNNNN taskModalShow-----------------------------", taskModalShow)

      }
    } catch (error) {
      // setLoading(false);
      return error.message;
    }
  }

  const updateMutipleTaskDetails = async (data, taskDetails) => {
    console.log("updateMutipleTaskDetails", data)
    // setLoading(true)
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
      // setLoading(false);
      if (taskRes.error) {
        // toast.error(taskRes.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        return
      } else {
        console.log("taskRes.data---", taskRes.data)
        console.log("0000000000000000000000000000000000000000000000000000000000000000000000000", taskModalShow)
        getAllTaskOfProject();
        console.log("11111111111111111111111111111111111111111111111111111111111111111111111", taskModalShow, selectedTaskDetails)
        getProjectsTaskDetails(selectedTaskDetails)
        console.log("222222222222222222222222222222222222222222222222222222222222222222222222", taskModalShow)

      }
    } catch (error) {
      // setLoading(false);
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
        getAllTaskOfProject()
        getProjectsTaskDetails(selectedTaskDetails)
      }
    } catch (error) {
      setLoading(false);
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


  return (
    <>
      <div className='taskCard' key={selectedTaskObj._id}
        onClick={() => { getProjectsTaskDetails(selectedTaskObj) }}
      >
        <MDBTooltip
          tag="span"
          wrapperProps={{ href: "#" }}
          title={selectedTaskObj.status || 'Not Set'}
        >
          <i style={{ marginRight: '20px' }} className={getIconClassForStatus(selectedTaskObj.status)} aria-hidden="true"></i>
        </MDBTooltip>

        {selectedTaskObj.title?.slice(0, 100) + '.......'}

        {getPriorityTag(selectedTaskObj)}
        {getDueDateTag(selectedTaskObj)}
        {getAssignedToTag(selectedTaskObj)}
        {getCompletedDateTag(selectedTaskObj)}

        <i style={{ marginLeft: '20px' }} className='fa fa-comments' aria-hidden="true"></i>{'  ' + selectedTaskObj.comments?.length}
      </div>


      <Modal
        show={taskModalShow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setTaskModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedProject.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateCategoryBox selectedTaskDetails={selectedTaskDetails} selectedProject={selectedProject} /><br />


          <MDBTooltip
            tag="span"
            wrapperProps={{ href: "#" }}
            title={selectedTaskDetails.status}
          >
            <i className={getIconClassForStatus(selectedTaskDetails.status)} aria-hidden="true"></i>
          </MDBTooltip>

          <EditTitleBox />
          <hr></hr>

          <div className="pop-2-div">
            <div>
              <p>
                <span className="pop-2-span">Created By</span>
                <b>{selectedTaskDetails?.createdBy?.name}</b> on{" "}
                <b>{selectedTaskDetails?.createdAt ? new Date(selectedTaskDetails?.createdAt).toDateString() : ''}</b>
              </p>
              <UpdateAssignedToBox />
              <UpdateDueDateBox />

            </div>
            <div>

              <UpdatePriorityBox />
              <UpdateStatusBox />
            </div>

          </div>

          <div>
            <hr></hr>
            <EditDescriptionBox />
            {/* <b>Comments </b> */}
            <CommentsForm />
            <CommentsListBox />

          </div>
        </Modal.Body>
        {/* <Modal.Footer>
        <button className="btn btn-gradient-border " onClick={onHide}>
          Close
        </button>
      </Modal.Footer> */}
      </Modal>

      {loading && <Loader />}
    </>

  );
}

export default TaskModal;
