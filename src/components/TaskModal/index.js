import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { MDBTooltip } from "mdb-react-ui-kit";
import { getIconClassForStatus } from "../../helpers/taskStatusIcon";

function TaskModal(props) {
  const { show, selectedTaskDetails, onHide, selectedProject, updateTaskDescription, addCommentOnTask, updateTaskTitle } = props;
  //   const [formDetails, setFormDetails] = useState({});
  //   const updateFormDetails = (e) => {
  //     setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  //   };




  const CommentsForm = () => {
    const [commentValue, setCommentValue] = useState('');
    console.log('render comments')
    return (
      <Row className="mb-3" >
        <Form.Group as={Col} md="8" >
          <Form.Label>Comment</Form.Label>
          <Form.Control
            // autoFocus
            // as="textarea"
            required
            type="text"
            placeholder="Comment"
            // value={commentValue}
            onChange={(e) => { setCommentValue(e.target.value) }}
          />
        </Form.Group>

        <Button className="btn btn-gradient-border" onClick={() => { addCommentOnTask(commentValue) }}>
          Add
        </Button>
      </Row >
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
            <input
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
              <span>{titleValue || <i>No Title</i>}</span>
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
              <input
                autoFocus
                type="text"
                value={descriptionValue}
                onChange={(e) => {
                  editTaskDescriptionValue(e);
                }}
              ></input>
            </div>
            <button
              onClick={() => {
                setDescriptionValue(selectedTaskDetails.description);
                setEditDescBoxEnable(false);
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                updateTaskDescription(descriptionValue);
                setEditDescBoxEnable(false);
                selectedTaskDetails.description = descriptionValue;
              }}
            >
              Save
            </button>
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
        <small>{selectedTaskDetails.category}</small><br></br>
        <MDBTooltip
          tag="span"
          wrapperProps={{ href: "#" }}
          title={selectedTaskDetails.status}
        >
          <i className={getIconClassForStatus(selectedTaskDetails.status)} aria-hidden="true"></i>
        </MDBTooltip>

        <EditTitleBox />

        <div>
          <p>
            Created By <b>{selectedTaskDetails?.createdBy?.name}</b> on{" "}
            <b>{selectedTaskDetails?.createdAt}</b>
          </p>
          <p>
            Assigned to <b>{selectedTaskDetails?.assignedTo?.name}</b>{" "}
          </p>

          <p>
            Due Date <b>{selectedTaskDetails?.dueDate || "Not set"}</b>
          </p>
          <p>
            Priority <b> {selectedTaskDetails?.priority || "Not set"}</b>
          </p>
          <p>
            Status <b> {selectedTaskDetails?.status || "Not set"} </b>
          </p>
          <p>
            Status
            <i className={getIconClassForStatus(selectedTaskDetails.status)} aria-hidden="true"></i>
            <b> {selectedTaskDetails?.status || "Not set"} </b>

            <b> {selectedTaskDetails?.completedDate || "Not set"} </b>
          </p>
          <EditDescriptionBox />


        </div>

        <div>
          <hr></hr>
          <b>Comments </b>
          <CommentsForm />


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
