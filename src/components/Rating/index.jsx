import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import "./index.css";
import "./rating.scss";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Offcanvas, Row } from "react-bootstrap";
import { getRatings, verifyManager } from "@services/user/api";
import RatingBox from "./ratingBox";
import Loader from "../Shared/Loader";
import MyCalendar from "./weekCalendar/weekCalendra";
import RatingModalBody from "./add-rating-modal/index.jsx";
import TasksModalBody from "./view-task-modal/viewTaskModal";
import { toast } from "react-toastify";
import { useAuth } from "../../utlis/AuthProvider";
import { useMutation, useQuery } from "react-query";
const ROOT = `rating_table`

import { Table } from "antd";
const columns = [
  {
    title: " Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left",
    ellipsis: "true",
  },
  {
    title: "Age",
    width: 100,
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Column 1",
    dataIndex: "address",
    key: "1",
    width: 150,
  },
  {
    title: "Column 2",
    dataIndex: "address",
    key: "2",
    width: 150,
  },
  {
    title: "Column 3",
    dataIndex: "address",
    key: "3",
    width: 150,
  },
  {
    title: "Column 4",
    dataIndex: "address",
    key: "4",
    width: 150,
  },
  {
    title: "Column 5",
    dataIndex: "address",
    key: "5",
    width: 150,
  },
  {
    title: "Column 6",
    dataIndex: "address",
    key: "6",
    width: 150,
  },
  {
    title: "Column 7",
    dataIndex: "address",
    key: "7",
    width: 150,
  },
  {
    title: "Column 8",
    dataIndex: "address",
    key: "8",
  },
  {
    title: "Average",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Aditya Kumar ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

var month = moment().month();
let currentYear = moment().year();

export default function ViewRating() {
  /* state variables start */

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
  const [boxDetails, setBoxDetails] = useState(null);
  const [raitngForDay, setRatingForDay] = useState();

  /* state variables end */

  /**
   * @description useEffect hook - executes on component load - checks if team view should open
   * @todo needs to be optimised
   */
  useEffect(() => {
    const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
    if (allowedRoles.includes(userDetails?.role)) {
      setTeamView(true);
    } else {
      setTeamView(false);
    }
  }, []);

  useEffect(() => {
    if (teamView === false) {
      setMonth(moment().format("MMMM"));
      setYear(moment().year());
    }
  }, [teamView]);

  /**
   * @description useEffect hook - executes on component load
   *              verifies that logged in user has permission to assign rating
   * @dependency boxDetails - hook executes again when boxDetails changes
   */

  useEffect(() => {
    if (boxDetails?.user?._id) {
      const dataToSend = {
        userId: boxDetails?.user._id,
      };

      verifyManagerMutation.mutate(dataToSend);
    }
  }, [boxDetails]);

  /**
   * @description React Query hook -Executes instantly
   * @statemanagement manages state internally by react hooks
   * @constant data data return from api
   * @constant isLoading Boolean that shows api state
   * @constant refetch refetch function -if needed to call manually
   */

  const {
    data: ratingsArray,
    isLoading,
    refetch: getAllRatings,
  } = useQuery(
    ["getAllRatings", monthUse, yearUse],
    () => getRatings({ month: months.indexOf(monthUse) + 1, year: yearUse }),
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
      onError: (err) => {
        throw new Error(err?.message || "Something Went Wrong");
      },
    }
  );

  /**
   * @description React Query Mutation -used for verifying manager has access for rating or not
   */
  const verifyManagerMutation = useMutation((data) => verifyManager(data), {
    onError: (error) => {
      toast.dismiss();
      toast.info(error?.message || "Something Went Wrong");
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.dismiss();
        toast.info(data?.error?.message);
      } else {
        if (data?.data?.ratingAllowed === true) {
          setRatingForDay();
          setRatingData({
            user: boxDetails.user,
            date: boxDetails.date,
            month: boxDetails.month,
            year: boxDetails.year,
          });
          setModalShow(true);
        } else {
          toast.dismiss();
          toast.info("You are not allowed to give rating.");
        }
      }
    },
  });

  /**
   * @description handles the click event on rating table body
   *             -created by @vijay to handle all click events on cell from one place
   * @param event -Click event
   */

  const handleTableClick = (event) => {
    let isFilled = event.target?.dataset?.filled;
    const clickedElement = event.target;
    const childData = clickedElement.dataset;

    if (!isFilled) {
      if (childData.user) {
        setBoxDetails({
          user: JSON.parse(childData.user),
          date: childData.date,
          month: childData.month,
          year: childData.year,
        });
      }
    } else {
      setModalShow(true);
      setRatingData((prevRatingData) => ({
        ...prevRatingData,
        user: JSON.parse(childData.user),
        date: childData.date,
        month: childData.month,
        year: childData.year,
      }));
      setRatingForDay(childData?.rcomment);
    }
  };

  /**
   * @description checks if day is weekend day or not
   * @param dayOfWeek - day number of week
   * @returns Bollean- true or false
   */
  const isWeekend = (dayOfWeek) => {
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  /**
   * @description executes on month change in dropdown
   * @param e change event
   */
  const onchangeMonth = (e) => {
    setMonth(e.target.value);
    let monthDays = new Date(yearUse, months.indexOf(e.target.value) + 1, 0);
    setDays(monthDays.getDate());
  };

  /**
   * @description executes on change year
   * @param e change event
   */
  const onChangeYear = (e) => {
    setYear(e.target.value);
  };

  /**
   * @description hides add rating modal
   */
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
              setModalShow={(data) => {
                setModalShow(data);
                if (data === false && teamView) {
                  getAllRatings();
                }
              }}
              raitngForDay={raitngForDay}
            />
          ) : (
            <TasksModalBody
              data={ratingData}
              setModalShow={(data) => {
                setModalShow(data);
                if (data === false && teamView) {
                  getAllRatings();
                }
              }}
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
            <div class="">
              <div class="">
                <div className="">
                  <table responsive className="">
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
                    <tbody onClick={(e) => handleTableClick(e)}>
                      {ratingsArray?.map((user, index) => {
                        const isCurrentUser = user._id === userDetails?.id;
                        const isCurrentUserManager = user?.managerIds?.includes(
                          userDetails?.id
                        );

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
                                              : "input_dashboard first"
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
                                                : "input_dashboard second"
                                            }
                                            data-user={JSON.stringify(user)}
                                            data-date={index + 1}
                                            data-month={
                                              months.indexOf(monthUse) + 1
                                            }
                                            data-year={yearUse}
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
                  </table>
                  {(isLoading || verifyManagerMutation.isLoading) && (
                    <div
                      className="text-center"
                      style={{ position: "relative", top: -500, left: -50 }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

       
          <div  className={`${ROOT}__rating_table`}>
            <Table
              pagination={false}
              columns={columns}
              dataSource={data}
              scroll={{
                x: 1500,
                y: 300,
              }}
            />
          </div>
        </div>
      ) : (
        <div>{teamView !== undefined && <MyCalendar />}</div>
      )}
    </div>
  );
}
