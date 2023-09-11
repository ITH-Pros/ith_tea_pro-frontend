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
const ROOT = `rating_table`;

import { Table } from "antd";

var month = moment().month();
let currentYear = moment().year();

export default function ViewRating() {
  /* state variables start */
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const columns = [
    {
      title: "Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      ellipsis: "true",
    },

    // for days in month that will be columns

    ...Array(days)
      .fill(0)
      .map((day, index) => {
        const date = new Date(yearUse, months.indexOf(monthUse), index + 1);
        const dayOfWeek = date.getDay();
        const weekendValue = dayOfWeek === 0 || dayOfWeek === 6;
        return {
          title: (
            <div>
              <span>
                {index + 1 < 10 ? "0" : ""}
                {index + 1}
              </span>
              <br></br>
              <span>{dayNames[dayOfWeek]}</span>
            </div>
          ),
          dataIndex: "rating",
          key: index + 1,
          width: 60,
          render: (text, record) => {
            return (
              <div
                className={`${
                  weekendValue ? "weekendBox" : ""
                } input_dashboard`}
                // data-filled={text[index] !== 0}
                // data-user={JSON.stringify(ratingsArray[index])}
                // data-date={index + 1}
                // data-month={months.indexOf(monthUse) + 1}
                // data-year={yearUse}

                // onClick={(e) => handleTableClick(e)}
              >
                {text[index]}
              </div>
            );
          },
        };
      }),
    {
      title: "Average",
      key: "operation",
      fixed: "right",
      width: 70,
      dataIndex: "averageRating",
      

      // render: () => <a>1.0</a>,
    },
  ];
  const data = [];

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
      onSuccess: (data) => {},
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

  const formatedRating = (rating) => {
    let num = rating;
    let formattedNum;
    if (num % 1 !== 0) {
      formattedNum = num.toFixed(1);
    } else {
      formattedNum = num;
    }
    return formattedNum;
  };

  for (let i = 0; i < ratingsArray?.length; i++) {
    // const isCurrentUser = ratingsArray[i]._id === userDetails?.id;
    // const isCurrentUserManager = ratingsArray[i]?.managerIds?.includes(
    //   userDetails?.id
    // );

    let userRatings = Array(days).fill(0);
    for (const element of ratingsArray[i].ratings) {
      userRatings[element.date - 1] = element.rating;
    }
    let rating = [];
    for (let j = 0; j < days; j++) {
      if (userRatings[j] === -1) {
        rating.push("A");
      }
       else {
        rating.push(formatedRating(userRatings[j]));
      }
    }
    data.push({
      key: i,
      name: `${ratingsArray[i].name}`,
      rating,
      averageRating: ratingsArray[i].monthlyAverage?.toFixed(2) || "NA",
    });
  }

  return (
    <>
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

            <div className={`${ROOT}__rating_table`}>
            <Table
              pagination={false}
              columns={columns}
              dataSource={data}
              scroll={{
                x: 1500,
                y: 320,
              }}
        
            />
            </div>
          </div>
        ) : (
          <div>{teamView !== undefined && <MyCalendar />}</div>
        )}
      </div>
    </>
  );
}
