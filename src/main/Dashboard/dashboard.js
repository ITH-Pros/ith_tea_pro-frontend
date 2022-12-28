import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import { getRatings, updateUserRating } from "../../services/user/api";
import "./dashboard.css";
import Modals from "../../components/modal";
import Button from "react-bootstrap/Button";
import { MDBTooltip } from "mdb-react-ui-kit";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Loader from "../../loader/loader";
import { getAllUsers } from "../../services/user/api";
import { getComment } from "../../services/user/api";
import { addComment } from "../../services/user/api";
// import Particles from '../../components/particals';

var month = moment().month();
let currentYear = moment().year();
export default function Dashboard(props) {
  console.log(month)
  const [clickedRatingArray, setclickedRatingArray] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedRatingId, setSelectedRatingId] = useState([]);
  const [usersArray, setTeamOptions] = useState([]);
  const [ratingsArray, setRatings] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [editRatingEnabled, setEditRatingEnabled] = useState(false);

  const [loading, setLoading] = useState(false);
  let commentFormValue = ''
  let newRating = ''

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

  async function addCommnetFunc() {
    // let ratingId = clickedRatingArray?.ratingId;
    let dataToSend = {
      comment: commentFormValue,
      ratingId: selectedRatingId,
    };
    setLoading(true);

    try {
      const comment = await addComment(dataToSend);
      setLoading(false);

      if (comment.error) {
        console.log(comment.error);
        // toast.error(rating.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
      } else {
        // toast.success("Submitted succesfully !", {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });

        console.log("comment added succesfully ");
        getCommentsByRatingId(selectedRatingId, selectedRating)
      }
    } catch (error) {
      setLoading(false);
    }
  }

  const editUserRating = async () => {
    setLoading(true);

    try {
      let dataToSend = {
        ratingId: selectedRatingId,
        rating: newRating
      }
      const rating = await updateUserRating(dataToSend);
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
        setSelectedRating(newRating);
        setEditRatingEnabled(false);
        getAllRatings({
          month: months.indexOf(monthUse) + 1,
          year: yearUse,
        })


      }
    } catch (error) {
      setLoading(false);
    }

  }

  const GetModalBody = () => {
    return (
      <>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "20px",
            }}
          >
            {

              editRatingEnabled ?
                <div>
                  <input type='number' placeholder={'Previous Rating : ' + selectedRating} onChange={(e) => { newRating = e.target.value }} ></input>
                  <button className="btn btn-gradient-border" onClick={() => setEditRatingEnabled(false)}>Cancel</button>
                  <button className="btn btn-gradient-border" onClick={editUserRating} >Submit</button>
                </div>
                :
                <div>
                  <h5>Rating : {selectedRating}</h5>
                  <span className="btn btn-gradient-border" onClick={() => { setEditRatingEnabled(true) }}>Edit Rating</span>
                </div>
            }

          </div>
          <CommentsForm />
        </div>
        {
          clickedRatingArray?.map((comments, index) => {
            console.log(comments);
            return (
              <div
                key={comments?.comments?._id}
                style={{ borderBottom: "1px solid #b86bff", padding: "10px" }}
              >
                <span>{comments?.comments?.commentedBy?.[0]?.name}</span>
                <small>
                  {moment(comments?.comments?.createdAt).format("Do MMMM  YYYY, h:mm a")}
                </small>{" "}
                <br />
                <p style={{ marginTop: "10px" }}>
                  {" "}
                  {comments?.comments?.comment}
                </p>
                {/* <span>Comment:- </span> {comments?.comment}<br/>
								<span> Commented By:- </span>{clickedRatingArray.commentedByArray?.[index]?.name}<br/>
                <span> Date & Time:- </span>{comments.createdAt?.split('T')[0] +'(' +comments?.createdAt?.split('T')[1]?.split('.')[0]+')'} */}
              </div>
            );
          })
        }
      </>
    );
  };

  const CommentsForm = () => {
    return (
      <>
        <Row className="mb-3">
          <Form.Group as={Col} md="8" controlId="comment" >
            {/* <Form.Label>Comment</Form.Label> */}
            <Form.Control
              as="textarea"
              required
              type="text-area"
              placeholder="Comment"
              onChange={(e) => { commentFormValue = e.target.value }}
            />
            {/* <Form.Control.Feedback type="invalid">
                    Comment is required !!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
          </Form.Group>

          <Button className="btnshort btn btn-gradient-border" type="submit" onClick={() => { addCommnetFunc() }}>
            Add
          </Button>
        </Row>
      </>
    );
  };

  async function getCommentsByRatingId(ratingId, rating) {
    console.log("================================")
    let dataToSend = {
      params: {
        ratingId,
      },
    };
    setLoading(true);

    try {
      const comment = await getComment(dataToSend);
      setLoading(false);

      if (comment.error) {
        console.log(comment.error);
        // toast.error(rating.error.message, {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
      } else {
        // toast.success("Submitted succesfully !", {
        //   position: toast.POSITION.TOP_CENTER,
        //   className: "toast-message",
        // });
        setclickedRatingArray(comment?.data);
        console.log("=============================222222222222===", modalShow)

        if (!modalShow) {
          setSelectedRating(rating);
          setSelectedRatingId(ratingId)
          setModalShow(true);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  }

  function openShowCommentsModal(data) {
    console.log(data);
    getCommentsByRatingId(data?.ratingId, data?.rating);
  }

  const clearModalVariablesAndCloseModal = () => {
    setEditRatingEnabled(false);
    setModalShow(false);
  }
  const showAddRatingDialog = () => {
    console.log("============================================================")

  }

  return (
    <div>

      <h1 className="h1-text">
        <i className="fa fa-home" aria-hidden="true"></i> Dashboard
      </h1>
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


                  <option value={monthh} key={monthh} disabled={index > month}>
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
                      let ratingUserObj = ratingsArray.find((el) => {
                        return el._id === user._id;
                      });
                      let ratingCommentObj =
                        ratingUserObj?.ratingsAndComment.find(
                          (el) => el.date - 1 === index
                        );
                      if (ratingCommentObj) {
                        userRatingSum += ratingCommentObj?.rating;
                        userRatingCount += 1;

                        return (
                          <td key={index} >
                            <MDBTooltip
                              tag="a"
                              wrapperProps={{ href: "#" }}
                              title={"click to view details"}
                            >
                              <div
                                style={{
                                  cursor: "pointer",
                                  border: "1px solid grey",
                                }}
                                className="input_dashboard"
                                onClick={() =>
                                  openShowCommentsModal(ratingCommentObj)
                                }
                              // onInput={(e) => handleChange(e, userIndex, dayIndex)}
                              >{`${ratingCommentObj?.rating}`}</div>
                            </MDBTooltip>
                          </td>
                        );
                      } else {
                        return (


                          <td key={index}>
                            <MDBTooltip
                              tag="p"
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

      {modalShow && <Modals
        modalShow={modalShow}
        modalBody={<GetModalBody />}
        heading="Rating Details"
        size="md"
        btnContent="Close"
        onClick={() => clearModalVariablesAndCloseModal()}
        onHide={() => clearModalVariablesAndCloseModal()}
      />
      }
    </div>
  );
}
