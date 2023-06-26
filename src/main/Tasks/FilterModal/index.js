/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Container, Row, Form, Modal, Col, Button } from "react-bootstrap";
import Loader from "../../../components/Loader";
import { CONSTANTS } from "../../../constants";
import "./filter.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllCategories,
  getAllProjects,
  getAllLeads,
  getAllUsersWithoutPagination,
} from "../../../services/user/api";
import Select from "react-select";
import { useAuth } from "../../../auth/AuthProvider";
import FilterDropdown from "./FilterDropdown";
import SortByDropdown from "./SortFilter";
import Offcanvas from "react-bootstrap/Offcanvas";

const FilterModal = (props) => {
  const { getTaskFilters, handleProjectId, isArchive , downloadExportData , projectId } = props;

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
  const [selectedFilterLead, setselectedFilterLead] = useState("");

  const [clearFilter, setClearFilterBoolean] = useState(false);
  const [projectIds, setProjectIds] = useState([]);
  const [leadsArray, setleadsArray] = useState([]);
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

  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: 5,
    }),

    control: (provided) => ({
      ...provided,
      boxShadow: "none",
      height: "40px",
      borderRadius: "5px",
      color: "#767474",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#999",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: 13,
      borderRadius: "0px 0px 10px 10px",
      boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.05)",
      top: "32px",
      padding: "5px",
      zIndex: "2",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 10px",
    }),
  };

  useEffect(() => {
    if(selectedFilterLead){
      console.log(selectedFilterLead.map(obj => obj._id))

      localStorage.setItem('selectedLead',JSON.stringify(selectedFilterLead.map(obj => obj._id)))
    }
  }, [selectedFilterLead]);
  
  useEffect(() => {
    getLeadsList()
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
  
    // console.log("fromDate----------------------------toDate", fromDate, toDate);
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
    if (dueDate?.fromDate && dueDate?.toDate) {
      filterFormValue.fromDate = dueDate?.fromDate;
      filterFormValue.toDate = dueDate?.toDate;
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
    localStorage.removeItem('fromDate')
    localStorage.removeItem('filterClicked')
    localStorage.removeItem('toDate')
    localStorage.removeItem("selectedLead")
    setselectedFilterLead([])
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
  const getLeadsList = async () => {
    setLoading(true);

    try {
      const leads = await getAllLeads();
      setLoading(false);

      if (leads.error) {
      } else {
        setleadsArray(leads?.data?.users||[]);
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
      } else {
        categories.data = categories?.data?.map((item, i) => ({
          name: item?.projectId?.name + '  (' +item?.name +')' ,
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
  const setProjectAndOpenModal = () => {
    if (handleProjectId) {
      let projectData = projects?.find((item) => handleProjectId === item?._id);
      let assignedToData = usersList?.filter(
        (item) => userDetails.id === item?._id
      );
      setProjectIds(projectData);
      setAssignedTo(assignedToData);
    }
    localStorage.removeItem("dueDate");
    localStorage.removeItem("selectedFilter");
    localStorage.removeItem("taskFilters");
    setFilterModalShow(true);
  };

  return (
    <>
      <div>
        <Button variant="light" style={{ margin: "0px 5px" }}>
          {!isArchive && (
            <span onClick={setProjectAndOpenModal}>
              <i className="fa fa-filter" aria-hidden="true"></i> Filter
            </span>
          )}
        </Button>

        {(userDetails?.role === "ADMIN" || userDetails?.role === "SUPER_ADMIN") && (

          <Button
          variant="light"
          style={{ margin: "0px 5px" }}>
          {!isArchive   && (
            <span onClick={() => downloadExportData()}>
              <i className="fa fa-file-excel-o" aria-hidden="true"></i> Export
            </span>
          )}
          </Button>
        )}
          

      

        {clearFilter && (
          <Button onClick={() => {
                  clearFilterFormValue();
                  setClearFilterBoolean(false);

                  localStorage.removeItem("selectedFilterTypes");
                }} variant="light" style={{ marginRight: "10px" }}>
            {clearFilter && (
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            )}
            {clearFilter && (
              <span
                style={{ marginLeft: "5px" }}
                onClick={() => {
                  clearFilterFormValue();
                  setClearFilterBoolean(false);

                  localStorage.removeItem("selectedFilterTypes");
                }}
              >
                Clear Filter
              </span>
            )}
          </Button>
        )}
      </div>
      {filterModalShow && (
        <Offcanvas
          className="Offcanvas-modal"
          style={{ width: "600px" }}
          show={filterModalShow}
          onHide={() => {localStorage.removeItem('fromDate');localStorage.removeItem('toDate');
          setFilterModalShow(false);}}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="contained-modal-title-vcenter">
              {" "}
              Task Filter
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form noValidate>
              <Form.Group controlId="formSelectProject">
                <Row>
                  <Col sm="3">
                    <Form.Label>Project</Form.Label>
                  </Col>
                  <Col sm="9" className="filterFields">
                    <Select
                      styles={customStyles}
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
                <Row>
                  <Col sm="3">
                    <Form.Label>Lead</Form.Label>
                  </Col>
                  <Col sm="9" className="filterFields">
                    <Select
                    isMulti
                      styles={customStyles}
                      onChange={(e) => setselectedFilterLead(e)}
                      value={selectedFilterLead}
                      
                      getOptionLabel={(options) => options["name"]}
                      getOptionValue={(options) => options["_id"]}
                      options={leadsArray}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="formDateCreated">
                <Row className="filterFields">
                  <Col sm="3">
                    <Form.Label>Created By</Form.Label>
                  </Col>
                  <Col sm="9">
                    <Select
                      styles={customStyles}
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
                    <Form.Label>Assigned To</Form.Label>
                  </Col>
                  <Col sm="9">
                    <Select
                      styles={customStyles}
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
                      styles={customStyles}
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
                      styles={customStyles}
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
                      styles={customStyles}
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
                  <FilterDropdown onFilterSelect={handleFilterSelect} clearFilterProp={clearFilter} />
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
            </Form>

            <Button className="pull-right"
              variant="primary"
              onClick={closeModalAndgetAllTaskOfProject}
            >
              <span>Apply Filter</span>
            </Button>
          </Offcanvas.Body>
        </Offcanvas>
      )}

    

      {loading && <Loader />}
    </>
  );
};

export default FilterModal;
