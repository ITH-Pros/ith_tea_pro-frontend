import React, { useState } from "react";
import "./EditRating.css";
import { updateTaskRating } from "@services/user/api";
import { toast } from "react-toastify";

export default function EditRating(props) {
  const {
    taskId,
    taskRating,
    taskComment,
    onClose,
    getTaskDetailsById,
    setLoading
  } = props;

  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(taskRating);
  const [comment, setComment] = useState(taskComment || "");
  const [commentValid, setCommentValid] = useState(true); // Track comment validity

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
        toast.dismiss()
      toast.info(rating?.message || "Something Went Wrong");
        
      } else {
        toast.dismiss()
      toast.info("Rating Updated Successfully");
        
        onClose();
        getTaskDetailsById(taskId?._id);
        setConfirmationAgain(false);
      }
    } catch (error) {
      toast.dismiss()
      toast.info(error?.message || "Something Went Wrong");
      
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
    setCommentValid(true); // Reset comment validity when the comment changes
  };

  const ratingOptions = [];
  for (let i = 0; i <= 6; i += 0.5) {
    ratingOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const submitButton = () => {


    // Check if comment is valid (not empty)
    if (comment.trim() === "") {
        setCommentValid(false);
        setLoading(false);
        return; // Stop further execution
      }
    


    setConfirmationAgain(true);
    setShowRating(false);
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
              required
            />
            {!commentValid && <p className="requiredMessage">Comment is required</p>}
          </label>
          <br />
          <button
            className="editBtn float-right"
            onClick={() => { submitButton()
            
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
*/}
    </div>
  );
}
