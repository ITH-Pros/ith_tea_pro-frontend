import React, { useState } from 'react'
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { MDBTooltip } from 'mdb-react-ui-kit';
import { addComment, getComment, updateUserRating } from '../../services/user/api';
import Modals from '../modal';
import moment from 'moment';
import { Button, Row } from 'react-bootstrap';
import { useAuth } from '../../auth/AuthProvider';
import Toaster from "../Toaster";

const RatingBox = (props) => {
    const { ratingCommentObj, index, getAllRatings, ratingsArray } = props;

    const [clickedRatingArray, setclickedRatingArray] = useState([]);
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedRatingId, setSelectedRatingId] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false);
	const [toaster, showToaster] = useState(false);
	const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");

    async function getCommentsByRatingId(ratingId, rating) {
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
                setToasterMessage(comment?.error?.message||'Something Went Wrong');
				setShowToaster(true);
            } else {
                setclickedRatingArray(comment?.data);
                if (!modalShow) {
                    setSelectedRating(rating);
                    setSelectedRatingId(ratingId)
                    setModalShow(true);

                }
            }
        } catch (error) {
            setToasterMessage(error?.error?.message||'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
        }
    }

    function openShowCommentsModal(data) {
        getCommentsByRatingId(data?.ratingId, data?.rating);
    }

    const GetModalBody = () => {

        function toTitleCase(str) {
            return str.replace(
              /\w\S*/g,
              function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              }
            );
        }
        
        const CommentsForm = () => {
            const [commentFormValue, setCommentValue] = useState('')
            async function addCommnetFunc() {
                if (!commentFormValue) {
                    return
                }
                let dataToSend = {
                    comment: commentFormValue,
                    ratingId: selectedRatingId,
                };
                setLoading(true);
                try {
                    const comment = await addComment(dataToSend);
                    setLoading(false);
                    if (comment.error) {
                        setToasterMessage(comment?.error?.message||'Something Went Wrong');
                        setShowToaster(true);
                    } else {
                        setToasterMessage('Comment Added Succesfully');
                        setShowToaster(true);
                        getCommentsByRatingId(selectedRatingId, selectedRating)
                    }
                } catch (error) {
                    setToasterMessage(error?.error?.message||'Something Went Wrong');
                    setShowToaster(true);
                    setLoading(false);
                }
            }

            return (
                <>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="10" controlId="comment" >
                            <Form.Control as="textarea" required type="text-area" placeholder="Comment"  value={commentFormValue}
                                onChange={(e) => { setCommentValue(e.target.value) }}/>
                            <Form.Control.Feedback type='invalid'> Required</Form.Control.Feedback>
                        </Form.Group>
                        <Button className="btn btn-gradient-border btnshort-modal" style={{marginTop:'12px'}} type="submit" onClick={() => {addCommnetFunc()}}><i className="fa fa-plus" aria-hidden="true"></i> </Button>
                    </Row>
                </>
            );
        };

        const RatingEditBox = () => {
            const [newRating, setNewRating] = useState('')
            const [editRatingEnabled, setEditRatingEnabled] = useState(false);
            const { userDetails } = useAuth();

            const editUserRating = async () => {
                if (newRating > 5 || newRating < 0) {
                    return
                }
                setLoading(true);
                try {
                    let dataToSend = {
                        ratingId: selectedRatingId,
                        rating: newRating
                    }
                    const rating = await updateUserRating(dataToSend);
                    setLoading(false);
                    if (rating.error) {
                        setToasterMessage(rating?.error?.message||'Something Went Wrong');
                        setShowToaster(true);
                    } else {
                        setToasterMessage('Rating Updated Succesfully');
                        setShowToaster(true);
                        setSelectedRating(newRating);
                        setEditRatingEnabled(false);
                        getAllRatings()
                    }
                } catch (error) {
                    setToasterMessage(error?.error?.message||'Something Went Wrong');
                    setShowToaster(true);
                    setLoading(false);
                }

            }
            return (
                editRatingEnabled ? <div>
                                        <input type='number' value={newRating} className='previous-rating' placeholder={'Previous Rating : ' + selectedRating} onChange={(e) => { setNewRating(e.target.value) }} ></input>
                                        <button className="btn btn-gradient-border btnshort mt-3" onClick={editUserRating} >Submit</button>
                                        <button className="modal-close-btn" onClick={() => setEditRatingEnabled(false)}><i className='fa fa-times'></i></button>
                                        {(newRating < 0 || newRating > 5) && <span style={{ color: 'red' }}> Rating must be in range [0,5]</span>}
                                    </div>:
                                            <div>
                                                <span ><b>Rating </b>: <input style={{width:'20px',textAlign:'center'}} value={selectedRating}/></span>
                                                {
                                                    userDetails.role !== "USER" && <button className="btn btn-gradient-border btnshort mt-3" onClick={() => { setEditRatingEnabled(true) }}><i className='fa fa-edit'></i> </button>
                                                }
                                            </div>
            )
        }   

        return (
            <>
                <div>
                    <div style={{ display: "flex",marginBottom: "20px"}}>
                        <RatingEditBox />
                    </div>
                    <CommentsForm />
                </div>
                {
                    clickedRatingArray?.map((comments, index) => {
                        console.log(comments?.comments?.comment);
                        return (
                            <div
                                key={comments?.comments?._id}
                                style={{ borderBottom: "1px solid #b86bff", padding: "10px" }}>
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{toTitleCase(comments?.comments?.commentedBy?.[0]?.name)}</span>
                                <img className='img-logo' style={{marginRight:'10px',marginLeft:'5px'}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-z3LzM-wYXYiWslzq9RADq0mAdVfFrn91gRqxcl9K&s" alt='img'></img>
                                <small className='date-badge'>{moment(comments?.comments?.createdAt).format("Do MMMM  YYYY, h:mm a")}</small>{" "}<br />
                                <p style={{marginTop: '10px', fontStyle: 'italic',fontSize: '15px' }} dangerouslySetInnerHTML={{ __html: comments?.comments?.comment }}></p>
                            </div>
                        );
                    })
                }
            </>
        );
    };

    return (
        <>
            <td key={index} >
                <MDBTooltip tag="div" wrapperProps={{ href: "#" }} title={"click to view details"}>
                     <span style={{ cursor: "pointer",padding:'10px' }}   onClick={() => openShowCommentsModal(ratingCommentObj)} className="input_dashboard">{`${ratingCommentObj?.rating}`} </span>
                </MDBTooltip>
            </td>
            {
                modalShow && <Modals
                    modalShow={modalShow}
                    modalBody={<GetModalBody />}
                    heading="Rating Details"
                    btnContent="Close"
                    onClick={() => setModalShow(false)}
                    onHide={() => setModalShow(false)} />
            }
                    {toaster && <Toaster message={toasterMessage} show={toaster} close={() => showToaster(false)} />}
        </>

    )
}
export default RatingBox 