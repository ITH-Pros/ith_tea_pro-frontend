import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { MDBTooltip } from "mdb-react-ui-kit";
import { getIconClassForStatus } from "../../../helpers/taskStatusIcon";
import DatePicker from "react-date-picker";
import './index.css'

function TaskModal(props) {
  const { show, selectedTaskDetails, onHide, selectedProject, updateTaskDescription, addCommentOnTask, updateTaskTitle, updateTaskCategory, updateTaskAssignedTo, updateTaskDueDate, updateTaskPriority, updateTaskCompletedDate, updateTaskStatus, updateTaskCompletedStatusAndDate } = props;

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
            autoFocus
            as="textarea"
            // required
            // type="text"
            placeholder="Comment"
            // value={commentValue}
            onChange={(e) => { setCommentValue(e.target.value) }}
          />
        </Form.Group>

        <Button className="btn btn-gradient-border" style={{width: '100px', marginTop:'10px'}} onClick={() => { addCommentOnTask(commentValue) }}>
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
      updateTaskTitle(titleValue);
      setEditTitleBoxEnable(false);
      selectedTaskDetails.title = titleValue;
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
    const [descriptionValue, setDescriptionValue] = useState(selectedTaskDetails.description);
    function showEditDescriptionBox() {
      setEditDescBoxEnable(true);
    }
    const editTaskDescriptionValue = (e) => {
      setDescriptionValue(e.target.value);
    };
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
              <button className="btn btn-gradient-border" style={{width: '100px' , padding: '4px 23px'}}
                onClick={() => {
                  setDescriptionValue(selectedTaskDetails.description);
                  setEditDescBoxEnable(false);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-gradient-border" style={{width: '100px',padding: '4px 23px'}}
                onClick={() => {
                  updateTaskDescription(descriptionValue);
                  setEditDescBoxEnable(false);
                  selectedTaskDetails.description = descriptionValue;
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

  const UpdateCategoryBox = () => {
    const [categoryValue, setCategoryValue] = useState(selectedTaskDetails.category);
    const [editCategoryEnable, setEditCategoryEnable] = useState(false);
    console.log("selectedProject", selectedProject)

    const checkAndUpdateCategory = (e) => {
      if (e.target.value === categoryValue) {
        return
      }
      updateTaskCategory(e.target.value)
      setCategoryValue(e.target.value)
      setEditCategoryEnable(false);
      selectedTaskDetails.category = e.target.value;
    }
    return (
      < >
        {
          editCategoryEnable ?
            <Form.Group as={Col} md="3" >
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
    const [assignedToValue, setAssignedToValue] = useState(selectedTaskDetails.assignedTo);
    const [editAssignedToEnable, setEditAssignedToEnable] = useState(false);
    console.log("selectedProject", selectedProject)

    const checkAndUpdateAssignedTo = (e) => {
      console.dir(e.target)
      if (e.target.value === assignedToValue._id) {
        return
      }
      updateTaskAssignedTo(e.target.value)
      let assignedToObj = selectedProject?.accessibleBy?.find((el) => el._id === e.target.value)
      setAssignedToValue({ _id: e.target.value, name: assignedToObj.name })
      setEditAssignedToEnable(false);
      selectedTaskDetails.assignedTo = { _id: e.target.value, name: assignedToObj.name }
    }
    return (
      <>
        {
          editAssignedToEnable ?
            <Form.Group as={Col} md="3" >
              <Form.Control
                as="select"
                type="select"
                autoFocus
                onBlur={() => setEditAssignedToEnable(false)}
                onChange={checkAndUpdateAssignedTo}
                value={assignedToValue._id}

              >
                <option value='' disabled>Assign to </option>
                {selectedProject?.accessibleBy?.map((user) => {
                  if (assignedToValue._id === user._id) {
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
            <p style={{ cursor: 'pointer' }} onClick={() => setEditAssignedToEnable(true)} >
              <span className="pop-2-span">

                Assigned to
              </span>
              <b>{assignedToValue.name}</b>{" "}
            </p>
        }
      </>
    )
  }

  const UpdatePriorityBox = () => {
    const [priorityValue, setPriorityValue] = useState(selectedTaskDetails.priority);
    const [editPriorityEnable, setEditPriorityEnable] = useState(false);
    console.log("selectedProject", priorityValue)

    const checkAndUpdatePriority = (e) => {
      console.log("updatePriority", e.target.value, priorityValue)
      if (e.target?.value === priorityValue) {
        return
      }
      updateTaskPriority(e.target?.value)
      setEditPriorityEnable(false);
      selectedTaskDetails.priority = e.target?.value
    }
    return (
      <>
        {
          editPriorityEnable ?
            <Form.Group as={Col} md="3" >
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
            <p style={{ cursor: 'pointer' }} onClick={() => setEditPriorityEnable(true)} >
              <span className="pop-2-span">
                Priority

              </span>
              <b>{priorityValue ? priorityValue.at(0) + priorityValue.slice(1)?.toLowerCase() : "Not set"}</b>{" "}
            </p>
        }
      </>
    )
  }

  const UpdateStatusBox = () => {
    const [statusValue, setStatusValue] = useState(selectedTaskDetails.status);
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
        updateTaskStatus(e.target?.value)
        setEditStatusEnable(false);
      }
      selectedTaskDetails.status = e.target?.value
    }
    return (
      <>
        {
          editStatusEnable ?
            <Form.Group as={Col} md="3" >
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
              <div style={{ cursor: 'pointer' }} onClick={() => setEditStatusEnable(true)} >
                <p>

                  <span className="pop-2-span">  Status</span>
                  <i className={getIconClassForStatus(selectedTaskDetails.status)} aria-hidden="true"></i>
                  <b> {statusValue || "Not set"} </b>
                </p>
              </div>
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
      updateTaskDueDate(e.toDateString())
      setDueDateValue(e)
      setEditDueDateEnable(false);
      selectedTaskDetails.dueDate = e
    }
    return (
      <>
        {
          editDueDateEnable ?
            <div className="taskDueDate">
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
            <p style={{ cursor: 'pointer' }} onClick={() => setEditDueDateEnable(true)} >

              <span className="pop-2-span">
                Due Date

              </span>
              <b>{dueDateValue.toDateString() || "Not set"}</b>{" "}
            </p>
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
      updateTaskCompletedDate(e.toDateString())
      setDueDateValue(e)
      setEditCompletedDateEnable(false);
      selectedTaskDetails.completedDate = e
    }
    return (
      <>
        {
          editCompletedDateEnable ?
            <div className="taskDueDate">
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
            <p style={{ cursor: 'pointer' }} onClick={() => setEditCompletedDateEnable(true)} >
              <span className="pop-2-span">
                Completed Date

              </span>

              <b>{completedDateValue.toDateString() || "Not set"}</b>{" "}
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


  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {selectedProject.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>


        <UpdateCategoryBox /><br />


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
  );
}

export default TaskModal;
