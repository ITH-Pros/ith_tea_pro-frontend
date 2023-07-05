/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";

import { getUserDetailsByUserId } from "../../../services/user/api";
import "./index.css";
import { toast } from "react-toastify";

export default function ViewUser(props) {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    setLoading(true);
    try {
      let params = {
        userId,
      };
      const userDetails = await getUserDetailsByUserId({ params });
      setLoading(false);
      if (userDetails.error) {
        toast.dismiss()
      toast.info(userDetails?.message || "Something Went Wrong");
        // setShowToaster(true);
        return;
      } else {
        setUserDetails(userDetails.data);
      }
    } catch (error) {
      toast.dismiss()
      toast.info(error?.error?.message || "Something Went Wrong");
      // setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  function toTitleCase(str) {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt?.charAt(0)?.toUpperCase() + txt?.substr(1)?.toLowerCase();
    });
  }

  return (
    <>
      <div className="emp-profile rightDashboard">
        <form method="post">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img">
                {userDetails?.profilePicture && (
                  <img src="userDetails?.profilePicture" alt="" />
                )}
                {!userDetails?.profilePicture && (
                  <img
                    src="https://www.ispsd.com/wp-content/uploads/2013/02/wpid-web-user.jpg"
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-head">
                <h5>{toTitleCase(userDetails?.name)}</h5>
                <h6>{userDetails?.designation}</h6>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      id="home-tab"
                      data-toggle="tab"
                      href="#home"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      About
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="profile-work">
                <p>WORK LINK</p>
                {userDetails?.email}{" "}
                <i
                  className="fa fa-copy"
                  title="copy email"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigator.clipboard.writeText(userDetails?.email);
                    toast.dismiss()
      toast.info("Copied Succesfully");
                    // setShowToaster(true);
                  }}
                ></i>
                <p>SKILLS</p>
                {userDetails?.wings}
              </div>
            </div>
            <div className="col-md-8">
              <div className="tab-content profile-tab" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <label>Employee Id</label>
                    </div>
                    <div className="col-md-6">
                      <p>
                        {userDetails?.employeeId || "--"}
                        <i
                          className="fa fa-copy"
                          title="copy employee id"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              userDetails?.employeeId
                            );
                            toast.dismiss()
      toast.info("Copied Succesfully");
                            // setShowToaster(true);
                          }}
                        ></i>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Joining Date</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userDetails?.createdAt?.split("T")[0]}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Department</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userDetails?.department}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Phone</label>
                    </div>
                    <div className="col-md-6">
                      <p>9193****00</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Profession</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userDetails?.wings} Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {loading ? <Loader /> : null}
    </>
  );
}
