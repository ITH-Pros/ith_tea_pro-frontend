/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import "./index.css";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Offcanvas, Row, Table } from "react-bootstrap";
import { getRatings, verifyManager } from "@services/user/api";
// import { useAuth } from "../../../auth/AuthProvider";
import RatingBox from "../ratingBox";
import Loader from "../Shared/Loader";
import MyCalendar from "./weekCalendra";
import RatingModalBody from "../add-rating-modal/index.jsx";
import TasksModalBody from "../add-rating-modal/viewTaskModal";
import { toast } from "react-toastify";
import { useAuth } from "../../utlis/AuthProvider";
import { useMutation, useQuery } from "react-query";

var month = moment().month();
let currentYear = moment().year();

export default function Dashboard(props) {
  const [loading, setLoading] = useState(false);
  const [teamView, setTeamView] = useState(undefined);
  const { userDetails } = useAuth();
  const [days, setDays] = useState(moment().daysInMonth());
  const [monthUse, setMonth] = useState(moment().format("MMMM"));
  const [yearUse, setYear] = useState(currentYear);
  const [modalShow, setModalShow] = useState(false);
  let months = moment().year(Number)?._locale?._months;
  let years = [2022, 2023, 2024, 2025];
  const [ratingData, setRatingData] = useState({
    user: {},
    date: "",
    month: "",
    year: "",
  });
  const [raitngForDay, setRatingForDay] = useState();

  useEffect(() => {
    const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
    if (allowedRoles.includes(userDetails?.role)) {
      setTeamView(true);
    }
    else {
      setTeamView(false)
    }
  }, []);

  useEffect(() => {
    if (modalShow === false && teamView) {
      onInit();
    }
  }, [modalShow, teamView]);

  const isRatingAllowed = async function (user, date, month, year) {
    let setDate = date;
    let setMonth = month;
    if (date < 10) {
      setDate = "0" + date;
    }
    if (month < 10) {
      setMonth = "0" + month;
    }
    const dataToSend = {
      userId: user._id,
    };
    verifyManagerMutation.mutate(dataToSend);
  };

  const verifyManagerMutation = useMutation(
    async (dataToSend) => {
      const response = await verifyManager(dataToSend);
      if (response.error) {
        throw new Error(response.message);
      } else {
        return response.data;
      }
    },
    {
      onError: (error) => {
        toast.dismiss();
        toast.info(error?.message || "Something Went Wrong");
      },
      onSuccess: (data) => {
        if (data?.ratingAllowed === true) {
          setModalShow(true);
        } else {
          if (response.error) {
            toast.dismiss();
            toast.info(response.message);
          } else {
            if (response?.data?.ratingAllowed === true) {
              setRatingForDay();
              setRatingData((prevRatingData) => ({
                ...prevRatingData,
                user: user,
                date: date,
                month: month,
                year: year,
              }));
              setModalShow(true);
            } else {
              toast.dismiss();
              toast.info("You are not allowed to give rating.");
            }
          }
        }
      },
    }
  );

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
    if (!data) {
      data = {
        month: months.indexOf(monthUse) + 1,
        year: yearUse,
      };
    }
  }

  const {
    data: ratingsArray,
    isLoading,
    refetch,
  } = useQuery(
    ["getAllRatings", months.indexOf(monthUse) + 1, yearUse],
    async () => {
      const data = {
        month: months.indexOf(monthUse) + 1,
        year: yearUse,
      };
      const rating = await getRatings(data);
      if (rating.error) {
        throw new Error(rating?.message || "Something Went Wrong");
      } else {
        return rating.data;
      }
    }
  );

  const hideModal = () => {
    setModalShow(false);
    localStorage.removeItem("userId");
    // setRatingForDay();
  };

  return (
    <div>
      <Offcanvas
        className="Offcanvas-modal"
        style={{ width: "500px" }}
        show={modalShow}
        onHide={() => hideModal()}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {" "}
            {userDetails?.role !== "CONTRIBUTOR"
              ? raitngForDay >= -1
                ? "View Tasks"
                : "Add Rating"
              : "View Tasks"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {userDetails?.role !== "CONTRIBUTOR" ? (
            <RatingModalBody
              data={ratingData}
              setModalShow={setModalShow}
              raitngForDay={raitngForDay}
            />
          ) : (
            <TasksModalBody
              data={ratingData}
              setModalShow={setModalShow}
              raitngForDay={raitngForDay}
            />
          )}
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
            <div class="table-fixed-column-outter">
              <div class="table-fixed-column-inner">
                <div className="tableFixHead">
                  <Table
                    responsive
                    className="table-fixed-column table-fixed-column table table-bordered table-striped"
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            width: "100px",
                            position: "sticky",
                            left: "0",
                            display: "none",
                            backgroundColor: "#fff",
                          }}
                        ></th>
                        {/* <th>Day</th> */}
                        {Array(days)
                          .fill(0)
                          .map((rating, index) => {
                            const date = new Date(
                              yearUse,
                              months.indexOf(monthUse),
                              index + 1
                            );
                            const dayOfWeek = date.getDay();
                            const dayNames = [
                              "Sun",
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ];
                            const weekend = isWeekend(dayOfWeek);
                            const className = weekend ? "weekend" : "";

                            return (
                              <th key={index} className={className}>
                                <span>
                                  {index + 1 < 10 ? "0" : ""}
                                  {index + 1}
                                </span>
                                <br></br>
                                <span>{dayNames[dayOfWeek]}</span>
                              </th>
                            );
                          })}
                        <th style={{ color: "green" }}>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratingsArray?.map((user, index) => {
                        const isCurrentUser = user._id === userDetails?.id;
                        const isCurrentUserManager = user?.managerIds?.includes(
                          userDetails?.id
                        );
                        console.log(isCurrentUserManager, user.name);

                        return (
                          <tr
                            key={index}
                            className={`${
                              isCurrentUser ? "highlighted-user" : ""
                            } ${
                              isCurrentUserManager ? "highlighted-manager" : ""
                            }`}
                          >
                            <td
                              className={`user_names text-truncate ${
                                isCurrentUser ? "highlighted-user" : ""
                              } ${
                                isCurrentUserManager
                                  ? "highlighted-manager"
                                  : ""
                              }`}
                            >
                              {user.name}
                            </td>

                            {Array(days)
                              .fill(0)
                              .map((day, index) => {
                                let ratingUserObj = user?.ratings;
                                let ratingCommentObj = ratingUserObj?.find(
                                  (el) => el.date - 1 === index
                                );

                                const date = new Date(
                                  yearUse,
                                  months.indexOf(monthUse),
                                  index + 1
                                );
                                const dayOfWeek = date.getDay();
                                const weekendValue =
                                  dayOfWeek === 0 || dayOfWeek === 6;
                                if (ratingCommentObj) {
                                  return (
                                    <RatingBox
                                      key={index}
                                      index={index}
                                      getAllRatings={getAllRatings}
                                      ratingCommentObj={ratingCommentObj}
                                      className={
                                        weekendValue ? "weekendBox" : ""
                                      }
                                      month={months.indexOf(monthUse) + 1}
                                      year={yearUse}
                                      user={user}
                                      setTaskModalShow={setModalShow}
                                      setRatingData={setRatingData}
                                      setRatingForDay={setRatingForDay}
                                      isCurrentUserManager={
                                        isCurrentUserManager
                                      }
                                      isCurrentUser={isCurrentUser}
                                    />
                                  );
                                } else {
                                  let dateToSend = `${yearUse}-${
                                    months.indexOf(monthUse) + 1 <= 9
                                      ? "0" + (months.indexOf(monthUse) + 1)
                                      : months.indexOf(monthUse) + 1
                                  }-${
                                    index + 1 <= 9
                                      ? "0" + (index + 1)
                                      : index + 1
                                  }`;
                                  return (
                                    <td
                                      className={`${
                                        isCurrentUser ? "highlighted-user" : ""
                                      } ${
                                        isCurrentUserManager
                                          ? "highlighted-manager"
                                          : ""
                                      }`}
                                      key={index}
                                    >
                                      {userDetails?.role === "CONTRIBUTOR" ||
                                      new Date(dateToSend) > new Date() ? (
                                        <span
                                          style={{
                                            padding: "2px 15px",
                                          }}
                                          className={
                                            weekendValue
                                              ? "weekendBox input_dashboard"
                                              : "input_dashboard"
                                          }
                                        ></span>
                                      ) : (
                                        <>
                                          <span
                                            style={{
                                              padding: "2px 15px",
                                            }}
                                            className={
                                              weekendValue
                                                ? "weekendBox input_dashboard"
                                                : "input_dashboard"
                                            }
                                            // onClick={()=>{// console.log(user,'index',index+1,monthUse,yearUse);}}
                                            onClick={() => {
                                              isRatingAllowed(
                                                user,
                                                index + 1,
                                                months.indexOf(monthUse) + 1,
                                                yearUse
                                              );
                                            }}
                                          >
                                            {!weekendValue && "?"}
                                          </span>
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
              </div>
            </div>
          </div>

          {loading ? <Loader /> : null}
          <div></div>
        </div>
      ) : (
        <div>{teamView !== undefined && <MyCalendar />}</div>
      )}
    </div>
  );
}
