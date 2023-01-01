import React from "react";
import moment from "moment";

import { useState, useEffect } from "react";
import { getRatings } from "../../services/user/api";
import "./dashboard.css";
import { MDBTooltip } from "mdb-react-ui-kit";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Loader from "../../loader/loader";
import { getAllUsers } from "../../services/user/api";
import RatingBox from "../../components/ratingBox";

var month = moment().month();
let currentYear = moment().year();
export default function Dashboard(props) {
  console.log(month)
  const [usersArray, setTeamOptions] = useState([]);
  const [ratingsArray, setRatings] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const [yearUse, setYear] = useState(currentYear);

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

  let months = moment().year(Number)?._locale?._months
  let years = [2022, 2023, 2024, 2025];

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

      {
        props.showBtn &&

        <h1 className="h1-text">
          <i className="fa fa-home" aria-hidden="true"></i> Dashboard
        </h1>
      }
      <div>
        <div>
          {/* <Link to="/rating" params={{ params: true }}>
            {props.showBtn && (<button className='glass-button'    style={{ float: "right" }}>Add Rating</button>)}
          </Link> */}
          <Link to="/rating" params={{ params: true }}>
            {props.showBtn && (<button className='glass-button' style={{ float: "right", position: 'relative', bottom: '53px' }} ><span>Add Rating</span></button>)}
          </Link>


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
                {months.map((monthh, index) => (
                  <option value={monthh} key={monthh} disabled={index > month && yearUse >= currentYear}>
                    {monthh}
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
                  <option value={year} key={year} disabled={year > currentYear}>
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
                    <th className="dates text-center" key={`${index}_${index}`} >{`${month + 1
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
                  <td className="user_names"> {user.name}</td>
                  {Array(days)
                    ?.fill(0)
                    ?.map((day, index) => {
                      let ratingUserObj = ratingsArray.find((el) => { return el._id === user._id; });
                      let ratingCommentObj = ratingUserObj?.ratingsAndComment.find((el) => el.date - 1 === index);
                      if (ratingCommentObj) {
                        userRatingSum += ratingCommentObj?.rating;
                        userRatingCount += 1;

                        return (
                          <RatingBox key={index} index={index} ratingCommentObj={ratingCommentObj} />
                        );
                      } else {
                        return (


                          <td key={index}>
                            <MDBTooltip
                              tag="div"
                              wrapperProps={{ href: "#" }}
                              title={"click to Add Rating"}
                            >

                              <Link to={{
                                pathname: "/rating",
                              }}
                                state={{ userId: user._id, date: `${yearUse}-${months.indexOf(monthUse) + 1}-${(index + 1) < 9 ? '0' + (index + 1) : index + 1}` }}>
                                <input
                                  style={{ cursor: "pointer" }}
                                  className="input_dashboard"
                                  disabled={true}
                                />
                              </Link>
                            </MDBTooltip>
                          </td>

                        );
                      }
                    })}

                  <td className="userAverage">
                    {userRatingCount
                      ? Math.round((userRatingSum / userRatingCount) * 100) /
                      100
                      : "NA"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {loading ? <Loader /> : null}
    </div>
  );
}
