/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Toaster from "../../components/Toaster";
import {
  editLogedInUserDetails,
  getLogedInUserDetails,
} from "../../services/user/api";
import "./index.css";
import ImageUpload from "./imageUpload";

function UserForm(props) {
  const { handleModalClose } = props;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toaster, showToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [dob, setDob] = useState("");
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
  const twitterRegex = /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;
  const linkedinRegex =
    /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [profilePicture, setProfileImage] = useState("");
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    onInit();
  }, []);

  const onInit = () => {
    getUserDetails();

    if (localStorage.getItem("isEditProfile") === "true") {
      setIsEditable(true);
    }
  };

  const patchValues = (currentUser) => {
    setName(currentUser?.name || "");
    setRole(currentUser?.role || "");
    setEmail(currentUser?.email || "");
    setEmployeeId(currentUser?.employeeId || "");
    setDesignation(currentUser?.designation || "");
    setDepartment(currentUser?.department || "");
    setGithub(currentUser?.githubLink || "");
    setTwitter(currentUser?.twitterLink || "");
    setLinkedin(currentUser?.linkedInLink || "");
    setDob(currentUser?.dob || "");
    setProfileImage(currentUser?.profilePicture || "");
  };

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const response = await getLogedInUserDetails();
      if (response.error) {
        console.log("Error while getting user details");
        setLoading(false);
        return;
      } else {
        patchValues(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error while getting user details");
      setLoading(false);
      return error.message;
    }
  };

  function handleEditClick(event) {
    event.preventDefault();
    setIsEditable(!isEditable);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      (github && !githubRegex.test(github)) ||
      (linkedin && !linkedinRegex.test(linkedin)) ||
      (twitter && !twitterRegex.test(twitter))
    ) {
      return;
    }
    const dataToSend = {
      name: name,
      role: role,
      email: email,
      employeeId: employeeId,
      designation: designation,
      department: department,
      dob: dob,
      githubLink: github,
      twitterLink: twitter,
      linkedInLink: linkedin,
      profilePicture,
    };

    try {
      setLoading(true);
      const response = await editLogedInUserDetails(dataToSend);
      if (response.error) {
        console.log("Error while updating user details");
        setLoading(false);
        return;
      } else {
        setLoading(false);
        showToaster(true);
        setToasterMessage("Profile updated successful");
        setIsEditable(true);
        localStorage.removeItem("isEditProfile");

        handleModalClose();
        navigate("/");
      }
    } catch (error) {
      console.log("Error while updating user details");
      setLoading(false);
      return error.message;
    }
  };

  function formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  return (
    <div className="addUserFrom-edit">
      <form className="row">
        <div className="profile-images">
          <div className="edit-detle">
            <ImageUpload
              setProfileImage={setProfileImage}
              selectedProfilePic={profilePicture}
              isEditable={!isEditable}
            />
          </div>
        </div>
        <div className="form-group col-12 text-right profil-ed">
          {!isEditable && (
            <button onClick={handleSubmit} className="submit-button">
              Update
            </button>
          )}

          {isEditable && (
            <button className="submit-button edit" onClick={handleEditClick}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="form-group col-12">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            maxLength="50"
            onChange={(event) => setName(event.target.value)}
            disabled={isEditable}
          />
        </div>
        <div className="form-group col-4">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            readOnly={true}
          />
        </div>

        <div className="form-group col-4">
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            maxLength={20}
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            disabled={isEditable}
          />
        </div>

        <div className="form-group col-4">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            value={formatDate(dob)}
            max={formatDate(
              new Date(
                today.getFullYear() - 15,
                today.getMonth(),
                today.getDate()
              )
            )}
            onChange={(event) => setDob(event.target.value)}
            disabled={isEditable}
          />
        </div>
        <div className="form-group col-6">
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            value={designation}
            maxLength="50"
            onChange={(event) => setDesignation(event.target.value)}
            disabled={isEditable}
          />
        </div>
        <div className="form-group col-6">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            value={department}
            maxLength="50"
            onChange={(event) => setDepartment(event.target.value)}
            disabled={isEditable}
          />
        </div>
      </form>
      <form className="row">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            readOnly={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="github">Github:</label>
          <input
            type="url"
            id="github"
            value={github}
            onChange={(event) => setGithub(event.target.value)}
            // readOnly={!isEditable}
            disabled={isEditable}
            className={github && !githubRegex.test(github) ? "invalid" : ""}
          />
          {github && !githubRegex.test(github) && (
            <span className="error">Invalid Github URL</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="twitter">Twitter:</label>
          <input
            type="url"
            id="twitter"
            value={twitter}
            onChange={(event) => setTwitter(event.target.value)}
            disabled={isEditable}
            className={twitter && !twitterRegex.test(twitter) ? "invalid" : ""}
          />
          {twitter && !twitterRegex.test(twitter) && (
            <span className="error">Invalid Twitter URL</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn:</label>
          <input
            type="url"
            id="linkedin"
            value={linkedin}
            onChange={(event) => setLinkedin(event.target.value)}
            disabled={isEditable}
            className={
              linkedin && !linkedinRegex.test(linkedin) ? "invalid" : ""
            }
          />
          {linkedin && !linkedinRegex.test(linkedin) && (
            <span className="error">Invalid LinkedIn URL</span>
          )}
        </div>
      </form>

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

export default UserForm;
