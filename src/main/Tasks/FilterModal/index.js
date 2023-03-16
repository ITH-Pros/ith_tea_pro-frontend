import { useEffect, useState } from "react";
import { Button, Container, Row, Form, Modal, Col } from "react-bootstrap";
import { useLocalStorage } from "../../../auth/useLocalStorage";
import Loader from "../../../components/Loader";
import { CONSTENTS } from "../../../constents";
import "./filter.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllCategories,
  getAllProjects,
  getAllUsersWithoutPagination,
} from "../../../services/user/api";
import Select from "react-select";

const FilterModal = (props) => {
  const { getTaskFilters , handleProjectId } = props;
  console.log ("handleProjectId", handleProjectId)

  const statusList = CONSTENTS.statusListObj;
  const priorityList = CONSTENTS.priorityListObj;
  const groupByList = CONSTENTS.TASK_GROUPS;
  const filterFormFileds = {
    createdBy: "",
    assignedTo: "",
    category: "",
    priority: "",
    status: "",
    groupBy: "",
    projectIds:  "",
  };
  const [selectProjectGroup, setSelectProjectGroup] = useState("");
  const [clearFilter, setClearFilterBoolean] = useState(false);
  const [projectIds, setProjectIds] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [createdBy, setCreatedBy] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [sortBy, setSortBy] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [dateUpdated, setDateUpdated] = useState("");
  const [dateCompleted, setDateCompleted] = useState("");

  const [loading, setLoading] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);

  const [filterFormValue, setFilterFormValue] = useState(filterFormFileds);
  const [selectedFilterData, setSelectedFilterData] = useState();

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [sortedByArr, setSortedByArr] = useState(CONSTENTS.SORTEDBY);

  useEffect(() => {
    getAllProjectsData();
    getAllCategoriesData();
    getAllUsersData();
    if (localStorage.getItem("taskFilters")) {
      setFilterFormValue(JSON.parse(localStorage.getItem("taskFilters")));
      let projectData = projects.filter((item) =>
        filterFormValue?.projectIds?.includes(item?._id)
      );
      let assignedToData = usersList.filter((item) =>
        filterFormValue?.assignedTo?.includes(item?._id)
      );
      let createdByData = usersList.filter((item) =>
        filterFormValue?.createdBy?.includes(item?._id)
      );
      let selectedCategory = categories.filter((item) =>
        filterFormValue?.category?.includes(item?._id)
      );
      let selectedStatus = statusList.filter((item) =>
        filterFormValue?.status?.includes(item?._id)
      );
      let selectedPriority = priorityList.filter((item) =>
        filterFormValue?.priority?.includes(item?._id)
      );
      setProjectIds(projectData);
      setAssignedTo(assignedToData);
      setCategoryData(selectedCategory);
      setCreatedBy(createdByData);
      setPriorityData(selectedPriority);
      setStatusData(selectedStatus);
      setSelectedFilterData({
        projectIds: projectData,
        assignedTo: assignedToData,
        createdBy: filterFormValue?.category,
        category: createdByData,
        priority: filterFormValue?.priority,
        status: filterFormValue?.status,
      });
      setClearFilterBoolean(true);
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
    if (dateCreated) {
      filterFormValue.dateCreated = dateCreated;
    }
    if (dateUpdated) {
      filterFormValue.dateUpdated = dateUpdated;
    }
    if (dateCompleted) {
      filterFormValue.dateCompleted = dateCompleted;
    }

    localStorage.setItem("taskFilters", JSON.stringify(filterFormValue));
    getTaskFilters();
    setFilterModalShow(false);
  };
  const clearFilterFormValue = () => {
    setSelectProjectGroup("");
    setProjectIds("");
    setAssignedTo("");
    setCreatedBy("");
    setCategoryData("");
    setPriorityData("");
    setStatusData("");
    setDateCompleted("");
    setDateCreated("");
    setDueDate("");
    setDateUpdated("");
    setSortBy("");
    setFilterFormValue(filterFormFileds);
    localStorage.removeItem("taskFilters");
    setClearFilterBoolean(false);
    getTaskFilters();
  };
  const getAllProjectsData = async () => {
    setLoading(true);

    try {
      const lead = await getAllProjects();
      setLoading(false);

      if (lead.error) {
        console.log(lead?.error);
      } else {
        setProjects(lead.data);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };
  const getAllCategoriesData = async () => {
    setLoading(true);

    try {
      const categories = await getAllCategories();
      setLoading(false);

      if (categories.error) {
        console.log(categories?.error);
      } else {
        categories.data = categories?.data?.map((item, i) => ({
          name: item,
          _id: item,
        }));
        setCategories(categories.data);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };
  const getAllUsersData = async () => {
    setLoading(true);

    try {
      const users = await getAllUsersWithoutPagination();
      setLoading(false);

      if (users.error) {
        console.log(users?.error);
      } else {
        setUsersList(users.data?.users);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };
  const onSelectData = (selectedItems, dataType) => {
    let data = selectedItems?.map((item) => item?._id);
    if (dataType == "projectIds") {
      setProjectIds(selectedItems);
    } else if (dataType == "assignedTo") {
      setAssignedTo(selectedItems);
    } else if (dataType == "createdBy") {
      setCreatedBy(selectedItems);
    } else if (dataType == "priority") {
      setPriorityData(selectedItems);
    } else if (dataType == "status") {
      setStatusData(selectedItems);
    } else if (dataType == "category") {
      setCategoryData(selectedItems);
    }
    setFilterFormValue({ ...filterFormValue, [dataType]: data });
  };

  return (
    <>
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
              </Col>
            </Row>
          </Container>
        </div>
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
                  <Row>
                    <Col sm="3">
                      <Form.Label>Project</Form.Label>
                    </Col>
                    <Col sm="9" className="filterFields">
                      <Select
                        onChange={(e) => onSelectData(e, "projectIds")}
                        value={projectIds}
                        isMulti
                        getOptionLabel={(options) => options["name"]}
                        getOptionValue={(options) => options["_id"]}
                        options={projects}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group as={Row} controlId="formDateCreated">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>createdBy</Form.Label>
                    </Col>
                    <Col sm="9">
                      <Select
                        onChange={(e) => onSelectData(e, "createdBy")}
                        value={createdBy}
                        isMulti
                        getOptionLabel={(options) => options["name"]}
                        getOptionValue={(options) => options["_id"]}
                        options={usersList}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label >
                      assignedTo
                    </Form.Label>
</Col>
<Col sm="9">
                    <Select
                      onChange={(e) => onSelectData(e, "assignedTo")}
                      value={assignedTo}
                      isMulti
                      getOptionLabel={(options) => options["name"]}
                      getOptionValue={(options) => options["_id"]}
                      options={usersList}
                    />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label >
                      Category
                    </Form.Label>
                    </Col>
                    {/* <Form.Control
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
                    </Form.Control> */}
                     <Col sm="9">
                    <Select
                      onChange={(e) => onSelectData(e, "category")}
                      value={categoryData}
                      isMulti
                      getOptionLabel={(options) => options["name"]}
                      getOptionValue={(options) => options["_id"]}
                      options={categories}
                    />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label column sm="4">
                      Priority
                    </Form.Label>
                    </Col>
                    {/* <Form.Control
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
                    </Form.Control> */}
                    <Col sm="9">
                    <Select
                      onChange={(e) => onSelectData(e, "priority")}
                      value={priorityData}
                      isMulti
                      getOptionLabel={(options) => options["name"]}
                      getOptionValue={(options) => options["_id"]}
                      options={priorityList}
                    />
                    </Col>
                  </Row>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Row} controlId="formDateCreated">
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label>
                      Status
                    </Form.Label>
                    </Col>
                    {/* <Form.Control
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
                    </Form.Control> */}
                    <Col sm="9">
                    <Select
                      onChange={(e) => onSelectData(e, "status")}
                      value={statusData}
                      isMulti
                      getOptionLabel={(options) => options["name"]}
                      getOptionValue={(options) => options["_id"]}
                      options={statusList}
                    />
                    </Col>
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
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label >
                      Sort By
                    </Form.Label>
                    </Col>
                    <Col sm="9">
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
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDueDate">
                  <Row className="filterFields">
                  <Col sm="3">
                    <Form.Label >
                      Due Date
                    </Form.Label>
                    </Col>
                    <Col sm="9">
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      className="form-control"
                      placeholderText="Select Due Date"
                    />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCreated">
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label >
                      Date Created
                    </Form.Label>
                    </Col>
                    <Col sm="9">
                    <DatePicker
                      selected={dateCreated}
                      onChange={(date) => setDateCreated(date)}
                      className="form-control"
                      placeholderText="Select Date Created"
                    />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateUpdated">
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label >
                      Date Updated
                    </Form.Label>
                    </Col>
                    <Col sm="9">
                    <DatePicker
                      selected={dateUpdated}
                      onChange={(date) => setDateUpdated(date)}
                      className="form-control"
                      placeholderText="Select Date Updated"
                    />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} controlId="formDateCompleted">
                  <Row  className="filterFields">
                  <Col sm="3">
                    <Form.Label >
                      Date Completed
                    </Form.Label>
                    </Col>
                    <Col sm="9">
                    <DatePicker
                      selected={dateCompleted}
                      onChange={(date) => setDateCompleted(date)}
                      className="form-control"
                      placeholderText="Select Date Completed"
                    />
                    </Col>
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
