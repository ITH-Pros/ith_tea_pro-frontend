import React, { useState } from "react";
import "./EditRating.css";
import Toaster from "../../../components/Toaster";
import Loader from "../../../components/Loader";
import ToastContainer from "react-bootstrap/ToastContainer";
import { Row, Col } from "react-bootstrap";
import { updateTaskRating } from "../../../services/user/api";

export default function EditRating(props) {
  const { taskId, taskRating, taskComment, onClose, getTaskDetailsById , showToaster , setToasterMessage , setLoading } = props;

  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(taskRating);
  const [comment, setComment] = useState(
    taskId?.ratingComments[0]?.comment || ""
  );

  const [confirmationAgain, setConfirmationAgain] = useState(false);

  const handleConfirmation = (confirm) => {
    if (confirm) {
      setShowConfirmation(false);
      setShowRating(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    let dataToSend = {
      taskId: taskId?._id,
      rating: rating,
      comment: comment,
    };

    try {
      const rating = await updateTaskRating(dataToSend);
      if (rating.error) {
        setToasterMessage(rating?.message || "Something Went Wrong");
        showToaster(true);
      } else {
        setToasterMessage("Rating Updated Successfully");
        showToaster(true);
        onClose();
        getTaskDetailsById(taskId?._id);
        setConfirmationAgain(false);
      }
    } catch (error) {
      setToasterMessage(error?.message || "Something Went Wrong");
      showToaster(true);
    }

    setLoading(false);
  };

  const handleConfirmationAgain = (confirm) => {
    if (confirm) {
      handleSubmit();
    } else {
      onClose();
    }
  };

  const handleRatingChange = (e) => {
    setRating(parseFloat(e.target.value));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const ratingOptions = [];
  for (let i = 0; i <= 6; i += 0.5) {
    ratingOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const isSubmitDisabled = rating === 0;

  return (
    <div>
      {showConfirmation && (
        <div>
          <p className="mb-2 textFont">Are you sure you want to edit?</p>
          <button className="editBtn" onClick={() => handleConfirmation(true)}>
            Yes
          </button>
          <button className="editBtn" onClick={() => handleConfirmation(false)}>
            No
          </button>
        </div>
      )}

      {showRating && (
        <div className="ratingComment">
          <label>
            Rating :
            <select
              className="selectRating"
              value={rating}
              onChange={handleRatingChange}
            >
              {ratingOptions}
            </select>
          </label>
          <br />
          <label>
            Comment:
            <textarea
              type="text"
              value={comment}
              onChange={handleCommentChange}
            />
          </label>
          <br />
          <button
            className="editBtn float-right"
            onClick={() => {
              setConfirmationAgain(true);
              setShowRating(false);
            }}
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </div>
      )}

      {confirmationAgain && (
        <div>
          <p className="mb-2 textFont">
            This action will be recorded, are you sure you want to edit?
          </p>
          <button
            className="editBtn"
            onClick={() => handleConfirmationAgain(true)}
          >
            Yes
          </button>
          <button
            className="editBtn"
            onClick={() => handleConfirmationAgain(false)}
          >
            No
          </button>
        </div>
      )}
      {/* 
  {loading ? <Loader /> : null}

  {toaster && (
    <ToastContainer position="top-end" className="p-3">
      <Toaster
        message={toasterMessage}
        show={toaster}
        close={() => showToaster(false)}
      />
    </ToastContainer>
  )} */}
    </div>
  );
}
