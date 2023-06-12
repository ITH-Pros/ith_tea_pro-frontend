import React, { useEffect, useState } from "react";
import { updateUserRating } from "../../services/user/api";
import Modals from "../modal";
import Toaster from "../Toaster";
import Loader from "../Loader";

const RatingBox = (props) => {
  const { ratingCommentObj, index, getAllRatings  } = props;

  const [selectedRating, setSelectedRating] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const [toasterMessage, setToasterMessage] = useState("");


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
            setToasterMessage(rating?.message || "Something Went Wrong");
            setShowToaster(true);
          } else {
            setToasterMessage("Rating Updated Succesfully");
            setShowToaster(true);
            setSelectedRating(newRating);
            setEditRatingEnabled(false);
            getAllRatings();
          }
        } catch (error) {
          setToasterMessage(error?.error?.message || "Something Went Wrong");
          setShowToaster(true);
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
            padding: "3px",
            paddingLeft: "6px",
            paddingRight: "6px",
          }}
          className="input_dashboard"
        >
          {`${formatedRating(ratingCommentObj?.rating)}`}{" "}
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
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
    </>
  );
};
export default RatingBox;
