import React, { useState } from 'react';
import './EditRating.css';
import Toaster from '../../../components/Toaster';
import Loader from '../../../components/Loader';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { updateTaskRating } from '../../../services/user/api';


const EditRating = (props) => {
    const { taskId , taskRating , taskComment , onClose , getTaskDetailsById} = props;
    console.log(taskId , taskRating , taskComment , taskId?.ratingComments[0]?.comment);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(taskRating);
  const [comment, setComment] = useState(taskId?.ratingComments[0]?.comment || '');
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
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
    
    // console.log(`Rating: ${rating}, Comment: ${comment}`);
    // getTaskDetailsById(taskId?._id);
    // setShowRating(false);
    // onClose();

    let dataToSend = {
        taskId: taskId?._id,
        rating: rating,
        comment: comment,
    };
    console.log(dataToSend);
    try {
    const rating = await updateTaskRating(dataToSend);
    setLoading(false);
    if (rating.error) {
        setToasterMessage(rating?.message || "Something Went Wrong");
        showToaster(true);
    } else {
        setToasterMessage("Rating Updated Succesfully");
        showToaster(true);
        onClose();
        getTaskDetailsById(taskId?._id);
        setConfirmationAgain(false);
    }

    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      showToaster(true);
      setLoading(false);
    }



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

  const isSubmitDisabled = rating === 0 ;

  return (
    <div>
      {showConfirmation && (
        <div>
          <p>Are you sure you want to edit?</p>
          <button onClick={() => handleConfirmation(true)}>Yes</button>
          <button onClick={() => handleConfirmation(false)}>No</button>
        </div>
      )}
      {showRating && (
        <div>
          <label>
            Rating:
            <select value={rating} onChange={handleRatingChange}>
              {ratingOptions}
            </select>
          </label>
          <br />
          <label>
            Comment:
            <textarea type="text" value={comment} onChange={handleCommentChange} />
          </label>
          <br />
          <button onClick={() =>{setConfirmationAgain(true);setShowRating(false)}} disabled={isSubmitDisabled}>
            Submit
          </button>
        </div>
      )}
      {confirmationAgain && (
        <div>
          <p>this action will be recorded, are sure you want to edit?</p>
          <button  onClick={() => handleConfirmationAgain(true)} >Yes</button>
            <button  onClick={() => handleConfirmationAgain(true)} >No</button>
        </div>
        )}

      {loading?<Loader />:null}
      {toaster && (
        <ToastContainer position="top-end" className="p-3">
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
        </ToastContainer>
      )}
    </div>
    
  );
};

export default EditRating;
