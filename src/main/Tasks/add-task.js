import './tasks.css';
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';

export default function AddTask() {

  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [userList, setUserList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [statusList, setstatusList] = useState([]);
    const [taskListArray, setTaskListArray] = useState([]);
    const [attachment, setAtachment] = useState("");
    const [validated, setValidated] = useState(false);
    
  const onChangeOfSelectTaskList = (e) => {
    setTaskList(e.target.value);
  };
    
  const onChangeOfTitle = (e) => {
    setTitle(e.target.value);
  };
    
  const onChangeOfUserAssignedTo = (e) => {
    setAssignedTo(e.target.value);
  };
    
  const onchangeOfPriority = (e) => {
    setPriority(e.target.value);
  };

  const onchangeOfStatus= (e) => {
    setStatus(e.target.value);
  };
    
    
  const handleChangeDate = (date) => {
    setDueDate(date);
  };
    
    
    const handleSubmit = (e) => {
        setValidated(true);
        e.preventDefault();
        e.stopPropagation();
}


    return (
        <div className="dv-50">
               <Form noValidate validated={validated}>
              <Row className="mb-3">
                <Form.Group as={Col} md="6">
                  <Form.Label>Task List</Form.Label>
                        <Form.Control
                            required
                            as="select"
                    type="select"
                    onChange={onChangeOfSelectTaskList}
                    value={taskList}
                  >
                    <option value="">Select</option>
                    {taskListArray.map((module) => (
                      <option value={module._id} key={module._id}>
                        {module.name}
                      </option>
                    ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                    Task List is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                
                </Form.Group>
                </Row>
                
              <Row className="mb-3">
                <Form.Group as={Col} md="10">
                        <Form.Label>Task Title</Form.Label>
                        <Form.Control
                    required
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={onChangeOfTitle}
                  />

                  <Form.Control.Feedback type="invalid">
                    Title is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                
                </Form.Group>
                </Row>

                <Row className="mb-3">
                <FroalaEditorComponent tag='textarea'/>
                </Row>
                
                <Row className="mb-3">
                <Form.Group as={Col} md="3" >
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control
                    as="select"
                    type="select"
                    onChange={onChangeOfUserAssignedTo}
                    value={addignedTo}
                  >
                    <option value="">Select User</option>
                    {userList.map((module) => (
                      <option value={module._id} key={module._id}>
                        {module.name}
                      </option>
                    ))}
                  </Form.Control>
                 
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Due date"
                    onChange={handleChangeDate}
                  />
                 
                    </Form.Group>
                    
                    <Form.Group as={Col} md="3" >
                  <Form.Label>Priority</Form.Label>

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
                    
                    <Form.Group as={Col} md="2" >
                  <Form.Label>Status</Form.Label>

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
                </Row>

                <Row className="mb-3">
                        
                <Form.Group as={Col} md="2" >
                  <Form.Label>Attachment</Form.Label>
                  <input type="file" /> 
                  </Form.Group>

                </Row >

                <div style={{float:'right', marginRight:'150px'}}>

                <Button
                className="btn-gradient-border btnDanger"
                type="submit"
                onClick={handleSubmit}
              >
                Create
              </Button>
                <Button
                className="btn-gradient-border btnDanger"
                type="submit"
                onClick={handleSubmit}
              >
                Create And Add Another
              </Button>
                <Button
                className="btn-gradient-border btnDanger"
                type="submit"
                onClick={handleSubmit}
              >
                Cancel
                    </Button>
                    </div>
             
            </Form>

       
        </div>
      );
}
