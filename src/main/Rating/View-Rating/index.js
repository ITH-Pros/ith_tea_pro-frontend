/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import "./index.css";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Offcanvas, Row, Table } from "react-bootstrap";
import { getRatings, verifyManager } from "../../../services/user/api";
import { useAuth } from "../../../auth/AuthProvider";
import RatingBox from "../../../components/ratingBox";
import Loader from "../../../components/Loader";
import Toaster from "../../../components/Toaster";
import MyCalendar from "./weekCalendra";
import RatingModalBody from "../add-rating-modal";
import TasksModalBody from "../add-rating-modal/viewTaskModal";

var month = moment().month();
let currentYear = moment().year();

export default function Dashboard(props) {

  const ratings = [2, 3, 4, 5, 4, 3, 2, 4, 5, 6];

  const [ratingsArray, setRatings] = useState([]);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamView, setTeamView] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const { userDetails } = useAuth();
  const [days, setDays] = useState(moment().daysInMonth());
  const [monthUse, setMonth] = useState(moment().format("MMMM"));
  const [yearUse, setYear] = useState(currentYear);
  // const [isWeekendChecked, setIsWeekendChecked] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  let months = moment().year(Number)?._locale?._months;
  let years = [2022, 2023, 2024, 2025];
  const [ratingData,setRatingData] = useState({
    user: {},
    date: '',
    month: '',
    year: '',
  });
  const [raitngForDay, setRatingForDay] = useState()

  useEffect(() => {
    const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
    // getAllRatingslist();
    // onInit();
    if (allowedRoles.includes(userDetails?.role)) {
      setTeamView(true);
    }
  }, []);

  useEffect(() => {
    if (modalShow === false && teamView){
        onInit()
      }
  }, [modalShow , teamView])

  const isRatingAllowed = async function (user,date,month,year) {
    setLoading(true);
    // // console.log(user,date,month,year)
    let setDate = date
    let setMonth = month
    if(date<10){
     setDate = "0" +date
    }
    if(month<10){
      setMonth = "0" + month
     }
    try {      
      const dataToSend = {
        userId: user._id 
      };
      const response = await verifyManager(dataToSend);
      if (response.error) {
        setToasterMessage(response.message);
        setShowToaster(true);
        // console.log("error", response );
      } else {
        if (response?.data?.ratingAllowed === true) {
          setRatingData(prevRatingData => ({
            ...prevRatingData,
            user: user,
            date: date,
            month: month,
            year: year,
          }))
          setModalShow(true)
        } else {
          setToasterMessage('You are not allowed to give rating.')
          setShowToaster(true)
        }
        // // console.log('error in verify manager')
      }
    } catch (error) {
      // console.log("error", error);
    }
    setLoading(false);
  };

  const isWeekend = (dayOfWeek) => {
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  function onInit() {
    let dataToSend = {
      month: months.indexOf(monthUse) + 1,
      year: yearUse,
    };
    getAllRatings(dataToSend);
  }

  const onchangeMonth = (e) => {
    setMonth(e.target.value);
    let dataToSend = {
      month: months.indexOf(e.target.value) + 1,
      year: yearUse,
    };
    let monthDays = new Date(yearUse, months.indexOf(e.target.value) + 1, 0);
    setDays(monthDays.getDate());
    getAllRatings(dataToSend);
  };

  const onChangeYear = (e) => {
    setYear(e.target.value);
    let dataToSend = {
      month: months.indexOf(monthUse) + 1,
      year: e.target.value,
    };
    getAllRatings(dataToSend);
  };

  async function getAllRatings(data) {
    setLoading(true);
    try {
      if (!data) {
        data = {
          month: months.indexOf(monthUse) + 1,
          year: yearUse,
        };
      }
      const rating = await getRatings(data);
      setLoading(false);
      if (rating.error) {
        setToasterMessage(rating?.message || "Something Went Wrong");
        setShowToaster(true);
      } else {
        // // console.log(rating.data);
        setRatings([...rating.data]);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
    }
  }

  const hideModal = () =>{
    setModalShow(false)
    localStorage.removeItem('userId')
  }

  return (
    <div>
      <Offcanvas  
      className="Offcanvas-modal"
      style={{width:'500px'}}
      show={modalShow}
      onHide={() => hideModal()}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title> {userDetails?.role !== 'CONTRIBUTOR' ? raitngForDay >0 ? ('View Tasks') : ( 'Add Rating' ): 'View Tasks'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body  >
      {userDetails?.role !== 'CONTRIBUTOR' ? <RatingModalBody  data={ratingData} setModalShow={setModalShow} raitngForDay={raitngForDay} />: <TasksModalBody data={ratingData} setModalShow={setModalShow} raitngForDay={raitngForDay}/>}
      </Offcanvas.Body>
    </Offcanvas>
      <div className="dashboard_camp">
        <Row>
          <Col lg={12}>
            {(userDetails?.role === "LEAD" ||
              userDetails?.role === "CONTRIBUTOR") && (
              <button
                className="addTaskBtn"
                onClick={() => setTeamView(!teamView)}
                style={{ position: "absolute", right: "40px", zIndex: "9" }}
              >
                {teamView ? "Self view" : "Team View"}{" "}
              </button>
            )}
            {/* <div className="wrap  rating_btn" style={{ height: "100%" }}>
              {userDetails?.role !== "CONTRIBUTOR" && (
                <AddRating handleOnInit={onInit} />
              )}
            </div> */}
          </Col>
        </Row>
      </div>

      {teamView ? (
        <div className="dashboard_camp">
          <div className=" ">
            <div className="d-flex" style={{ marginTop: "10px" }}>
              <h5 className="text-center h5cls">
                <p
                  style={{
                    marginRight: "10px",
                    marginTop: "13px",
                    fontSize: "14",
                  }}
                >
                  Ratings for
                </p>
                <Form.Group as={Col} md="2" controlId="select_month">
                  <Form.Control
                    className="month-drop-select"
                    required
                    as="select"
                    type="select"
                    name="select_team"
                    onChange={onchangeMonth}
                    value={monthUse}
                  >
                    <option defaultValue="" disabled>
                      Select Month
                    </option>
                    {months.map((monthh, index) => (
                      <option
                        value={monthh}
                        key={monthh}
                        disabled={index > month && yearUse >= currentYear}
                      >
                        {monthh}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="select_year">
                  <Form.Control
                    className="year-drop-select"
                    required
                    as="select"
                    type="select"
                    name="select_team"
                    onChange={onChangeYear}
                    value={yearUse}
                  >
                    <option value="" disabled>
                      Select Year
                    </option>
                    {years.map((year) => (
                      <option
                        value={year}
                        key={year}
                        disabled={year > currentYear}
                      >
                        {year}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </h5>
            </div>
            <div className="tableFixHead">
            <Table responsive>
              <thead>
                <tr>
                  <th style={{ width: "140px", position: "sticky", left: "0", backgroundColor: "#fff"  }}>Name</th>
                  {/* <th>Day</th> */}
                  {Array(days)
  .fill(0)
  .map((rating, index) => {
    const date = new Date(yearUse, months.indexOf(monthUse), index + 1);
    const dayOfWeek = date.getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekend = isWeekend(dayOfWeek);
    const className = weekend ? "weekend" : "";

    return (
      <th key={index} className={className}>
        <span>{index + 1 < 10 ? "0" : ""}{index + 1}</span>
        <br></br>
        <span>{dayNames[dayOfWeek]}</span>
      </th>
    );
})}
                  <th style={{ color: "green" }}>Average</th>
                </tr>
              </thead>
              <tbody>
                {ratingsArray.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className="user_names text-truncate "
                        style={{ width: "130px", position: "sticky", left: "0" , backgroundColor: "#fff" , zIndex: "9" }}
                      >
                        {user.name}
                      </td>

                      {Array(days)
  .fill(0)
  .map((day, index) => {
    let ratingUserObj = user.ratings;
    let ratingCommentObj = ratingUserObj?.find(
      (el) => el.date - 1 === index
    );

    const date = new Date(
      yearUse,
      months.indexOf(monthUse),
      index + 1
    );
    const dayOfWeek = date.getDay()
    const weekendValue = dayOfWeek === 0 || dayOfWeek === 6;
    if (ratingCommentObj) {
      return (
        <RatingBox
          key={index}
          index={index}
          getAllRatings={getAllRatings}
          ratingCommentObj={ratingCommentObj}
          className={weekendValue ? "weekendBox" : ""}
          month={months.indexOf(monthUse) + 1}
          year={yearUse}
          user={user}
          setTaskModalShow={setModalShow}
          setRatingData={setRatingData}
          setRatingForDay = {setRatingForDay}
        />
      );
    } else {
      let dateToSend = `${yearUse}-${
        months.indexOf(monthUse) + 1 <= 9
          ? "0" + (months.indexOf(monthUse) + 1)
          : months.indexOf(monthUse) + 1
      }-${index + 1 <= 9 ? "0" + (index + 1) : index + 1}`;
      return (
        <td key={index}>
          {userDetails?.role === 'CONTRIBUTOR' || new Date(dateToSend) > new Date() ? (
            <span
              style={{
                padding: '2px 15px',
              }}
              className={weekendValue ? 'weekendBox input_dashboard' : 'input_dashboard'}
            ></span>
          ) : (
            <>
              <span
                style={{
                  padding: '2px 15px',
                }}
                className={weekendValue ? 'weekendBox input_dashboard' : 'input_dashboard'}
                // onClick={()=>{// console.log(user,'index',index+1,monthUse,yearUse);}}
                onClick={() => {
                  isRatingAllowed(user, index + 1, months.indexOf(monthUse) + 1, yearUse); setRatingForDay(0)
                }}
              >
                {!weekendValue && '?'}
              </span>
            </>
          )}
        </td>
      )
    }
  })}
                      <td className="userAverage">
                        {user.monthlyAverage
                          ? Math.round(user.monthlyAverage * 100) / 100
                          : "NA"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </div>
          </div>

          {loading ? <Loader /> : null}
          {toaster && (
            <Toaster
              message={toasterMessage}
              show={toaster}
              close={() => showToaster(false)}
            />
          )}
          <div></div>
        </div>
      ) : (
        <div>
        { !teamView && (
          <MyCalendar />
        )}
          </div>
      )}
    </div>
  );
}
