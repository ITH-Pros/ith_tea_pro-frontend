import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import { getRatings } from "../../services/user/api";
import "./dashboard.css";
import { v4 as uuidv4 } from "uuid";
import { MDBTooltip } from "mdb-react-ui-kit";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Loader from "../../loader/loader";
import { getAllUsers } from "../../services/user/api";

var month = moment().month();

export default function Dashboard(props) {
  const [usersArray, setTeamOptions] = useState([]);
  const [ratingsArray, setRatings] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (ratingsArray?.length && usersArray?.length) {
      ratingsArray.forEach((rating) => {
        usersArray.forEach((user) => {
          if (user?._id === rating?._id) {
            rating.name = user?.name;
          }
        });
      });
      console.log(ratingsArray, "-----------------ratings array");
      // console.log(usersArray, "-----------------users array");
    }
  }, [ratingsArray, usersArray]);

  function onInit() {
    getUsersList();
    let dataToSend = {
      month: months.indexOf(monthUse) + 1,
      year: yearUse,
    };
    getAllRatings(dataToSend);
  }

  const days = moment().daysInMonth();
  const [monthUse, setMonth] = useState(moment().format("MMMM"));
  const [yearUse, setYear] = useState(2022);

  const onchangeMonth = (e) => {
    setMonth(e.target.value);
    let dataToSend = {
      month: months.indexOf(e.target.value) + 1,
      year: yearUse,
    };
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

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const getUsersList = async function () {
    setLoading(true);
    try {
      const user = await getAllUsers();
      setLoading(false);

      if (user.error) {
        // toast.error(user.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
      } else {
        // toast.success("Submitted succesfully !", {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        setTeamOptions(user.data);
      }
    } catch (error) {
      setLoading(false);
      return error.message;
    }
  };

  async function getAllRatings(data) {
    setLoading(true);

    try {
      const rating = await getRatings(data);
      setLoading(false);

      if (rating.error) {
        // toast.error(rating.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
      } else {
        // toast.success("Submitted succesfully !", {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        setRatings(rating.data);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="h1-text">
        <i className="fa fa-home" aria-hidden="true"></i> Dashboard
      </h1>
      <div>
        <div>
          {/* <Link to="/rating"  params={{ params: true }}>
    {props.showBtn&&(<button className='btn btn-gradient-border btn-glow' style={{float: "right"}}>Add Rating</button>)}

        </Link> */}
        </div>
        {/* <h4 className="text-center">
          Current Date : {`${moment().format("DD MMMM YYYY")}`}
        </h4> */}
      </div>
      <div className="m-3 d-flex justify-content-center flex-column">
        <div>
          <h5 className="text-center h5cls">
            <p style={{ marginRight: "10px", marginTop: "6px" }}>
              Ratings for{" "}
            </p>
            <Form.Group as={Col} md="1" controlId="select_month">
              <Form.Control
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
                {months.map((month) => (
                  <option value={month} key={month}>
                    {month}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="1" controlId="select_year">
              <Form.Control
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
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </h5>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              {Array(days)
                .fill(0)
                .map((rating, index) => {
                  return (
                    <th key={`${index}_${index}`} className={`text-center`}>{`${month + 1
                      }/${moment()
                        .startOf("month")
                        .add(index, "days")
                        .format("DD")}`}</th>
                  );
                })}
              <th style={{ color: "green" }}>Average</th>
            </tr>
          </thead>
          <tbody>
            {usersArray.map((user, index) => {
              let userRatingSum = 0;
              let userRatingCount = 0;

              return (
                <tr key={index}>
                  <td> {user.name}</td>
                  {
                    Array(days)
                      .fill(0)
                      .map((day, index) => {
                        let ratingUserObj = ratingsArray.find((el) => {
                          return el._id === user._id;
                        });
                        let ratingCommentObj =
                          ratingUserObj?.ratingsAndComment.find(
                            (el) => el.date - 1 === index
                          );
                        if (ratingCommentObj) {
                          userRatingSum += ratingCommentObj?.rating
                          userRatingCount += 1
                          return (
                            <td key={index}>
                              <MDBTooltip
                                tag="a"
                                wrapperProps={{ href: "#" }}
                                title={
                                  ratingCommentObj?.comments?.[0]?.comment || "0"
                                }
                              >
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="text"
                                  name=""
                                  id=""
                                  className="input_dashboard"
                                  value={`${ratingCommentObj?.rating}`}
                                  disabled={true}
                                // onInput={(e) => handleChange(e, userIndex, dayIndex)}
                                />
                              </MDBTooltip>
                            </td>
                          )
                        } else {
                          return (
                            <td key={index}>

                              <input
                                style={{ cursor: "pointer" }}
                                type="text"
                                name=""
                                id=""
                                className="input_dashboard"
                                value=''
                                disabled={true}
                              // onInput={(e) => handleChange(e, userIndex, dayIndex)}
                              />
                            </td>)
                        }
                      })}

                  <td>{userRatingCount ? (Math.round(userRatingSum / userRatingCount * 100) / 100) : "NA"}</td>

                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
      {loading ? <Loader /> : null}
    </div>
  );
}

function toTitleCase(str) {
  return str?.replace(/\w\S*/g, function (txt) {
    return txt?.charAt(0)?.toUpperCase() + txt?.substr(1)?.toLowerCase();
  });
}
// eslint-disable-next-line import/no-anonymous-default-export
