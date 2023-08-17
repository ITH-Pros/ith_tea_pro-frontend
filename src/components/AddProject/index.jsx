import React, { useEffect, useState } from "react";
import { Button, Col, Row, Form as BootstrapForm, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { ColorPicker, useColor } from "react-color-palette";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../Shared/Loader/index";
import {
  addNewProject,
  getAllLeadsWithoutPagination,
  getAllProjects,
  getAllUserWithoutPagination,
  updateProjectForm,
} from "@services/user/api";
import { toast } from "react-toastify";
import "./index.css";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string()
    .required("Description is required")
    .max(100, "Maximum 100 words allowed"),
  selectedManagers: Yup.array().min(1, "Lead is required"),
  selectAccessibleBy: Yup.array().min(1, "Accessible By is required"),
});

export default function AddProject(props) {
  // ...Same state, effects, and functions as before
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [leadList, setLeadList] = useState([]);
  const [projectList, setProjectListValue] = useState([]);
  const params = useParams();
  const projectById = projectList.find(
    (project) => project._id === params.projectId
  );
  const [color, setColor] = useColor("hex", projectById?.colorCode || "#ADD8E6");
  // Formik initialization
  const formik = useFormik({
    initialValues: {
      name: projectById?.name || "",
      description: projectById?.description || "",
      selectedManagers: projectById?.managedBy?.map((el) => el._id) || [],
      selectAccessibleBy: projectById?.accessibleBy?.map((el) => el._id) || [],
      colorCode: projectById?.colorCode || "#ADD8E6",
    },
    validationSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      // Prepare the data for submission
      const formData = {
        name: values.name,
        description: values.description,
        managedBy: values.selectedManagers,
        accessibleBy: values.selectAccessibleBy,
        colorCode: values.colorCode,
      };

      let response;
      if (params.projectId) {
        // Update existing project
        response = await updateProjectForm({
          ...formData,
          projectId: params.projectId,
        });
      } else {
        // Create new project
        response = await addNewProject(formData);
      }

      setLoading(false);

      if (response.error) {
        toast.dismiss();
        toast.info(response?.message || "Something Went Wrong");
      } else {
        toast.dismiss();
        toast.info("Success");
        navigate("/project/all");
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/project/all"); // Redirects the user to the "/project/all" route
  };

  const getAndSetAllProjects = async function () {
    // Implementation of fetching all projects
    try {
      const projects = await getAllProjects();
      if (projects.error) {
        toast.dismiss();
        toast.info(projects?.message || "Something Went Wrong");
        // set
      } else {
        setProjectListValue(projects.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      // set
      return error.message;
    }
  };

  const getUsersList = async function () {
    // Implementation of fetching all users
    setLoading(true);
    try {
      const user = await getAllUserWithoutPagination();
      setLoading(false);

      if (user.error) {
        toast.dismiss();
        toast.info(user?.message || "Something Went Wrong");
        // set
      } else {
        setUserList(user.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      // set
      setLoading(false);
      return error.message;
    }
  };

  const getLeadsList = async function () {
    // Implementation of fetching all leads
    setLoading(true);
    try {
      const lead = await getAllLeadsWithoutPagination();
      setLoading(false);

      if (lead.error) {
        toast.dismiss();
        toast.info(lead?.message || "Something Went Wrong");
        // set
      } else {
        setLeadList(lead.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.info(error?.error?.message || "Something Went Wrong");
      // set
      setLoading(false);
      return error.message;
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    getAndSetAllProjects();
    getUsersList();
    getLeadsList();
  }, []);

  // Populate form fields if editing
  useEffect(() => {
    if (projectById) {
      formik.setValues({
        name: projectById.name,
        description: projectById.description,
        selectedManagers: projectById.managedBy.map((el) => el._id),
        selectAccessibleBy: projectById.accessibleBy.map((el) => el._id),
        colorCode: projectById?.colorCode,
      });
    }
  }, [projectById]);

  // Update color when color picker changes
  useEffect(() => {
    formik.setFieldValue("colorCode", color?.hex);
  }, [color]);
  

  return (
    <div
      className="addUserFrom rightDashboard"
      style={{
        marginTop: "7%",
        background: "none",
        padding: "0px",
        borderRadius: "0px",
      }}
    >
      <Row>
        <Col lg={6}>
          <h1 className="h1-text mt-0">
            <i className="fa fa-database" aria-hidden="true"></i>
            {projectById ? "Edit Project" : "Add Project"}
          </h1>
        </Col>
        <Col lg={6} className="text-end">
          <Link to="/project/all">
            <Button variant="btn btn-primary">
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </Button>
          </Link>
        </Col>
      </Row>
      <BootstrapForm
        noValidate
        validated={formik.isValid}
        className="addUserFormBorder"
        onSubmit={formik.handleSubmit}
      >
        <Card className="px-4 py-4 mt-2">
          <Row className="mb-3">
            <BootstrapForm.Group as={Col} md="12">
              <BootstrapForm.Label>Name</BootstrapForm.Label>
              <BootstrapForm.Control
                required
                type="text"
                name="name"
                placeholder="Project Name"
                maxLength={50}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                isInvalid={formik.errors.name && formik.touched.name}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.name}
              </BootstrapForm.Control.Feedback>
            </BootstrapForm.Group>
          </Row>
          <Row className="mb-3">
            <BootstrapForm.Group as={Col} md="6">
              <BootstrapForm.Label>Assign Leads</BootstrapForm.Label>
              <Select
                isMulti
                onChange={(selected) =>
                  formik.setFieldValue(
                    "selectedManagers",
                    selected.map((el) => el._id)
                  )
                }
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["_id"]}
                options={leadList}
                value={leadList.filter((lead) =>
                  formik.values.selectedManagers.includes(lead._id)
                )}
                required
              />
              {formik.errors.selectedManagers &&
                formik.touched.selectedManagers && (
                  <p className="text-danger error">
                    {formik.errors.selectedManagers}
                  </p>
                )}
            </BootstrapForm.Group>
            <BootstrapForm.Group as={Col} md="6">
              <BootstrapForm.Label>Assign Users</BootstrapForm.Label>
              <Select
                isMulti
                onChange={(selected) =>
                  formik.setFieldValue(
                    "selectAccessibleBy",
                    selected.map((el) => el._id)
                  )
                }
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["_id"]}
                options={userList}
                value={userList.filter((user) =>
                  formik.values.selectAccessibleBy.includes(user._id)
                )}
                required
              />
              {formik.errors.selectAccessibleBy &&
                formik.touched.selectAccessibleBy && (
                  <p className="text-danger error">
                    {formik.errors.selectAccessibleBy}
                  </p>
                )}
               
            </BootstrapForm.Group>
          </Row>

          <Row className="mb-3">
            <BootstrapForm.Group as={Col}>
              <BootstrapForm.Label>Description</BootstrapForm.Label>
              <BootstrapForm.Control
                as="textarea"
                required
                type="text-area"
                placeholder="Maximum 100 words allowed"
                name="description"
                maxLength={100}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                isInvalid={
                  formik.errors.description && formik.touched.description
                }
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {formik.errors.description}
              </BootstrapForm.Control.Feedback>
            </BootstrapForm.Group>
          </Row>

<Row className="mb-3">
  <BootstrapForm.Group as={Col}>
    <BootstrapForm.Label>Project Color</BootstrapForm.Label>
    <ColorPicker
      width={356}
      height={100}
      color={color}
      onChange={setColor}
      hideHSV
      dark
    />
  </BootstrapForm.Group>
</Row>


          {/* ...Rest of the form code, replacing onChange and value with formik.handleChange, formik.handleBlur, and formik.values as needed */}
        </Card>

        <div className="d-flex justify-content-end">
          <Button variant="outline-primary" className="mr-3" type="submit">
            {projectById ? "Update" : "Submit"}
          </Button>
          <Button variant="outline-danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
        
      </BootstrapForm>
      {loading ? <Loader /> : null}
    </div>
  );
}
