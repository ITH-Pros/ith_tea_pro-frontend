/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import avtar from "../../assests/img/avtar.png";
import { BsLinkedin, BsGithub, BsTwitter } from "react-icons/bs";
import "./index.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";
import Toaster from "../../components/Toaster";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  Row,
  Container,
  Nav,
  Dropdown,
  Card,
  Button,
  Badge,
  Tab,
  Tabs,
  Col,
  Table,
} from "react-bootstrap";
import { getUserReportData ,getAllUsersWithAdmin, getUserDetailsByUserId} from "../../services/user/api";
import { useAuth } from "../../auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Avatar } from "antd";
const customStyles = {
  option: (provided) => ({
    ...provided,
    padding: 5,
    fontSize:'13px'
  }),

  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    fontSize:'13px',
    borderRadius: "5px",
    color: "#767474",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: 14,
    borderRadius: "0px 0px 10px 10px",
    boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.05)",
    top: "40px",
    padding: "5px",
    zIndex: "2",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0px 10px",
  }),
};
export default function TeamReport(props) {
  const [teamWorkList, setTeamWorkList] = useState([]);
const [userDetails,setUserDetails]=useState([])

  const [selectedOption, setSelectedOption] = useState(null);

  const [usersList, setUsersListValue] = useState([]);
  const [toaster, showToaster] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('task');
  const [loading, setLoading] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");
  useEffect(() => {
    console.log("Team Report");
    getUserReport();
    getAllMembers();
  }, []);



  useEffect(() => {
    if(userDetails?.role==='CONTRIBUTOR'){
      setShowTags(false)
    }else{
      setShowTags(true)

    }
  }, [userDetails]);

  useEffect(() => {
 
   
    if (selectedOption) {
      getUserDetails(selectedOption.value);

      getUserReport(selectedOption?.value, selectedEvent)
      
    } 
  
  }, [selectedOption, selectedEvent]);
  const getUserDetails = async (id) => {
    setLoading(true);
    try {
      let params = {
        userId:id
      };
      const userDetails = await getUserDetailsByUserId({ params });
      setLoading(false);
      if (userDetails.error) {
        setToasterMessage(userDetails?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setUserDetails(userDetails.data);
     
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };
  function convertToUTCDay(dateString) {
    let utcTime = new Date(dateString);
    utcTime = new Date(utcTime.setUTCHours(0,0,0,0))
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    const timeZoneOffsetMs = timeZoneOffsetMinutes * 60 * 1000;
    const localTime = new Date(utcTime.getTime() + timeZoneOffsetMs);
    let localTimeString = new Date(localTime.toISOString());
    console.log("==========", localTimeString)
    return localTimeString
  }
  

  const getUserReport = async (id, type) => {
    setLoading(true);

    console.log(id)
    if (!id || !type) {
      return;
    }
    let dataToSend = {
      userId: id,
     
    };
    if (type) {
      if (type === 'task') {
        dataToSend.todayTasks=true
        dataToSend.currentDate = convertToUTCDay(new Date());
      }else if (type === 'overduetask') {
        dataToSend.overDueTasks=true
      }else if (type === 'pendingtask') {
        dataToSend.pendingRatingTasks=true
      }else if (type === 'delaytask') {
        dataToSend.isDelayRated=true
      } else {
        dataToSend.adhocTasks = true;
      }
    }
    try {
      const res = await getUserReportData(dataToSend);
    setLoading(false);

      if (res.error) {
        console.log("Error while getting team work list");
      } else {
        setTeamWorkList(res?.data);
      }
    } catch (error) {
    setLoading(false);

      return error.message;
    }
  };
  const getAllMembers = async function () {
  
    setLoading(true);
    try {
  
      const users = await getAllUsersWithAdmin();
      setLoading(false);
      if (users.error) {
        setToasterMessage(users?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        console.log(users?.data?.users)
        setUsersListValue(users?.data?.users || []);
        if (localStorage.getItem('selectedOptions')) {
          setSelectedOption(JSON.parse(localStorage.getItem('selectedOptions')))

        }
       
      }
    } catch (error) {
      setLoading(false);
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      return error.message;
    }
  };
  const handleTabSelect = (eventKey) => {
    setTeamWorkList([])
    console.log(eventKey,'----------------------------------eventKey')
    setSelectedEvent(eventKey);


  }

  const handleSelectChange = (selectedOption) => {
    localStorage.setItem('selectedOptions',JSON.stringify(selectedOption))
    getUserDetails(selectedOption.value);
    setSelectedOption(selectedOption);
  };
 


  return (
    <div className="rightDashboard" style={{ marginTop: "6%" }}>
      <div>
      <div className={selectedOption?'c_card':'v_card'}>
        <Card className="py-2 px-2 " style={{width:'300px'}}>
          <Row>
            <Col lg="12" className="m-auto">
              <Select
                styles={customStyles}
                  value={selectedOption}
                  onChange={handleSelectChange}
          

                options={usersList}
                placeholder="Select Member"
              />
              
                     {/* <Select
                      styles={customStyles}
                      onChange={(e) => onSelectData(e, "projectIds")}
                      value={projectIds}
                      isMulti
                      getOptionLabel={(options) => options["name"]}
                      getOptionValue={(options) => options["_id"]}
                      options={projects}
                      isDisabled={handleProjectId}
                    /> */}
            </Col>
          </Row>
        </Card>
      </div>
      <div style={{clear:'both'}}></div>
     { selectedOption&&  <Card className="py-4 px-4" style={{ borderRadius:'10px', border:'0px'}}>
          <Row className="align-middle d-flex">
            <Col lg="1">
              <div className="profile-userpic">
                <img src={userDetails?.profilePicture||avtar} />{" "}
              </div>
            </Col>
            <Col lg="5" className="user_details  py-2">
              <h1>{userDetails?.name||'--'} ({ userDetails?.role||'--'})</h1>
              <h2>{userDetails?.department||'--'} - ({userDetails?.designation||'--'})</h2>
              <p>{userDetails?.email||'--'}</p>
            </Col>
            <Col lg="3 py-4">
              {/* <p>
                Lead - <Badge bg="primary">Vi   jay Pandey</Badge>
              </p> */}
            </Col>
            <Col lg="3" className="px-5 py-2 text-end">
             
            <div className="team-socail">
                        {userDetails?.githubLink && (
                          <a
                            href={userDetails?.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faGithub} />
                          </a>
                        )}

                        {userDetails?.linkedInLink && (
                          <a
                            href={userDetails?.linkedInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faLinkedin} />
                          </a>
                        )}

                        {userDetails?.twitterLink && (
                          <a
                            href={userDetails?.twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon icon={faTwitter} />
                          </a>
                        )}
                      </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg={12} id="task_user">
              <Tabs
                defaultActiveKey="task"
                id="uncontrolled-tab-example"
                className="mb-3"
                onSelect={handleTabSelect}

              >
                <Tab 
                  eventKey="task"
                  disabled={selectedEvent==="task"}
                  title={
                    <span>
                      Task {selectedEvent==='task'&&<span className="text-muted">({teamWorkList?.length})</span>}
                    </span>
                  }
                >
                  <div>
                    <Table responsive="md" className="mb-0">
                      <tbody>
                        {teamWorkList?.map((team,index) => [
                          <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/" className="text-muted">
                               {team?.title||'--'}
                              </Link>
                            </p>
                          </td>
                         <td style={{ width: "150px" }}>
                              <Badge bg="primary">Due : {team?.dueDate?.split('T')[0]||'--'}</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Status :</b>{team?.status||'--'}
                            </small>
                            </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Lead :</b>{team?.lead[0]?.name||'--'}
                            </small>
                            </td>
                            {team?.completedDate&& <td style={{ width: "150px" }}>
                              <Badge bg="success">Completed : {team?.completedDate?.split('T')[0]||'--'}</Badge>
                          </td>}
                            { team?.isRated&& <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Rating :</b>{team?.rating||'--'}
                            </small>
                          </td>}
                        </tr>
                        ])}
                      <div className="no_data_found">  {!teamWorkList?.length && <p>No Tasks Found</p>}</div> 
                        
                      
                      </tbody>
                    </Table>
                    
                  </div>
                </Tab>

                <Tab
                  eventKey="overduetask"
                  disabled={selectedEvent==="overduetask"}

                  title={
                    <span>
                      Over Due Tasks  {selectedEvent==='overduetask'&&<span className="text-muted">({teamWorkList?.length})</span>}
                    </span>
                  }
                >
                  <div>
                  <Table responsive="md" className="mb-0">
                      <tbody>
                        {teamWorkList?.map((team,index) => [
                          <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/" className="text-muted">
                               {team?.title||'--'}
                              </Link>
                            </p>
                          </td>
                         <td style={{ width: "150px" }}>
                              <Badge bg="primary">Due : {team?.dueDate?.split('T')[0]||'--'}</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Status :</b>{team?.status||'--'}
                            </small>
                            </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Lead :</b>{team?.lead[0]?.name||'--'}
                            </small>
                            </td>
                            {team?.completedDate&& <td style={{ width: "150px" }}>
                              <Badge bg="success">Completed : {team?.completedDate?.split('T')[0]||'--'}</Badge>
                          </td>}
                            { team?.isRated&& <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Rating :</b>{team?.rating||'--'}
                            </small>
                          </td>}
                        </tr>
                        ])}
                      <div className="no_data_found">  {!teamWorkList?.length && <p>No Tasks Found</p>}</div> 
                        
                      
                      </tbody>
                    </Table>
                  </div>
                </Tab>
              { showTags&& <Tab
                  eventKey="pendingtask"
                  disabled={selectedEvent==="pendingtask"}
                  title={
                    <span>
                      Pending Rating Tasks  {selectedEvent==='pendingtask'&&<span className="text-muted">({teamWorkList?.length})</span>}
                    </span>
                  }
                >
                  <div>
                  <Table responsive="md" className="mb-0">
                      <tbody>
                        {teamWorkList?.map((team,index) => [
                          <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/" className="text-muted">
                               {team?.title||'--'}
                              </Link>
                            </p>
                          </td>
                         <td style={{ width: "150px" }}>
                              <Badge bg="primary">Due : {team?.dueDate?.split('T')[0]||'--'}</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Status :</b>{team?.status||'--'}
                            </small>
                            </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Lead :</b>{team?.lead[0]?.name||'--'}
                            </small>
                            </td>
                            {team?.completedDate&& <td style={{ width: "150px" }}>
                              <Badge bg="success">Completed : {team?.completedDate?.split('T')[0]||'--'}</Badge>
                          </td>}
                            { team?.isRated&& <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Rating :</b>{team?.rating||'--'}
                            </small>
                          </td>}
                        </tr>
                        ])}
                      <div className="no_data_found">  {!teamWorkList?.length && <p>No Tasks Found</p>}</div> 
                        
                      
                      </tbody>
                    </Table>
                  </div>
                </Tab>}
                 { showTags&& <Tab
                  eventKey="delaytask"
                  disabled={selectedEvent==="delaytask"}
                  title={
                    <span>
                      Delay Rated  {selectedEvent==='delaytask'&&<span className="text-muted">({teamWorkList?.length})</span>}
                    </span>
                  }
                >
                  <div>
                  <Table responsive="md" className="mb-0">
                      <tbody>
                        {teamWorkList?.map((team,index) => [
                          <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/" className="text-muted">
                               {team?.title||'--'}
                              </Link>
                            </p>
                          </td>
                         <td style={{ width: "150px" }}>
                              <Badge bg="primary">Due : {team?.dueDate?.split('T')[0]||'--'}</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Status :</b>{team?.status||'--'}
                            </small>
                            </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Lead :</b>{team?.lead[0]?.name||'--'}
                            </small>
                            </td>
                            {team?.completedDate&& <td style={{ width: "150px" }}>
                              <Badge bg="success">Completed : {team?.completedDate?.split('T')[0]||'--'}</Badge>
                          </td>}
                            { team?.isRated&& <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Rating :</b>{team?.rating||'--'}
                            </small>
                          </td>}
                        </tr>
                        ])}
                      <div className="no_data_found">  {!teamWorkList?.length && <p>No Tasks Found</p>}</div> 
                        
                      
                      </tbody>
                    </Table>
                  </div>
                </Tab>}
                <Tab
                  eventKey="extracontribution"
                  disabled={selectedEvent==="extracontribution"}
                  title={
                    <span>
                      Extra Contribution{" "}
                      {selectedEvent==='extracontribution'&&<span className="text-muted">({teamWorkList?.length})</span>}
                    </span>
                  }
                >
                  <div>
                  <Table responsive="md" className="mb-0">
                      <tbody>
                        {teamWorkList?.map((team,index) => [
                          <tr>
                          <td style={{ width: "150px" }}>
                            <p className="text-truncate">
                              <Link to="/" className="text-muted">
                               {team?.title||'--'}
                              </Link>
                            </p>
                          </td>
                         <td style={{ width: "150px" }}>
                              <Badge bg="primary">Due : {team?.dueDate?.split('T')[0]||'--'}</Badge>
                          </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Status :</b>{team?.status||'--'}
                            </small>
                            </td>
                          <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Lead :</b>{team?.lead[0]?.name||'--'}
                            </small>
                            </td>
                            {team?.completedDate&& <td style={{ width: "150px" }}>
                              <Badge bg="success">Completed : {team?.completedDate?.split('T')[0]||'--'}</Badge>
                          </td>}
                            { team?.isRated&& <td style={{ width: "150px" }}>
                            <small className="text-muted">
                              <b>Rating :</b>{team?.rating||'--'}
                            </small>
                          </td>}
                        </tr>
                        ])}
                      <div className="no_data_found">  {!teamWorkList?.length && <p>No Tasks Found</p>}</div> 
                        
                      
                      </tbody>
                    </Table>
                  </div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card>}
      </div>
      {loading ? <Loader /> : null}
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />)}
    </div>
  );
}
