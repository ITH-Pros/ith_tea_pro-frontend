import React from "react";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllProjects,
  getUserAssignedProjects,
  assignUserToProject,
} from "../../services/user/api";
import "./teams.css";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Modals from "../../components/modal";
import { useAuth } from "../../auth/AuthProvider";
import Toaster from "../../components/Toaster";
import { faGithub, faLinkedin, faFacebook , faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default function Teams(props) {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [usersList, setUsersListValue] = useState([]);
  const [projectList, setProjectListValue] = useState([]);
  const [userAssignedProjects, setUserAssignedProjects] = useState([]);
  const [toaster, showToaster] = useState(false);
  const [pageDetails, setPageDetails] = useState({
    currentPage: 1,
    rowsPerPage: 10,
    totalPages: 1,
  });

  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");

  //   numberOfRowsArray

  useEffect(() => {
    onInit();
  }, []);

  function onInit() {
    let options = {
      currentPage: 1,
      rowsPerPage: 10,
    };
    getAndSetAllUsers(options);
  }
  const getAndSetAllUsers = async function (options) {
    setLoading(true);
    try {
		let params = {
			limit: options?.rowsPerPage,
			currentPage: options?.currentPage
		}
      const projects = await getAllUsers({ params });
      setLoading(false);
      if (projects.error) {
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        setUsersListValue(projects.data?.users || []);
        let totalPages = Math.ceil(
          projects.data.totalCount / options?.rowsPerPage
        );
        setPageDetails({
          currentPage: Math.min(options?.currentPage, totalPages),
          rowsPerPage: options?.rowsPerPage,
          totalPages,
        });
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleAddUserToProject = async function (userId) {
    setLoading(true);
    try {
      const projects = await getAllProjects();
      setLoading(false);
      if (projects.error) {
        setToasterMessage(projects?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setProjectListValue(projects.data);
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
    try {
      let dataToSend = {
        params: { userId },
      };
      const userAssignedProjects = await getUserAssignedProjects(dataToSend);
      setLoading(false);
      if (userAssignedProjects.error) {
        setToasterMessage(
          userAssignedProjects?.error?.message || "Something Went Wrong"
        );
        setShowToaster(true);
        return;
      } else {
        setUserAssignedProjects(userAssignedProjects.data);
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
    setSelectedUserId(userId);
    setModalShow(true);
  };

  const GetModalBody = () => {
    return (
      <>
        {projectList &&
          projectList.map((proejct, index) => {
            let checkAlreadyAssigned = userAssignedProjects.find(
              (ele) => ele._id === proejct._id
            );
            return (
              <div key={proejct._id} className="assignPro">
                <input
                  disabled={checkAlreadyAssigned}
                  checked={
                    checkAlreadyAssigned || selectedProjectId === proejct._id
                  }
                  onChange={() => handleSelectProject(proejct._id)}
                  type="checkbox"
                ></input>
                <span> {proejct.name}</span>
              </div>
            );
          })}
      </>
    );
  };
  const handleAssignUserProjectSubmit = async () => {
    setLoading(true);
    try {
      let dataToSend = {
        projectId: selectedProjectId,
        userIds: [selectedUserId],
      };
      const assignRes = await assignUserToProject(dataToSend);
      setLoading(false);
      if (assignRes.error) {
        setToasterMessage(assignRes?.error?.message || "Something Went Wrong");
        setShowToaster(true);
        setModalShow(false);

        return;
      } else {
        setProjectListValue(assignRes.data);
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setModalShow(false);
      return error.message;
    }
    setModalShow(false);
  };

  const CustomPagination = (props) => {
    const { getAndSetAllUsers, setPageDetails, pageDetails } = props;

    const numberOfRowsArray = [10, 20, 30, 40, 50];
    const handleOnChange = (e) => {
      
      let pageNumber = Math.min(
        Math.max(e.target.value, 1),
        pageDetails.totalPages
      );
	  if (pageDetails.currentPage === pageNumber) {
        return;
      }
      let dataToSave = { ...pageDetails, [e.target.name]: pageNumber };
      setPageDetails(dataToSave);
      getAndSetAllUsers(dataToSave);
    };
    // const checkEnterKey = (e) => {
    //   console.log("e.keyCode", e.key);
    //   if (e.keyCode === 13) {
    //     let pageNumber = Math.min(
    //       Math.max(e.target.value, 1),
    //       pageDetails.totalPages
    //     );
    // 	let dataToSave = { ...pageDetails, [e.target.name]: pageNumber};
    // 	setPageDetails(dataToSave);
    //     getAndSetAllUsers(dataToSave);
    //   }
    // };

    const onChangeRowsPerPage = (e) => {
      let dataToSave = {
        ...pageDetails,
        [e.target.name]: parseInt(e.target.value),
		currentPage: 1
      };

      setPageDetails(dataToSave);
      getAndSetAllUsers(dataToSave);
    };
    const changePageNumber = (value) => {
      if (
        pageDetails.currentPage + value <= 0 ||
        pageDetails.currentPage + value > pageDetails.totalPages
      ) {
        return;
      }
      let dataToSave = {
        ...pageDetails,
        currentPage: pageDetails.currentPage + value,
      };
      setPageDetails(dataToSave);
      getAndSetAllUsers(dataToSave);
    };

    return (
      <div className="pagination ">
        <i
          className="fa fa-angle-left pagination-arrow left-arrow"
          aria-hidden="true"
          onClick={() => changePageNumber(-1)}
        ></i>
        <input className="pagination-input"
          type="number"
          value={pageDetails.currentPage}
          name="currentPage"
          //   onKeyDown={checkEnterKey}
          onChange={handleOnChange}
          autoFocus
        /> 
       <span className="pagination-input" >/</span><span className="pagination-input"> {pageDetails.totalPages}</span>
        <i
          className="fa fa-angle-right pagination-arrow right-arrow"
          aria-hidden="true"
          onClick={() => changePageNumber(1)}
        ></i>
        <span className="page-per-view"> Per Page View : </span>
        <select className="pagination-select"
          onChange={onChangeRowsPerPage}
          name="rowsPerPage"
          value={pageDetails.rowsPerPage}
        >
          {numberOfRowsArray.map((ele, index) => {
            return (
              <option key={ele} value={ele}>
                {ele}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  return (
    <>
     <div className="rightDashboard">
        <h1 className="h1-text">
          <i className="fa fa-users" aria-hidden="true"></i>Team Members
        </h1>
        <div className="container-team">
          {userDetails.role === "SUPER_ADMIN" && (
            <div
              key="AddNewUser"
              className="box "
              style={{ height: 283, width: 274 }}
            >
              <div className="content">
                <Link
                  to={{
                    pathname: "/user/add",
                  }}
                >
                  <i
                    className="fa fa-user-plus fa-3x addBtn "
                    title="Add User"
                    aria-hidden="true"
                  ></i>
                </Link>
              </div>
            </div>
          )}
          {usersList &&
            usersList.map((user) => {
              return (
                <div key={user._id} className="box">
                  <div className="top-bar"></div>
                  <div className="top">
                    <Link
                      to={{
                        pathname: "/user/view/" + user._id,
                      }}
                    >
                      {/* <i
                        className="fa fa-check-circle"
                        id="heart-btn-1"
                        style={{ cursor: "grab" }}
                        aria-hidden="true"
                      ></i> */}
                      {/* <i className="fa fa-plus-circle fa-3x addBtn" aria-hidden="true" ></i> */}
                    </Link>
                    {/* <label className="heart"></label> */}
                  </div>
                  <div className="content">
                    <img
                      src="https://images.pexels.com/photos/2570145/pexels-photo-2570145.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                      alt=""
                    />
                    <strong>{user.name} ({user.role})</strong>
                  
					<p>{user.email}</p>
					<p>{user.employeeId} ({user.department}) </p>
					  <p>{user.designation}</p>
					  <p>{user.wings}</p>
                </div>

				<div>
				{user.github &&
      <FontAwesomeIcon icon={faGithub} />
    }
	{user.linkedin &&
      <FontAwesomeIcon icon={faLinkedin} />
    }
	{user.facebook &&
      <FontAwesomeIcon icon={faFacebook} />
    }
	{user.twitter &&
      <FontAwesomeIcon icon={faTwitter} />
    }
    {/* <FontAwesomeIcon className="brand-icon" icon={faLinkedin} />
    <FontAwesomeIcon  className="brand-icon" icon={faFacebook} />
	<FontAwesomeIcon className="brand-icon" icon={faTwitter} /> */}
  </div>

                  {userDetails.role === "SUPER_ADMIN" && "ADMIN"  && (
                    <div className="btn">
                      <button
                        className="btn-glow margin-right btn-color"
                        onClick={() => {
                          handleAddUserToProject(user._id);
                        }}
                      >
                        {" "}
                        <i className="fa fa-check " aria-hidden="true"></i>Assign
                      </button>

                      <Link
                        to={{
                          pathname: "/rating",
                        }}
                        state={{ userId: user._id }}
                      >
                        Add Rating
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      

      <CustomPagination
        getAndSetAllUsers={getAndSetAllUsers}
        pageDetails={pageDetails}
        setPageDetails={setPageDetails}
      />

      {loading ? <Loader /> : null}
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}

      <Modals
        modalShow={modalShow}
        modalBody={<GetModalBody />}
        heading="Assign Project"
        onHide={() => setModalShow(false)}
        submitBtnDisabled={!selectedProjectId}
        onClick={handleAssignUserProjectSubmit}
      />
      </div>
    </>
  );
}
