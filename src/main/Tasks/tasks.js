import React from 'react';
import './tasks.css';
import Modal from 'react-bootstrap/Modal'
import Accordion from 'react-bootstrap/Accordion';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default function Tasks() {
  const [modalShow, setModalShow] = React.useState(false);
  const [userAssigned, setUserAssigned] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [stream, setStream] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [priority, setPriority] = useState("");
  const [userList, setUserList] = useState([]);
  const [priorityList, setpriorityList] = useState([]);
  const [streamList, setstreamList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [project, setProjects] = useState("");

  const onchangeOfProjects = (e) => {
    setProjects(e.target.value);
  };

  const onChangeOfUserAssigned = (e) => {
    setUserAssigned(e.target.value);
  };

  const onChangeOfCreatedBy = (e) => {
    setCreatedBy(e.target.value);
  };

  const onChangeOfStream = (e) => {
    setStream(e.target.value);
  };

  const onchangeOfPriority = (e) => {
    setPriority(e.target.value);
  };

  const onchangeOfStatus= (e) => {
    setStatus(e.target.value);
  };
  const onchangeOfStartDate= (e) => {
    setStartDate(e.target.value);
  };
  const onchangeOfEndDate= (e) => {
    setEndDate(e.target.value);
  };
  
  const onchangeOfSearchText= (e) => {
    setSearchText(e.target.value);
  };

  const handleFormReset = (e) => {
    e.preventDefault();

    console.log('filter reseted succesfully')
    
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('filter form searched  succesfully')
    
  }

  function FilterModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Task Filter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form noValidate >
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" >
                    <Form.Control
                      as="select"
                      type="select"
                      onChange={onChangeOfCreatedBy}
                      value={createdBy}
                    >
                      <option value="">Created By</option>
                      {userList.map((module) => (
                        <option value={module._id} key={module._id}>
                          {module.name}
                        </option>
                      ))}
                    </Form.Control>
                  
                  </Form.Group>
                  <Form.Group as={Col} md="3" >
                    <Form.Control
                      as="select"
                      type="select"
                      onChange={onChangeOfUserAssigned}
                      value={userAssigned}
                    >
                      <option value="">User Assigned</option>
                      {userList.map((module) => (
                        <option value={module._id} key={module._id}>
                          {module.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3" >
                    <Form.Control
                      as="select"
                      type="select"
                      onChange={onChangeOfStream}
                      value={stream}
                    >
                      <option value="">Select Stream</option>
                      {streamList.map((module) => (
                        <option value={module._id} key={module._id}>
                          {module.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} md="3" >
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
            </Row>
            
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" >
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
              <Form.Group as={Col} md="3" >
              {/* <Form.Label>Start Date</Form.Label> */}
                
                  <Form.Control
                    type="date"
                    placeholder="Start Date"
                    onChange={onchangeOfStartDate}
                  />
                 
                </Form.Group>
              <Form.Group as={Col} md="3" >
              {/* <Form.Label>End Date</Form.Label> */}
                
                    <Form.Control
                    type="date"
                    placeholder="End Date"
                    onChange={onchangeOfEndDate}
                  />
                  </Form.Group>
                  <Form.Group as={Col} md="3" >
                    <Form.Control
                    type="text"
                    placeholder="Search Text"
                    value={searchText}
                    onChange={onchangeOfSearchText}
                  />
                     
                  </Form.Group>
            </Row>
            
                <Button
                className="btnDanger"
                type="submit"
                onClick={handleSubmit}
              >
                Search
              </Button>
                <Button
                className="btn-gradient-border btnDanger"
                type="submit"
                onClick={handleFormReset}
              >
                Clear Filter
              </Button>
             
              </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-gradient-border ' onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }


  return (
    <>
      <div className='tasks'>
        <div >

          <button className='btn btn-gradient-border btn-glow' onClick={() => setModalShow(true)} style={{ float: "left" }}>Filter </button>
          
          <Link to="/task/add" >
            {( <button className='btn btn-gradient-border btn-glow'  style={{ float: "right" }}><span>Add Task</span></button>)}
          </Link>
                    {/* <button className='btn btn-gradient-border btn-glow' variant="primary" style={{ float: "right" }}>Add Tasks</button> */}
        <Form noValidate >
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" >
                    <Form.Control
                      as="select"
                  type="select"
                  className="project-filter"
                      onChange={onchangeOfProjects}
                      value={project}
                    >
                      <option value="">Select project</option>
                      {projectList.map((module) => (
                        <option value={module._id} key={module._id}>
                          {module.name}
                        </option>
                      ))}
                    </Form.Control>
                  
            </Form.Group>
          </Row>
          </Form>
        </div>
        
        {/* <button className='clrfltr btn btn-gradient-border btn-glow' >Clear Filter</button> */}
      </div>

      <FilterModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
      />

      <div className='mt-5'>
        <Accordion defaultActiveKey="0" className='mt-5'>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Cex MM / Addhock  #1</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Cex MM / FrontEnd  #2</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </div>


    </>
  )


};





