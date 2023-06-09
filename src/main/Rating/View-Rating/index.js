/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import "./index.css";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Row, Table } from "react-bootstrap";
import { getRatingList, getRatings } from "../../../services/user/api";
import { useAuth } from "../../../auth/AuthProvider";
import RatingBox from "../../../components/ratingBox";
import Loader from "../../../components/Loader";
import Toaster from "../../../components/Toaster";
import AddRating from "../add-rating";
import MyCalendar from "./weekCalendra";

var month = moment().month();
let currentYear = moment().year();

export default function Dashboard(props) {
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
  let months = moment().year(Number)?._locale?._months;
  let years = [2022, 2023, 2024, 2025];

  useEffect(() => {
    // getAllRatingslist();
    onInit();
    if (userDetails?.role === "SUPER_ADMIN" || userDetails?.role === "ADMIN") {
      setTeamView(true);
    }
  }, []);

  // set the isWeekendChecked state variable based on the weekend value
  //  useEffect(() => {
  //   setIsWeekendChecked(weekend);
  // }, [weekend]);

  const getAllRatingslist = async function (data) {
    setLoading(true);
    try {
      // let { selectedProject, selectedUser, selectedDate } = ratingForm;

      const dataToSend = {
        projectId: '' ,
        userId: '',
        fromDate:'' ,
        toDate: '',
      };

      const response = await getRatingList();
      if (response.error) {
        setToasterMessage(response.error);
        setShowToaster(true);
        console.log("error", response.error);
      } else {
        console.log(response.data,';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
      }
    } catch (error) {
      console.log("error", error);
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
        console.log(rating.data);
        setRatings([...rating.data]);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
    }
  }

  return (
    <div>
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
            <div className="wrap  rating_btn" style={{ height: "100%" }}>
              {userDetails?.role !== "CONTRIBUTOR" && (
                <AddRating handleOnInit={onInit} />
              )}
            </div>
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
                    <option value="" disabled>
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
    const dayOfWeek = date.getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekendValue = dayOfWeek === 0 || dayOfWeek === 6;
    if (ratingCommentObj) {
      return (
        <RatingBox
          key={index}
          index={index}
          getAllRatings={getAllRatings}
          ratingCommentObj={ratingCommentObj}
          className={weekendValue ? "weekendBox" : ""}
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
          {userDetails?.role === "CONTRIBUTOR" ||
          new Date(dateToSend) > new Date() ? (
            <span
              style={{
                padding: "1px",
                paddingLeft: "20px",
                paddingRight: "6px",
              }}
              className={
                weekendValue ? "weekendBox input_dashboard" : "input_dashboard"
              }
              onClick={()=>console.log(user)}
            ></span>
          ) : (
            <>
              <span
                style={{
                  padding: "1px",
                  paddingLeft: "20px",
                  paddingRight: "6px",
                }}
                className={
                  weekendValue ? "weekendBox input_dashboard" : "input_dashboard"
                }
              onClick={()=>console.log(user)}
              ></span>
            </>
          )}
        </td>
      );
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
        <MyCalendar />
      )}
    </div>
  );
}
