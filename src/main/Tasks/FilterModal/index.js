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
import { useAuth } from "../../../auth/AuthProvider";

const FilterModal = (props) => {
  const { getTaskFilters, handleProjectId } = props;
  const { userDetails } = useAuth();

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
    projectIds: "",
  };
  const [selectProjectGroup, setSelectProjectGroup] = useState("");
  const [clearFilter, setClearFilterBoolean] = useState(false);
  const [projectIds, setProjectIds] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [createdBy, setCreatedBy] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  //   con

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

  //   console.log("handleProjectId handleProjectId handleProjectId",handleProjectId);
  //         if (handleProjectId) {
  //           let projectData = projects?.data?.find((item) => handleProjectId == item?._id);
  //           setProjectIds(projectData);
  //         }
  useEffect(() => {
    getAllProjectsData();
    getAllCategoriesData();
    getAllUsersData();
    updateFromLocalStorage();
  }, []);

  const updateFromLocalStorage = () => {
    console.log("filterFormValueFromLocal\n\n\nn\n\n");
    if (localStorage.getItem("taskFilters")) {
      let filterFormValueFromLocal = JSON.parse(
        localStorage.getItem("taskFilters")
      );
      console.log(
        "filterFormValueFromLocal\n\n\nn\n\n",
        filterFormValueFromLocal,
        usersList
      );
      //   setFilterFormValue(JSON.parse(localStorage.getItem("taskFilters")));
      let projectData = projects.filter((item) =>
        filterFormValueFromLocal?.projectIds?.includes(item?._id)
      );

      let assignedToData = usersList.filter((item) =>
        filterFormValueFromLocal?.assignedTo?.includes(item?._id)
      );
      let createdByData = usersList.filter((item) =>
        filterFormValueFromLocal?.createdBy?.includes(item?._id)
      );
      let selectedCategory = categories.filter((item) =>
        filterFormValueFromLocal?.category?.includes(item?._id)
      );
      let selectedStatus = statusList.filter((item) =>
        filterFormValueFromLocal?.status?.includes(item?._id)
      );
      let selectedPriority = priorityList.filter((item) =>
        filterFormValueFromLocal?.priority?.includes(item?._id)
      );
      console.log("assignedToData", assignedToData);
      setProjectIds(projectData);
      setAssignedTo(assignedToData);
      setCategoryData(selectedCategory);
      setCreatedBy(createdByData);
      setPriorityData(selectedPriority);
      setStatusData(selectedStatus);
      setSelectedFilterData({
        projectIds: projectData,
        assignedTo: assignedToData,
        createdBy: filterFormValueFromLocal?.category,
        category: createdByData,
        priority: filterFormValue?.priority,
        status: filterFormValue?.status,
      });
      setClearFilterBoolean(true);
    }
  };

  const updateFilterFormValue = (e) => {
    setFilterFormValue({ ...filterFormValue, [e.target.name]: e.target.value });
    console.log(filterFormValue);
  };
  const closeModalAndgetAllTaskOfProject = () => {
    updateFromLocalStorage();
    setClearFilterBoolean(true);
    // let filterFormValue = {};
    // if (selectProjectGroup) {
    //   filterFormValue.selectProjectGroup = selectProjectGroup;
    // }
    // if (sortBy) {
    //   filterFormValue.sortBy = sortBy;
    // }
    // if (dueDate) {
    //   filterFormValue.dueDate = dueDate;
    // }
    // if (dateCreated) {
    //   filterFormValue.dateCreated = dateCreated;
    // }
    // if (dateUpdated) {
    //   filterFormValue.dateUpdated = dateUpdated;
    // }
    // if (dateCompleted) {
    //   filterFormValue.dateCompleted = dateCompleted;
    // }
    if (assignedTo) {
      filterFormValue.assignedTo = assignedTo.map((item) => item._id);
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
      const projects = await getAllProjects();
      setLoading(false);

      if (projects.error) {
        console.log(projects?.error);
      } else {
        setProjects(projects.data);
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
          name: item?.name,
          _id: item?._id,
        }));
        console.log(categories.data,'======================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        setCategories(categories?.data);
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
	// console.log("selectedItems", selectedItems);
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
  const setProjectAndOpenModal = (projectData) => {
    if (handleProjectId) {
      let projectData = projects?.find((item) => handleProjectId == item?._id);
      let assignedToData = usersList?.filter(
        (item) => userDetails.id == item?._id
      );
      console.log(assignedToData, userDetails, "assignedToData", usersList);

      setProjectIds(projectData);
      setAssignedTo(assignedToData);
    }
    setFilterModalShow(true);
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
                    onClick={setProjectAndOpenModal}
                    style={{
                      marginRight: "2px",
                      cursor: "pointer",
                    }}
                    src={require("../../../assests/img/filter.png")}
                    alt="filter"
                  />
                  
                  <span
                    onClick={setProjectAndOpenModal}
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
                <Form.Group controlId="formSelectProject">
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
                        isDisabled={handleProjectId}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group  controlId="formDateCreated">
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

                <Form.Group  controlId="formDateCreated">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>assignedTo</Form.Label>
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

                {/* <Form.Group as={Row} controlId="formDateCreated">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Category</Form.Label>
                    </Col>
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
                </Form.Group> */}
                <Form.Group as={Row} controlId="category">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Category</Form.Label>
                    </Col>
                    <Col sm="9">
                      <Select
                        onChange={(e) => onSelectData(e, "assignedTo")}
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
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>
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
             
                <Form.Group  controlId="formDateCreated">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Status</Form.Label>
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

                {/* <Form.Group  controlId="formDateCreated">
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

                {/* <Form.Group  controlId="formSelectProjectGroup">
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

                <Form.Group  controlId="formSortBy">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Sort By</Form.Label>
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

                <Form.Group  controlId="formDueDate">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Due Date</Form.Label>
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

                <Form.Group  controlId="formDateCreated">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Date Created</Form.Label>
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

                <Form.Group  controlId="formDateUpdated">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Date Updated</Form.Label>
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

                <Form.Group  controlId="formDateCompleted">
                  <Row className="filterFields">
                    <Col sm="3">
                      <Form.Label>Date Completed</Form.Label>
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

                {/* <Button  md="2" className="btnDanger" type="submit">
                  Clear Filter
                </Button> */}
             
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
