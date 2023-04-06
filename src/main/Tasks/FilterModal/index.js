/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Container, Row, Form, Modal, Col } from "react-bootstrap";
import Loader from "../../../components/Loader";
import { CONSTANTS } from "../../../constants";
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
import FilterDropdown from "./FilterDropdown";
import SortByDropdown from "./SortFilter";
const FilterModal = (props) => {
  const { getTaskFilters, handleProjectId, isArchive } = props;

  const { userDetails } = useAuth();
  const statusList = CONSTANTS.statusListObj;
  const priorityList = CONSTANTS.priorityListObj;
  const filterFormFileds = {
    createdBy: "",
    assignedTo: "",
    category: "",
    priority: "",
    status: "",
    groupBy: "",
    projectIds: "",
    sortOrder: "",
    sortType: "",
    fromDate: "",
    toDate: "",
  };
  const [clearFilter, setClearFilterBoolean] = useState(false);
  const [projectIds, setProjectIds] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [createdBy, setCreatedBy] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dateCreated, setDateCreated] = useState("");
  const [dateUpdated, setDateUpdated] = useState("");
  const [dateCompleted, setDateCompleted] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [filterFormValue, setFilterFormValue] = useState(filterFormFileds);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    getAllProjectsData();
    getAllCategoriesData();
    getAllUsersData();
    updateFromLocalStorage();
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("taskFilters");
      localStorage.removeItem("dueDate");
      localStorage.removeItem("sortOrder");
      localStorage.removeItem("sortType");
      localStorage.removeItem("selectedFilter");
    };
  }, []);

  const handleFilterSelect = (fromDate, toDate) => {
    console.log("fromDate", fromDate);
    localStorage.setItem(
      "dueDate",
      JSON.stringify({ fromDate: fromDate, toDate: toDate })
    );
  };

  const handleFilterSortOrderSelect = (sortOrder) => {
    localStorage.setItem("sortOrder", sortOrder);
  };
  const handleFilterSortSelect = (sortType) => {
    localStorage.setItem("sortType", sortType);
  };

  const updateFromLocalStorage = () => {
    if (localStorage.getItem("taskFilters")) {
      let filterFormValueFromLocal = JSON.parse(
        localStorage.getItem("taskFilters")
      );
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
      setProjectIds(projectData);
      setAssignedTo(assignedToData);
      setCategoryData(selectedCategory);
      setCreatedBy(createdByData);
      setPriorityData(selectedPriority);
      setStatusData(selectedStatus);
      setClearFilterBoolean(true);
    }
  };

  const closeModalAndgetAllTaskOfProject = () => {
    updateFromLocalStorage();
    setClearFilterBoolean(true);
    if (assignedTo) {
      filterFormValue.assignedTo = assignedTo.map((item) => item._id);
    }
    let dueDate = JSON.parse(localStorage.getItem("dueDate"));
    if (dueDate.fromDate && dueDate.toDate) {
      filterFormValue.fromDate = dueDate.fromDate;
      filterFormValue.toDate = dueDate.toDate;
    }
    if (localStorage.getItem("sortOrder")) {
      filterFormValue.sortOrder = localStorage.getItem("sortOrder");
    }
    if (localStorage.getItem("sortType")) {
      filterFormValue.sortType = localStorage.getItem("sortType");
    }

    localStorage.setItem("taskFilters", JSON.stringify(filterFormValue));
    getTaskFilters();
    setFilterModalShow(false);
  };
  const clearFilterFormValue = () => {
    setProjectIds("");
    setAssignedTo("");
    setCreatedBy("");
    setCategoryData("");
    setPriorityData("");
    setStatusData("");
    setDateCompleted("");
    setDateCreated("");
    setDateUpdated("");
    setFilterFormValue(filterFormFileds);
    localStorage.removeItem("taskFilters");
    localStorage.removeItem("dueDate");
    localStorage.removeItem("sortType");
    localStorage.removeItem("sortOrder");
    localStorage.removeItem("selectedFilter");
    setClearFilterBoolean(false);
    getTaskFilters();
  };

  const getAllProjectsData = async () => {
    setLoading(true);

    try {
      const projects = await getAllProjects();
      setLoading(false);

      if (projects.error) {
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
      console.log("categories", categories);
      setLoading(false);

      if (categories.error) {
      } else {
        categories.data = categories?.data?.map((item, i) => ({
          name: item?.name,
          _id: item?._id,
        }));
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
    let data = selectedItems?.map((item) => item?._id);
    if (dataType === "projectIds") {
      setProjectIds(selectedItems);
    } else if (dataType === "assignedTo") {
      setAssignedTo(selectedItems);
    } else if (dataType === "createdBy") {
      setCreatedBy(selectedItems);
    } else if (dataType === "priority") {
      setPriorityData(selectedItems);
    } else if (dataType === "status") {
      setStatusData(selectedItems);
    } else if (dataType === "category") {
      setCategoryData(selectedItems);
    }
    setFilterFormValue({ ...filterFormValue, [dataType]: data });
  };
  const setProjectAndOpenModal = (projectData) => {
    if (handleProjectId) {
      let projectData = projects?.find((item) => handleProjectId === item?._id);
      let assignedToData = usersList?.filter(
        (item) => userDetails.id === item?._id
      );
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
                {!isArchive && (
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
                )}
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
          width={600}
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
              <Form.Group controlId="formDateCreated">
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

              <Form.Group controlId="formDateCreated">
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
              <Form.Group controlId="category">
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
              </Form.Group>
              <Form.Group controlId="formDateCreated">
                <Row className="filterFields">
                  <Col sm="3">
                    <Form.Label>Priority</Form.Label>
                  </Col>
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

              <Form.Group controlId="formDateCreated">
                <Row className="filterFields">
                  <Col sm="3">
                    <Form.Label>Status</Form.Label>
                  </Col>

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
              <Form.Group controlId="formDueDate">
                <Row className="filterFields due-date">
                  <FilterDropdown onFilterSelect={handleFilterSelect} />
                </Row>
              </Form.Group>
              <Form.Group controlId="formDueDate">
                <Row
                  className="filterFields due-date"
                  style={{ marginTop: "0px" }}
                >
                  <SortByDropdown
                    onFilterSortSelect={handleFilterSortSelect}
                    onFilterSortOrderSelect={handleFilterSortOrderSelect}
                  />
                </Row>
              </Form.Group>

              <Form.Group controlId="formDateCreated">
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

              <Form.Group controlId="formDateUpdated">
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

              <Form.Group controlId="formDateCompleted">
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
            </Form>
          </Modal.Body>
          <Modal.Footer>
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
