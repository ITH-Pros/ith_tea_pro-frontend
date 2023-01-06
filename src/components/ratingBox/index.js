import React, { useState } from 'react'
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { MDBTooltip } from 'mdb-react-ui-kit';
import { addComment, getComment, updateUserRating } from '../../services/user/api';
import Modals from '../modal';
import moment from 'moment';
import { Button, Row } from 'react-bootstrap';
import Loader from '../../loader/loader';
import { useAuth } from '../../auth/AuthProvider';

const RatingBox = (props) => {
    const { ratingCommentObj, index, getAllRatings, ratingsArray } = props;

    const [clickedRatingArray, setclickedRatingArray] = useState([]);
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedRatingId, setSelectedRatingId] = useState([]);
    const [modalShow, setModalShow] = useState(false);

    const [loading, setLoading] = useState(false);

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
    const GetModalBody = () => {



        const CommentsForm = () => {
            const [commentFormValue, setCommentValue] = useState('')

            async function addCommnetFunc() {
                if (!commentFormValue) {
                    return
                }
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
                                value={commentFormValue}
                                onChange={(e) => { setCommentValue(e.target.value) }}
                            />
                            <Form.Control.Feedback type='invalid'> Required</Form.Control.Feedback>
                        </Form.Group>

                        <Button className="btn btn-gradient-border btnshort" type="submit" onClick={() => { addCommnetFunc() }}>
                            Add
                        </Button>
                    </Row>
                </>
            );
        };


        const RatingEditBox = () => {
            const [newRating, setNewRating] = useState('')
            const [editRatingEnabled, setEditRatingEnabled] = useState(false);
            const { userDetails } = useAuth()


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
                        getAllRatings()
                    }
                } catch (error) {
                    setLoading(false);
                }

            }
            return (
                editRatingEnabled ?
                    <div>
                        <input type='number' value={newRating} placeholder={'Previous Rating : ' + selectedRating} onChange={(e) => { setNewRating(e.target.value) }} ></input>


                        <button className="btn btn-gradient-border btnshort" onClick={() => setEditRatingEnabled(false)}>Cancel</button>
                        <button className="btn btn-gradient-border btnshort" onClick={editUserRating} >Submit</button>
                        {(newRating < 0 || newRating > 5) && <span style={{ color: 'red' }}> Rating must be in range [0,5]</span>}
                    </div>
                    :
                    <div>
                        <span>Rating : {selectedRating}</span>
                        {
                            userDetails.role !== "USER" && <button className="btn btn-gradient-border btnshort" onClick={() => { setEditRatingEnabled(true) }}>Edit </button>
                        }
                    </div>
            )
        }   

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
                                style={{ borderBottom: "1px solid #b86bff", padding: "10px" }}
                            >
                                <span>{comments?.comments?.commentedBy?.[0]?.name + '  '}</span>
                                <small>
                                    {moment(comments?.comments?.createdAt).format("Do MMMM  YYYY, h:mm a")}
                                </small>{" "}
                                <br />
                                <p style={{ marginTop: "10px" }} dangerouslySetInnerHTML={{ __html: comments?.comments?.comment }}>
                                </p>
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
                <MDBTooltip
                    tag="div"
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
                    >{`${ratingCommentObj?.rating}`}</div>
                </MDBTooltip>
            </td>

            {
                modalShow && <Modals
                    modalShow={modalShow}
                    modalBody={<GetModalBody />}
                    heading="Rating Details"
                    size="md"
                    btnContent="Close"
                    onClick={() => setModalShow(false)}
                    onHide={() => setModalShow(false)}
                />

            }
        </>

    )
}

export default RatingBox 