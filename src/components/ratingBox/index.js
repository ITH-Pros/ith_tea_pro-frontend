import React, { useState } from "react";
import { updateUserRating } from "../../services/user/api";
import Modals from "../modal";
import Loader from "../Loader";
import { toast } from "react-toastify";

const RatingBox = (props) => {
  const {
    ratingCommentObj,
    index,
    getAllRatings,
    month,
    year,
    user,
    setTaskModalShow,
    setRatingData,
    setRatingForDay,
  } = props;
  const [selectedRating, setSelectedRating] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const viewDayTask = () => {
    setTaskModalShow(true);
    setRatingData((prevRatingData) => ({
      ...prevRatingData,
      user: user,
      date: index + 1,
      month: month,
      year: year,
    }));
    setRatingForDay(ratingCommentObj?.rating);
  };

  const GetModalBody = () => {
    const RatingEditBox = () => {
      const [newRating, setNewRating] = useState("");
      const [editRatingEnabled, setEditRatingEnabled] = useState(false);

      const editUserRating = async () => {
        if (newRating > 6 || newRating < 0) {
          return;
        }
        if (newRating === selectedRating) {
          setEditRatingEnabled(false);
          return;
        }
        setLoading(true);
        try {
          let dataToSend = {
            rating: newRating,
          };
          const rating = await updateUserRating(dataToSend);
          setLoading(false);
          if (rating.error) {
            toast.dismiss()
      toast.info(rating?.message || "Something Went Wrong");
            // set
          } else {
            toast.dismiss()
      toast.info("Rating Updated Succesfully");
            // set
            setSelectedRating(newRating);
            setEditRatingEnabled(false);
            getAllRatings();
          }
        } catch (error) {
          toast.dismiss()
      toast.info(error?.error?.message || "Something Went Wrong");
          // set
          setLoading(false);
        }
      };
      return editRatingEnabled ? (
        <div >
          <input
            type="number"
            value={newRating}
            className="previous-rating"
            placeholder={"Previous Rating : " + selectedRating}
            onChange={(e) => {
              setNewRating(e.target.value);
            }}
          ></input>
          <button
            className="btn btn-gradient-border btnshort mt-3"
            onClick={editUserRating}
          >
            Submit
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setEditRatingEnabled(false)}
          >
            <i className="fa fa-times"></i>
          </button>
          {(newRating < 0 || newRating > 6) && (
            <span style={{ color: "red" }}> Rating must be in range [0,6]</span>
          )}
        </div>
      ) : (
        <div>
          <span>
            <b>Rating </b>: <strong>{selectedRating}</strong>{" "}
          </span>
        </div>
      );
    };

    return (
      <>
        <div>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <RatingEditBox />
          </div>
        </div>
      </>
    );
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

  return (
    <>
       <td key={index}>
        <span
          style={{
            cursor: "pointer",
            padding: "2px 15px",
            color: ratingCommentObj?.absent ? "darkred" : "inherit",
          }}
          className="input_dashboard"
          onClick={() => viewDayTask()}
        >
          {ratingCommentObj?.absent ? "A" : formatedRating(ratingCommentObj?.rating)}{' '}
        </span>
      </td>
      {modalShow && (
        <Modals
          modalShow={modalShow}
          keyboardProp={true}
          backdropProp="static"
          modalBody={<GetModalBody />}
          heading="Rating Details"
          btnContent="Close"
          onClick={() => setModalShow(false)}
          onHide={() => setModalShow(false)}
        />
      )}
      {loading ? <Loader /> : null}

    </>
  )
};
export default RatingBox;
