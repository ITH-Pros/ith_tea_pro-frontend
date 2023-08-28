import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Col, Row, Offcanvas, Form } from "react-bootstrap";
import Select from "react-select";
import { useAuth } from "../../utlis/AuthProvider";
import { CONSTANTS, CUSTOMSTYLES } from "../../constants/index";
import Loader from "../Shared/Loader/index";
import FilterDropdown from "./FilterDropdown";
import SortByDropdown from "./SortFilter";
import "./filter.css";
import {
  getAllCategories,
  getAllProjects,
  getAllLeads,
  getAllUsersWithoutPagination,
} from "@services/user/api";
import { useQuery } from "react-query";

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
      localStorage.setItem("taskFilters", JSON.stringify(values));
      getTaskFilters();
      setFilterModalShow(false);
      setClearFilterBoolean(true);
    },
    onReset: (values) => {
      // reset form
      localStorage.removeItem("taskFilters");
      setClearFilterBoolean(false);
      getTaskFilters();
      setFilterModalShow(false);
    },
  });

  /*
  @all projects data
  */

  const { data: projects } = useQuery(
    ["projectList", filterModalShow],
    () => getAllProjects(),
    {
      enabled: filterModalShow,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.data;
      },
      onSuccess: (data) => {
        console.log("calling form filter modal");
      },
    }
  );

  useEffect(() => {
    if (handleProjectId) {
      projects?.map((project) => {
        if (project._id === handleProjectId) {
          formik.setFieldValue("projectIds", project);
        }
      });
    }
  }, [handleProjectId, projects]);
  /*
  @all categories data
  */

  const fetchCategories = async () => {
    const categories = await getAllCategories();
    return categories?.data;
  };

  const { data: categories } = useQuery(
    ["categories", filterModalShow],
    fetchCategories,
    {
      enabled: filterModalShow,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data;
      },
    }
  );

  /*
@all users data
*/

  const fetchUsers = async () => {
    const users = await getAllUsersWithoutPagination();
    return users?.data?.users;
  };

  const { data: usersList } = useQuery(["users", filterModalShow], fetchUsers, {
    enabled: filterModalShow,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data;
    },
  });

  /*
  @all leads data
  */

  const fetchLeads = async () => {
    const leads = await getAllLeads();
    return leads?.data?.users;
  };

  const { data: leadsArray } = useQuery(
    ["leads", filterModalShow],
    fetchLeads,
    {
      enabled: filterModalShow,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data;
      },
    }
  );

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
          onHide={formik.handleReset}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Task Filter</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body id="task_filter_ui">
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
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
              <Row className="mb-3">
                <Col sm="3">
                  <Form.Label>Lead</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => {
                      formik.setFieldValue("selectedLead", e);
                    }}
                    value={formik.values.selectedLead}
                    isMulti
                    getOptionLabel={(options) => options["name"]}
                    getOptionValue={(options) => options["_id"]}
                    options={leadsArray}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
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
              <Row className="mb-3">
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
              <Row className="mb-3">
                <Col sm="3">
                  <Form.Label>Category</Form.Label>
                </Col>
                <Col sm="9" className="filterFields">
                  <Select
                    styles={customStyles}
                    onChange={(e) => formik.setFieldValue("category", e)}
                    value={formik.values.category}
                    isMulti
                    getOptionLabel={(options) => `${options?.projectId?.name} (${options?.name})`}
                    getOptionValue={(options) => options["_id"]}
                    options={categories}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
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
              <Row className="mb-3">
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
              <Row>
                <Col lg={12} className="text-right">
                  <Button
                    className="pull-right"
                    variant="primary"
                    type="submit"
                  >
                    Apply Filter
                  </Button>
                </Col>
              </Row>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {loading && <Loader />}
    </>
  );
};

export default FilterModal;
