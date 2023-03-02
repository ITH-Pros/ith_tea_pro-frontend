import { useEffect, useState } from "react";
import { Button, Row, Form, Modal, Col } from "react-bootstrap";
import { useLocalStorage } from "../../../auth/useLocalStorage";
import Loader from "../../../components/Loader";
import { CONSTENTS } from "../../../constents";
import "./filter.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const FilterModal = (props) => {
  const { selectedProject, setTaskFilters } = props;

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
  const [localStorageTaskFilters, setLocalStorageTaskFilters] =
    useLocalStorage("taskFilters");
  const [filterFormValue, setFilterFormValue] = useState(filterFormFileds);

  useEffect(() => {
    if (localStorageTaskFilters) {
      setFilterFormValue(localStorageTaskFilters);
    }
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
    setLocalStorageTaskFilters(filterFormValue);
    setTaskFilters(filterFormValue);
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
    setLocalStorageTaskFilters(filterFormFileds);
    setTaskFilters(filterFormFileds);
  };

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
        <div>
          {clearFilter && (
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
          {clearFilter && (
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
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Task Filter
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate>
              <Row>
                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9">
				  <Form.Label column sm="3">
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
                        <option value={user._id} key={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9">
				  <Form.Label column sm="3">
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
                        <option value={user._id} key={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9">
				  <Form.Label column sm="3">
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
                  <Row sm="9">
				  <Form.Label column sm="3">
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
                  <Row sm="9">
				  <Form.Label column sm="3">
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

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row sm="9">
				  <Form.Label column sm="3">
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
                </Form.Group>

                <Form.Group as={Row} controlId="formSelectProjectGroup">
                  <Row sm="9">
				  <Form.Label column sm="3">
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
                </Form.Group>

                <Form.Group as={Row} controlId="formSelectProject">
                  <Row sm="9">
				  <Form.Label column sm="3">
				  Project
					</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectProject}
                      onChange={(e) => setSelectProject(e.target.value)}
                    >
                      <option value="">Select Project</option>
                      <option value="project1">Project 1</option>
                      <option value="project2">Project 2</option>
                      <option value="project3">Project 3</option>
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formSortBy">
                  <Row sm="9">
				  <Form.Label column sm="3">
				  Sort By
					</Form.Label>
                    <Form.Control
                      as="select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="">Select Sort By</option>
                      <option value="sort1">Sort 1</option>
                      <option value="sort2">Sort 2</option>
                      <option value="sort3">Sort 3</option>
                    </Form.Control>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDueDate">
				<Form.Label column sm="3">
				  Due Date
					</Form.Label>
                  <Row sm="9">
				
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      className="form-control"
                      placeholderText="Select Due Date"
                    />
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
				<Form.Label column sm="3">
				  Date Created
					</Form.Label>
                  <Row sm="9">
				 
                    <DatePicker
                      selected={dateCreated}
                      onChange={(date) => setDateCreated(date)}
                      className="form-control"
                      placeholderText="Select Date Created"
                    />
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateUpdated">
				<Form.Label column sm="3">
				  Date Updated
					</Form.Label>
                  <Row sm="9">
				
                    <DatePicker
                      selected={dateUpdated}
                      onChange={(date) => setDateUpdated(date)}
                      className="form-control"
                      placeholderText="Select Date Updated"
                    />
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCompleted">
				<Form.Label column sm="3">
				  Date Completed
					</Form.Label>
                  <Row sm="9">
				
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
