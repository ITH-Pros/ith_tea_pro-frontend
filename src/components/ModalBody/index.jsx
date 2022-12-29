import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Loader from "../../loader/loader";
import {
  addComment,
  getComment,
  updateUserRating,
} from "../../services/user/api";

const GetModalBody = (props) => {
  
  const { selectedRatingDetails } = props;

  const [loading, setLoading] = useState(false);

  const [editRatingEnabled, setEditRatingEnabled] = useState(false);
  const [clickedRatingArray, setclickedRatingArray] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");

  let commentFormValue = "";
  let newRating = "";

  useEffect(() => {
    getCommentsByRatingId(
      selectedRatingDetails.ratingId,
      selectedRatingDetails.rating
    );
  }, []);

  async function getCommentsByRatingId(ratingId, rating) {
    console.log("================================");
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
        console.log(
          "=============================222222222222===",
          comment?.data
        );

        // if (!modalShow) {
        setSelectedRating(rating);
        //   setSelectedRatingId(ratingId)
        //   // setModalShow(true);
        // }
      }
    } catch (error) {
      setLoading(false);
    }
  }

  async function addCommnetFunc() {
    // let ratingId = clickedRatingArray?.ratingId;
    let dataToSend = {
      comment: commentFormValue,
      ratingId: selectedRatingDetails.ratingId,
    };
    setLoading(true);

    try {
      const comment = await addComment(dataToSend);
      //setLoading(false);

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
        getCommentsByRatingId(selectedRatingDetails.ratingId, selectedRating);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  const CommentsForm = () => {
    return (
      <Row className="mb-3">
        <Form.Group as={Col} md="8" controlId="comment">
          {/* <Form.Label>Comment</Form.Label> */}
          <Form.Control
            as="textarea"
            required
            type="text-area"
            placeholder="Comment"
            onChange={(e) => {
              commentFormValue = e.target.value;
            }}
          />
        </Form.Group>

        <Button
          className="btnshort btn btn-gradient-border"
          type="submit"
          onClick={() => {
            addCommnetFunc();
          }}
        >
          Add
        </Button>
      </Row>
    );
  };

  const editUserRating = async () => {
    setLoading(true);
    try {
      let dataToSend = {
        ratingId: selectedRatingDetails.ratingId,
        rating: newRating,
      };
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
        // getAllRatings({
        //   month: months.indexOf(monthUse) + 1,
        //   year: yearUse,
        // })
      }
    } catch (error) {
      setLoading(false);
    }
  };

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
          {editRatingEnabled ? (
            <div>
              <input
                type="number"
                placeholder={"Previous Rating : " + selectedRating}
                onChange={(e) => {
                  newRating = e.target.value;
                }}
              ></input>
              <button
                className="btn btn-gradient-border"
                onClick={() => setEditRatingEnabled(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-gradient-border"
                onClick={editUserRating}
              >
                Submit
              </button>
            </div>
          ) : (
            <div>
              <h5>Rating : {selectedRating}</h5>
              <span
                className="btn btn-gradient-border"
                onClick={() => {
                  setEditRatingEnabled(true);
                }}
              >
                Edit Rating
              </span>
            </div>
          )}
        </div>
        <CommentsForm />
      </div>
      {clickedRatingArray?.map((comments, index) => {
        console.log(comments?.comments?.comment);
        return (
          <div
            key={comments?.comments?._id}
            style={{ borderBottom: "1px solid #b86bff", padding: "10px" }}
          >
            <span>{comments?.comments?.commentedBy?.[0]?.name + "  "}</span>
            <small>
              {/* {moment(comments?.comments?.createdAt).format("Do MMMM  YYYY, h:mm a")} */}
            </small>{" "}
            <br />
            <p
              style={{ marginTop: "10px" }}
              dangerouslySetInnerHTML={{ __html: comments?.comments?.comment }}
            ></p>
          </div>
        );
      })}

      {loading ? <Loader /> : null}
    </>
  );
};

export default GetModalBody;
