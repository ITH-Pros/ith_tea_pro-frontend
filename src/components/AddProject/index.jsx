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
import { useMutation, useQuery } from "react-query";

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
  const navigate = useNavigate();
  const params = useParams();
  const { data: projectById } = useQuery(
    ["projectById", params.projectId],
    async () => {
      const { data } = await getAllProjects();
      return data.find((project) => project._id === params.projectId);
    },{
      refetchOnWindowFocus: false,
      enabled: params.projectId !== undefined,
    }
  );

  const [color, setColor] = useColor(
    "hex",
    projectById?.colorCode || "#ADD8E6"
  );
  // Formik initialization
  const formik = useFormik({
    initialValues: {
      name: projectById?.name || "",
      description: projectById?.description || "",
      selectedManagers: projectById?.managedBy?.map((el) => el?._id) || [],
      selectAccessibleBy: projectById?.accessibleBy?.map((el) => el?._id) || [],
      colorCode: projectById?.colorCode || "#ADD8E6",
    },
    validationSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });

  /*
    @This function is used to handle form submit
    @Params: values
    @Returns: NONE
  */

  const handleFormSubmit = async (values) => {
    const formData = {
      name: values.name,
      description: values.description,
      selectedManagers: values.selectedManagers,
      selectAccessibleBy: values.selectAccessibleBy,
      colorCode: values.colorCode,
    };
    if (params.projectId) {
      updateProjectMutation.mutate({
        ...formData,
        projectId: params.projectId,
      });
    } else {
      addProjectMutation.mutate(formData);
    }
  };

  const addProjectMutation = useMutation(addNewProject, {
    onSuccess: (response) => {
      if (response.error) {
        toast.dismiss();
        toast.info(response?.message || "Something Went Wrong");
      } else {
        toast.dismiss();
        toast.info("Success");
        navigate("/project/all");
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    },
  });

  const { isLoading: addingProjectLoading } = addProjectMutation;

  const updateProjectMutation = useMutation(updateProjectForm, {
    onSuccess: (response) => {
      if (response.error) {
        toast.dismiss();
        toast.info(response?.message || "Something Went Wrong");
      } else {
        toast.dismiss();
        toast.info("Success");
        navigate("/project/all");
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    },
  });

  const { isLoading: updatingProjectLoading } = updateProjectMutation;

  const handleCancel = () => {
    navigate("/project/all"); // Redirects the user to the "/project/all" route
  };

  /*
      @ This function is used to fetch all users
      @ return {Array} users
    */

  const { data: userList, isLoading: isUserListLoading } = useQuery(
    "allUsers",
    getAllUserWithoutPagination,
    {
      refetchOnWindowFocus: false,
      enabled: true,
      select: (data) => data?.data,
    }
  );

  /*
    @ This function is used to fetch all leads
    @ return {Array} leads
    */


  const { data: leadList, isLoading: isLeadListLoading } = useQuery(
    "allLeads",
    getAllLeadsWithoutPagination,
    {
      refetchOnWindowFocus: false,
      enabled: true,
      select: (data) => data?.data,
    }
  );
  // Populate form fields if editing
  useEffect(() => {
    if (projectById) {
      formik.setValues({
        name: projectById.name,
        description: projectById.description,
        selectedManagers: projectById.managedBy?.map((el) => el._id),
        selectAccessibleBy: projectById.accessibleBy?.map((el) => el._id),
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
                    selected?.map((el) => el._id)
                  )
                }
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["_id"]}
                isLoading={isLeadListLoading}
                options={leadList}
                value={leadList?.filter((lead) =>
                  formik.values.selectedManagers?.includes(lead?._id)
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
                    selected?.map((el) => el._id)
                  )
                }
                getOptionLabel={(options) => options["name"]}
                getOptionValue={(options) => options["_id"]}
                options={userList}
                isLoading={isUserListLoading}
                value={userList?.filter((user) =>
                  formik.values.selectAccessibleBy?.includes(user?._id)
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
          <div className="d-flex justify-content-end">
            <Button disabled={addingProjectLoading || updatingProjectLoading} variant="outline-primary" className="mr-3" type="submit">
              { updatingProjectLoading ? "Updating..."
                :addingProjectLoading ? "Creating..."
                : projectById ? "Update" : "Submit"}
            </Button>

            <Button variant="outline-danger" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          {/* ...Rest of the form code, replacing onChange and value with formik.handleChange, formik.handleBlur, and formik.values as needed */}
        </Card>
      </BootstrapForm>
    </div>
  );
}
