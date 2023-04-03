/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Loader from "../../../components/Loader";
import Toaster from "../../../components/Toaster";
import {
  addNewProject,
  getAllLeadsWithoutPagination,
  getAllProjects,
  getAllUserWithoutPagination,
  updateProjectForm,
} from "../../../services/user/api";
import "./index.css";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const customStyles = {
  option: (provided) => ({
    ...provided,
    padding: 5,
  }),
  valueContainer: (provided) => ({
    ...provided,
  }),
  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    maxHeight: "40px",
    overflowY: "auto",
    borderRadius: "5px",
    color: "#767474",
    minHeight: "40px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  placeholder: (provided) => ({
    ...provided,
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
};


export default function AddProject(props) {
  
  const navigate = useNavigate();
  const [showErrorForLead, setShowErrorForLead] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [userList, setUserList] = useState([]);
  const [leadList, setLeadList] = useState([]);
  const [toaster, showToaster] = useState(false);
  const [assignedby, setAssignedByValue] = useState([]);
  const [managedby, setManagedByValue] = useState([]);
  const [projectList, setProjectListValue] = useState([]);
  const params = useParams();
  const setShowToaster = (param) => showToaster(param);
  const [color, setColor] = useColor("hex", "#cc3636 ");

  const projectById = projectList.find(
    (project) => project._id === params.projectId
  );

  const projectFormFields = {
    name: "",
    description: "",
    selectedManagers: [],
    selectAccessibleBy: [],
  };
  
  const [projectFormValue, setProjectFormValue] = useState(projectFormFields);

  useEffect(() => {
    setProjectFormValue({
      ...projectFormValue,
      colorCode: color?.hex,
    });
  }, [color]);

  useEffect(() => {
    getAndSetAllProjects();
    getUsersList();
    getLeadsList();
  }, []);

  useEffect(() => {
    if (projectById) {
      setAssignedByValue(projectById.accessibleBy);
      setManagedByValue(projectById.managedBy);
      setProjectFormValue({
        ...projectFormValue,
        name: projectById.name,
        description: projectById.description,
        selectedManagers: projectById.managedBy.map((el) => el._id),
        selectAccessibleBy: projectById.accessibleBy.map((el) => el._id),
      });
    }
  }, [projectById]);

  const getAndSetAllProjects = async function () {
    try {
      const projects = await getAllProjects();
      if (projects.error) {
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setProjectListValue(projects.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidated(true);
    try {
      if (!checkAllValuesPresent() || !managedby.length) {
        setLoading(false);
        if (!managedby.length) {
          setShowErrorForLead(true);
        }
        return;
      }
      const updatedProjectFormValue = {
        ...projectFormValue,
        projectId: params.projectId,
      };
      const userRes = await updateProjectForm(updatedProjectFormValue);
      setLoading(false);
      if (userRes.error) {
        setToasterMessage(userRes?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage("Success");
        navigate("/project/all");
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  const getUsersList = async function () {
    setLoading(true);
    try {
      const user = await getAllUserWithoutPagination();
      setLoading(false);

      if (user.error) {
        setToasterMessage(user?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setUserList(user.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };
  const getLeadsList = async function () {
    setLoading(true);
    try {
      const lead = await getAllLeadsWithoutPagination();
      setLoading(false);

      if (lead.error) {
        setToasterMessage(lead?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setLeadList(lead.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  const updateRegisterFormValue = (e) => {
    setProjectFormValue({
      ...projectFormValue,
      [e.target.name]: e.target.value,
    });
  };

  function checkAllValuesPresent() {
    return Object.keys(projectFormValue).every(function (x) {
      if (["selectAccessibleBy"].includes(x)) return true;
      return projectFormValue[x];
    });
  }
  const submitProjectForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidated(true);

    if (params.projectId) {
      handleUpdateProject(e);
      return;
    }
    try {
      if (!checkAllValuesPresent() || !managedby.length) {
        setLoading(false);
        if (!managedby.length) {
          setShowErrorForLead(true);
        }
        return;
      }

      const userRes = await addNewProject(projectFormValue);
      setLoading(false);
      if (userRes.error) {
        setToasterMessage(userRes?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage("Success");
        navigate("/project/all");
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  const onAssignManagerChange = (users) => {
    setManagedByValue(users);
    setProjectFormValue({
      ...projectFormValue,
      selectedManagers: users.map((el) => el._id),
    });
    setTimeout(() => {}, 1000);
  };

  const onAssignUserChange = (users) => {
    setAssignedByValue(projectById?.assignedby);
    setProjectFormValue({
      ...projectFormValue,
      selectAccessibleBy: users.map((el) => el._id),
    });
  };

  const handleCancel = () => {
    navigate("/project/all");
  };

  const UpdateAndCancel = () => {
    if (params.projectId) {
      return (
        <div className="d-flex justify-content-end">
          <Button
            variant="outline-primary"
            className="mr-3"
            onClick={submitProjectForm}
          >
            Update
          </Button>
          <Button variant="outline-danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-end">
          <Button
            variant="outline-primary"
            className="mr-3"
            onClick={submitProjectForm}
          >
            Submit
          </Button>
          <Button variant="outline-danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      );
    }
  };

  return (
    <div
      className="addUserFrom rightDashboard"
      style={{
        marginTop: "7%",
        background: "none",
        marginRight: "0px",
        padding: "0px",
        borderRadius: "0px",
      }}
    >
      <h1 className="h1-text">
        <i className="fa fa-database" aria-hidden="true"></i>Add Projects
      </h1>

      
      <div >
        <Link className="h1-text pull-right" to="/project/all">
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </Button>
        </Link>
        </div>
   

    
      <Form
        noValidate
        className="addUserFormBorder add-pro"
        validated={validated}
      >
      
        <Row className="mb-3">
          <Form.Group as={Col} md="12">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={updateRegisterFormValue}
              value={projectFormValue.name}
              name="name"
              placeholder="Project Name"
              maxLength={50}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Name is required !!
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Assign Leads</Form.Label>
            <Select
              styles={customStyles}
              isMulti
              onChange={onAssignManagerChange}
              getOptionLabel={(options) => options["name"]}
              getOptionValue={(options) => options["_id"]}
              options={leadList}
              value={managedby}
              required
            />
            {showErrorForLead && (
              <p className="text-danger error">Lead is required !!</p>
            )}
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Assign Users</Form.Label>
            <Select
              styles={customStyles}
              isMulti
              onChange={onAssignUserChange}
              getOptionLabel={(options) => options["name"]}
              getOptionValue={(options) => options["_id"]}
              options={userList}
              value={assignedby}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              required
              type="text-area"
              placeholder="Maximum 100 words allowed"
              name="description"
              maxLength={100}
              onChange={updateRegisterFormValue}
              value={projectFormValue.description}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Project Color</Form.Label>
            <ColorPicker
              width={356}
              height={100}
              color={color}
              onChange={setColor}
              hideHSV
              dark
            />
          </Form.Group>
        </Row>

        <div>
          <UpdateAndCancel />
        </div>
      </Form>
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
      {loading ? <Loader /> : null}
    </div>
  );
}
