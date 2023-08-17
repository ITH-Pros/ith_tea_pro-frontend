import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Col, Row, Offcanvas, Form } from "react-bootstrap";
import Select from "react-select";
import { useAuth } from "../../utlis/AuthProvider";
import { CONSTANTS, CUSTOMSTYLES } from "../../constants/index";
import Loader from "../Shared/Loader/index";
import FilterDropdown from "./FilterDropdown";
import SortByDropdown from "./SortFilter";
import {
  getAllCategories,
  getAllProjects,
  getAllLeads,
  getAllUsersWithoutPagination,
} from "@services/user/api";

const FilterModal = (props) => {
  const {
    getTaskFilters,
    handleProjectId,
    isArchive,
    downloadExportData,
    projectId,
  } = props;
  const { userDetails } = useAuth();
  const customStyles = CUSTOMSTYLES;
  const [clearFilter, setClearFilterBoolean] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [leadsArray, setleadsArray] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const priorityList = CONSTANTS.priorityList.map((priority) => ({
    value: priority,
    label: priority,
  }));
  const statusList = CONSTANTS.statusList.map((status) => ({
    value: status,
    label: status,
  }));

  const formik = useFormik({
    initialValues: {
      createdBy: [],
      selectedLead: [],
      assignedTo: [],
      category: [],
      priority: [],
      status: [],
      projectIds: [],
      sortOrder: "",
      sortType: "",
      fromDate: "",
      toDate: "",
    },
    onSubmit: (values) => {
      // Transform the values as needed and update local storage
      localStorage.setItem("taskFilters", JSON.stringify(values));
      getTaskFilters();
      setFilterModalShow(false);
    },
    onReset: (values) => {
      localStorage.removeItem("taskFilters");
      setClearFilterBoolean(true);
      getTaskFilters();
      setFilterModalShow(false);
    },
  });

  // Function to handle specific actions like loading data
  const getAllProjectsData = async () => {
    setLoading(true);
    try {
      const projects = await getAllProjects();
      setLoading(false);
      if (!projects.error) setProjects(projects.data);
    } catch (error) {
      setLoading(false);
    }
  };
  // Similar functions for other data fetching
  const getAllCategoriesData = async () => {
    setLoading(true);
    try {
      const categories = await getAllCategories();
      console.log(categories);
      setLoading(false);
      if (!categories.error) setCategories(categories.data);
    } catch (error) {
      setLoading(false);
    }
};



  const getAllUsersData = async () => {
    setLoading(true);
    try {
      const users = await getAllUsersWithoutPagination();
      setLoading(false);
      if (!users.error) setUsersList(users?.data?.users);
    } catch (error) {
      setLoading(false);
    }
  };

  const getLeadsList = async () => {
    setLoading(true);
    try {
      const leads = await getAllLeads();
      setLoading(false);
      if (!leads.error) setleadsArray(leads.data?.users);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProjectsData();
    getAllUsersData();
    getLeadsList();
    getAllCategoriesData();
  }, [filterModalShow]);
  


  const setProjectAndOpenModal = () => {
    setFilterModalShow(true);
  };

  const clearFilterFormValue = () => {
    formik.resetForm();
    setFilterModalShow(false);
  };

  const handleFilterSelect = (fromDate, toDate) => {
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

  return (
    <>
      <div>
        {/* Buttons and other UI elements */}
        <Button variant="light" style={{ margin: "0px 5px" }}>
          {!isArchive && (
            <span onClick={setProjectAndOpenModal}>
              <i className="fa fa-filter" aria-hidden="true"></i> Filter
            </span>
          )}
        </Button>

        {(userDetails?.role === "ADMIN" ||
          userDetails?.role === "SUPER_ADMIN") && (
          <Button variant="light" style={{ margin: "0px 5px" }}>
            {!isArchive && (
              <span onClick={() => downloadExportData()}>
                <i className="fa fa-file-excel-o" aria-hidden="true"></i> Export
              </span>
            )}
          </Button>
        )}

        {clearFilter && (
          <Button
            onClick={() => {
              clearFilterFormValue();
              setClearFilterBoolean(false);

              localStorage.removeItem("selectedFilterTypes");
            }}
            variant="light"
            style={{ marginRight: "10px" }}
          >
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
        {/* ... */}
      </div>
      {filterModalShow && (
        <Offcanvas
          className="Offcanvas-modal"
          style={{ width: "600px" }}
          show={filterModalShow}
          onHide={clearFilterFormValue}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Task Filter</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Row>
                <Col sm="3">
                  <Form.Label>Project</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => formik.setFieldValue("projectIds", e)}
                    value={formik.values.projectIds}
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
                    styles={customStyles}
                    onChange={(e) => { formik.setFieldValue("selectedLead", e)}}
                    value={formik.values.selectedLead}
                    isMulti
                    getOptionLabel={(options) => options["name"]}
                    getOptionValue={(options) => options["_id"]}
                    options={leadsArray}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <Form.Label>Created By</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => formik.setFieldValue("createdBy", e)}
                    value={formik.values.createdBy}
                    isMulti
                    getOptionLabel={(options) => options["name"]}
                    getOptionValue={(options) => options["_id"]}
                    options={usersList}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <Form.Label>Assigned To</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => formik.setFieldValue("assignedTo", e)}
                    value={formik.values.assignedTo}
                    isMulti
                    getOptionLabel={(options) => options["name"]}
                    getOptionValue={(options) => options["_id"]}
                    options={usersList}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <Form.Label>Category</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => formik.setFieldValue("category", e)}
                    value={formik.values.category}
                    isMulti
                    getOptionLabel={(options) => options["name"]}
                    getOptionValue={(options) => options["_id"]}
                    options={categories}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <Form.Label>Priority</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => formik.setFieldValue("priority", e)}
                    value={formik.values.priority}
                    isMulti
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    options={priorityList}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <Form.Label>Status</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => formik.setFieldValue("status", e)}
                    value={formik.values.status}
                    isMulti
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    options={statusList}
                  />
                </Col>
              </Row>
              <Row className="filterFields due-date">
                <FilterDropdown
                  onFilterSelect={handleFilterSelect}
                  clearFilterProp={clearFilter}
                />
              </Row>
              <Row
                className="filterFields due-date"
                style={{ marginTop: "0px" }}
              >
                <SortByDropdown
                  onFilterSortSelect={handleFilterSortSelect}
                  onFilterSortOrderSelect={handleFilterSortOrderSelect}
                />
              </Row>
              <Button className="pull-right" variant="primary" type="submit">
                Apply Filter
              </Button>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {loading && <Loader />}
    </>
  );
};

export default FilterModal;
