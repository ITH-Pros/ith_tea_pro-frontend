import { useEffect, useState } from "react";
import { Button, Container, Row, Form, Modal, Col } from "react-bootstrap";
import { useLocalStorage } from "../../../auth/useLocalStorage";
import Loader from "../../../components/Loader";
import { CONSTENTS } from "../../../constents";
import "./filter.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllProjects } from "../../../services/user/api";
const FilterModal = (props) => {
  const {  getTaskFilters } = props;

  const statusList = CONSTENTS.statusList;
  const priorityList = CONSTENTS.priorityList;
  const groupByList = CONSTENTS.TASK_GROUPS;
  const filterFormFileds = {
    createdBy: "",
    assignedTo: "",
    category: "",
    priority: "",
    status: "",
    groupBy: "",
	selectProject: ""
  };
  const [selectProjectGroup, setSelectProjectGroup] = useState("");
  const [clearFilter, setClearFilterBoolean] = useState(false);
  const [selectProject, setSelectProject] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [dateUpdated, setDateUpdated] = useState("");
  const [dateCompleted, setDateCompleted] = useState("");

  const [loading, setLoading] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);

  const [filterFormValue, setFilterFormValue] = useState(filterFormFileds);
  const [selectedProject, setSelectedProject] = useState();
  const [projects, setProjects] = useState([]);
  const [sortedByArr, setSortedByArr] = useState(CONSTENTS.SORTEDBY);

  useEffect(() => {
    if (localStorage.getItem('taskFilters')) {
      setFilterFormValue(JSON.parse(localStorage.getItem('taskFilters')));
	  setClearFilterBoolean(true);
    }
	getAllProjectsData();
  }, []);

  const updateFilterFormValue = (e) => {
    setFilterFormValue({ ...filterFormValue, [e.target.name]: e.target.value });
    console.log(filterFormValue);
  };
  const closeModalAndgetAllTaskOfProject = () => {
    setClearFilterBoolean(true);
    if (selectProjectGroup) {
      filterFormValue.selectProjectGroup = selectProjectGroup;
    }
    if (sortBy) {
      filterFormValue.sortBy = sortBy;
    }
    if (dueDate) {
      filterFormValue.dueDate = dueDate;
    }
    if (selectProject) {
      filterFormValue.selectProject = selectProject;
    }
    if (dateCreated) {
      filterFormValue.dateCreated = dateCreated;
    }
    if (dateUpdated) {
      filterFormValue.dateUpdated = dateUpdated;
    }
    if (dateCompleted) {
      filterFormValue.dateCompleted = dateCompleted;
    }

    console.log(
      filterFormValue,
      "---------------------------filter form value"
    );
    //TODO
	localStorage.setItem('taskFilters', JSON.stringify(filterFormValue))
    getTaskFilters();
	setFilterModalShow(false);
  };
  const clearFilterFormValue = () => {
    console.log("key pressed");
    setSelectProjectGroup("");
    setSelectProject("");
    setDateCompleted("");
    setDateCreated("");
    setDueDate("");
    setDateUpdated("");
    setSortBy("");  
	setFilterFormValue(filterFormFileds);
	localStorage.removeItem('taskFilters');
	setClearFilterBoolean(false);
	getTaskFilters();
  };
  const getAllProjectsData =async () => {
        
           setLoading(true);
		   
           try {
			
             const lead = await getAllProjects();
             setLoading(false);

             if (lead.error) {
               console.log(lead?.error)
             } else {
                 setProjects(lead.data);
             }
           } catch (error) {
             setLoading(false);
             return error.message;
           }

    }
	const onSelectProject = (e)=>{
		updateFilterFormValue(e);
		setSelectProject(e.target.value);
		let projectdata = projects?.filter((item)=> item?._id == e.target.value);
		setSelectedProject(projectdata[0]);
	}

  return (
    <>
      {/* <button className='btn btn-gradient-border btn-glow' onClick={() => setFilterModalShow(true)} style={{ float: "left" }} > Filter </button > */}
      {/* <Button
                className="btnDanger"
                type="button"
                onClick={clearFilterFormValue}
            >
                Clear Filter
            </Button> */}
            
      <div className="filter-main-tag">
        <div className="filterWth">
        <Container>
          <Row>
            <Col lg={8}>
            <div>
                <img
                  onClick={() => {
                    setFilterModalShow(true);
                  }}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "2px",
                    cursor: "pointer",
                  }}
                  src={require("../../../assests/img/filter.png")}
                  alt="filter"
                />
                <span
                  onClick={() => {
                    setFilterModalShow(true);
                  }}
                  className="filter-task-tag"
                >
                  Filter
                </span>
              </div>
            </Col>
            <Col lg={3}>
            <div className="text-right me-2">
                {clearFilter  && (
                  <img
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "2px",
                      cursor: "pointer",
                    }}
                    src={require("../../../assests/img/removeFilter.jpg")}
                    alt="filter"
                  />
                )}
                {clearFilter  && (
                  <span
                    onClick={() => {
                      clearFilterFormValue();
                      setClearFilterBoolean(false);
                    }}
                    className="filter-task-tag"
                  >
                    Clear Filter
                  </span>
                )}
              </div>
            </Col>
           
          </Row>
        </Container>
         
      </div>
        
     

        {/* <Button className="addTaskBtn" type="button">
          Add Task
        </Button> */}
      </div>
      {filterModalShow && (
        <Modal
          show={filterModalShow}
          onHide={() => setFilterModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          className="filterModal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Task Filter
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate>
              <Row>
			  <Form.Group as={Row} controlId="formSelectProject">
                  <Row sm="9" className="filterFields">
				  <Form.Label column sm="4">
				  Project
					</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="selectProject"
					  value={filterFormValue.selectProject}
                      onChange={(e) => onSelectProject(e)}
                    >
						  <option value="">Select Project </option>
                     {projects?.map((project)=><option value={project?._id} key={project?._id}>{project?.name}</option>) }
                     
                    </Form.Control>
                  </Row>
                </Form.Group>
                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9" className="filterFields">
                    <Form.Label column sm="4">
                    createdBy
                    </Form.Label>
                    <Form.Control className="form-control"
                      as="select"
                      type="select"
                      name="createdBy"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.createdBy}
                    >
                      <option value="">Created By</option>
                      {selectedProject?.accessibleBy?.map((user) => (
                        <option value={user._id} key={user._id+user.name}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9" className="filterFields">
				  <Form.Label column sm="4">
				  assignedTo
					</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="assignedTo"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.assignedTo}
                    >
                      <option value="">User Assigned</option>
                      {selectedProject?.accessibleBy?.map((user) => (
                        <option value={user._id} key={user._id+user.name}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9" className="filterFields">
				  <Form.Label column sm="4">
				  Category
					</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="category"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.category}
                    >
                      <option value="">Category</option>
                      {selectedProject?.categories?.map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9" className="filterFields">
				  <Form.Label column sm="4">
				  Priority
					</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="priority"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.priority}
                    >
                      <option value="">Priority</option>
                      {priorityList?.map((priority) => (
                        <option value={priority} key={priority}>
                          {priority}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9" className="filterFields">
				  <Form.Label column sm="4">
				  Status
					</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="status"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.status}
                    >
                      <option value="">Status</option>
                      {statusList?.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>

                {/* <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9" className="filterFields">
				  <Form.Label column sm="4">
				  Group By
					</Form.Label>
                    <Form.Control
                      as="select"
                      type="select"
                      name="groupBy"
                      onChange={updateFilterFormValue}
                      value={filterFormValue.groupBy}
                    >
                      <option value="">Group By</option>
                      {groupByList?.map((group) => (
                        <option value={group} key={group}>
                          {group}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group> */}

                {/* <Form.Group as={Row} controlId="formSelectProjectGroup">
                  <Row sm="9" className="filterFields">
				  <Form.Label column sm="4">
				  Project Group
					</Form.Label>
                    <Form.Control
                      as="select"
					  
                      value={selectProjectGroup}
                      onChange={(e) => setSelectProjectGroup(e.target.value)}
                    >
                      <option value="">Select Project Group</option>
                      <option value="projectGroup1">Project Group 1</option>
                      <option value="projectGroup2">Project Group 2</option>
                      <option value="projectGroup3">Project Group 3</option>
                    </Form.Control>
                  </Row>
                </Form.Group> */}

               

                <Form.Group as={Row} controlId="formSortBy">
                  <Row sm="9" className="filterFields">
                  <Form.Label column sm="4">
                  Sort By
                  </Form.Label>
                    <Form.Control
                      as="select"
					  type="select"
                      name="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="">Select Sort By</option>
					  {sortedByArr?.map((type) => (
                        <option value={type} key={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDueDate">
                <Row sm="9" className="filterFields">
                <Form.Label column sm="4">
                  Due Date
                  </Form.Label> 		
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      className="form-control"
                      placeholderText="Select Due Date"
                    />
                
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated" >

            
                  <Row sm="9" className="filterFields">
                  <Form.Label column sm="4">
                   Date Created
                   </Form.Label>
                    <DatePicker
                      selected={dateCreated}
                      onChange={(date) => setDateCreated(date)}
                      className="form-control"
                      placeholderText="Select Date Created"
                    />
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateUpdated">
             
                  <Row sm="9" className="filterFields">
                  <Form.Label column sm="4">
                    Date Updated
                    </Form.Label>
                    <DatePicker
                      selected={dateUpdated}
                      onChange={(date) => setDateUpdated(date)}
                      className="form-control"
                      placeholderText="Select Date Updated"
                    />
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCompleted">
               
                  <Row sm="9" className="filterFields">
                  <Form.Label column sm="4">
                  Date Completed
                  </Form.Label>
                    <DatePicker
                      selected={dateCompleted}
                      onChange={(date) => setDateCompleted(date)}
                      className="form-control"
                      placeholderText="Select Date Completed"
                    />
                  </Row>
                </Form.Group>

                {/* <Button as={Row} md="2" className="btnDanger" type="submit">
                  Clear Filter
                </Button> */}
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {/* <button
              className="btn btn-gradient-border"
              onClick={() => setFilterModalShow(false)}
            >
              Close
            </button> */}
            {/* <button
              className="btn btn-gradient-border"
              onClick={closeModalAndgetAllTaskOfProject}
            >
              Apply
            </button> */}
            <div>
              <img
                onClick={closeModalAndgetAllTaskOfProject}
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "2px",
                  cursor: "pointer",
                }}
                src={require("../../../assests/img/filter.png")}
                alt="filter"
              />
              <span
                onClick={closeModalAndgetAllTaskOfProject}
                className="filter-task-tag  apply-footer-tag"
              >
                Apply
              </span>
            </div>
          </Modal.Footer>
        </Modal>
      )}

      {loading && <Loader />}
    </>
  );
};

export default FilterModal;
