/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Loader from "@components/Shared/Loader";
import {
  editLogedInUserDetails,
  getLogedInUserDetails,
} from "@services/user/api";
import "./index.css";
import ImageUpload from "@components/Shared/ImageUpload/imageUpload";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
// import { useAuth } from "../../auth/AuthProvider";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "react-query";
import { formatDateToProfile } from "@helpers/index";

function UserForm(props) {
  const { handleModalClose, showModalOnLogin } = props;
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [profilePicture, setProfileImage] = useState("");
  const navigate = useNavigate();
  const today = new Date();

  const validationSchema = Yup.object({
    name: Yup.string().max(50, "Maximum 50 characters allowed"),
    employeeId: Yup.string().max(20, "Maximum 20 characters allowed"),
    dob: Yup.date().max(
      new Date(today.getFullYear() - 15, today.getMonth(), today.getDate()),
      "Must be at least 15 years old"
    ),
    designation: Yup.string().max(50, "Maximum 50 characters allowed"),
    department: Yup.string().max(50, "Maximum 50 characters allowed"),
    github: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
      "Invalid Github URL"
    ),
    twitter: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/,
      "Invalid Twitter URL"
    ),
    linkedin: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
      "Invalid LinkedIn URL"
    ),
  });

  const handleSubmit = async (values) => {
    const dataToSend = {
      ...values,
      profilePicture,
    };
    formMutation.mutate(dataToSend);
  };

  const formMutation = useMutation(editLogedInUserDetails, {
    onSuccess: () => {
      toast.info("Profile Updated Successfully");
      toast.dismiss();
      setIsEditable(true);
      localStorage.removeItem("isEditProfile");
      document.getElementById("headerbuttontoupdateprofile")?.click();
      if (showModalOnLogin) {
        handleModalClose();
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Something Went Wrong in edit profile");
      document.getElementById("headerbuttontoupdateprofile")?.click();
      setLoading(false);
    },
  });

  const { isLoading: isUpdateing } = formMutation;

  const formik = useFormik({
    initialValues: {
      name: "",
      role: "",
      email: "",
      employeeId: "",
      designation: "",
      department: "",
      dob: "",
      github: "",
      twitter: "",
      linkedin: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (localStorage.getItem("isEditProfile") === "true") {
      setIsEditable(true);
    }
  }, []);

  const { isLoading: isFetching } = useQuery(
    "userDetails",
    getLogedInUserDetails,
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const patchedValues = patchValues(data.data);
        formik.setValues(patchedValues);
        setProfileImage(data.data?.profilePicture || "");
      },
    }
  );

  const patchValues = (currentUser) => ({
    name: currentUser?.name || "",
    role: currentUser?.role || "",
    email: currentUser?.email || "",
    employeeId: currentUser?.employeeId || "",
    designation: currentUser?.designation || "",
    department: currentUser?.department || "",
    github: currentUser?.githubLink || "",
    twitter: currentUser?.twitterLink || "",
    linkedin: currentUser?.linkedInLink || "",
    dob: currentUser?.dob ? formatDateToProfile(currentUser?.dob) : "",
  });

  const handleEditClick = (event) => {
    event.preventDefault();
    setIsEditable(!isEditable);
  };

  const handleResetClick = () => {
    navigate("/profile/reset-password");
  };

  return (
    <div className="addUserFrom-edit">
      <form className="row" onSubmit={formik.handleSubmit}>
        <div className="profile-images">
          <div className="edit-detle">
            <ImageUpload
              setProfileImage={setProfileImage}
              selectedProfilePic={profilePicture}
              isEditable={!isEditable}
            />
          </div>
        </div>
        <div className="form-group col-12 text-center profil-ed">
          {!isEditable ? (
            <Button
              disabled={isUpdateing}
              variant="primary"
              size="sm"
              type="submit"
            >
              {isUpdateing ? "Updating..." : "Update"}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleEditClick}
              className="ms-2"
            >
              Edit Profile
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="ms-2"
            onClick={handleResetClick}
          >
            Reset Password
          </Button>
        </div>
        {/* Other form fields using formik.getFieldProps */}
        {/* Example for name field */}
        <div className="form-group col-12">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            maxLength="50"
            disabled={isEditable}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error">{formik.errors.name}</div>
          ) : null}
        </div>
        {/* Repeat similar pattern for other form fields */}
        <div className="form-group col-4">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            disabled={isEditable}
            {...formik.getFieldProps("role")}
          />
          {formik.touched.role && formik.errors.role ? (
            <div className="error">{formik.errors.role}</div>
          ) : null}
        </div>

        <div className="form-group col-4">
          <label htmlFor="employeeId">Employee Id:</label>
          <input
            type="text"
            id="employeeId"
            maxLength="20"
            disabled={isEditable}
            {...formik.getFieldProps("employeeId")}
          />
          {formik.touched.employeeId && formik.errors.employeeId ? (
            <div className="error">{formik.errors.employeeId}</div>
          ) : null}
        </div>
        <div className="form-group col-4">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            disabled={isEditable}
            {...formik.getFieldProps("dob")}
          />
          {formik.touched.dob && formik.errors.dob ? (
            <div className="error">{formik.errors.dob}</div>
          ) : null}
        </div>
        <div className="form-group col-6">
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            maxLength="50"
            disabled={isEditable}
            {...formik.getFieldProps("designation")}
          />
          {formik.touched.designation && formik.errors.designation ? (
            <div className="error">{formik.errors.designation}</div>
          ) : null}
        </div>
        <div className="form-group col-6">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            maxLength="50"
            disabled={isEditable}
            {...formik.getFieldProps("department")}
          />
          {formik.touched.department && formik.errors.department ? (
            <div className="error">{formik.errors.department}</div>
          ) : null}
        </div>

        <div className="form-group col-12">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            disabled={isEditable}
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="form-group col-12">
          <label htmlFor="github">Github:</label>
          <input
            type="text"
            id="github"
            maxLength="200"
            disabled={isEditable}
            {...formik.getFieldProps("github")}
          />
          {formik.touched.github && formik.errors.github ? (
            <div className="error">{formik.errors.github}</div>
          ) : null}
        </div>
        <div className="form-group col-12">
          <label htmlFor="twitter">Twitter:</label>
          <input
            type="text"
            id="twitter"
            maxLength="200"
            disabled={isEditable}
            {...formik.getFieldProps("twitter")}
          />
          {formik.touched.twitter && formik.errors.twitter ? (
            <div className="error">{formik.errors.twitter}</div>
          ) : null}
        </div>
        <div className="form-group col-12">
          <label htmlFor="linkedin">LinkedIn:</label>
          <input
            type="text"
            id="linkedin"
            maxLength="200"
            disabled={isEditable}
            {...formik.getFieldProps("linkedin")}
          />
          {formik.touched.linkedin && formik.errors.linkedin ? (
            <div className="error">{formik.errors.linkedin}</div>
          ) : null}
        </div>
      </form>
      {isFetching ? <Loader /> : null}
    </div>
  );
}

export default UserForm;
