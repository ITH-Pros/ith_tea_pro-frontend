/* eslint-disable default-case */
import React from "react";
import { useState, useEffect } from "react";
import "react-date-picker/dist/DatePicker.css";
import "./rating.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { addRating } from "../../services/user/api";
import Dashboard from "../Dashboard/dashboard";
import Loader from "../../components/Loader";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import { getAllUserDataForRating } from "../../services/user/api";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import Toaster from "../../components/Toaster";
import { useAuth } from "../../auth/AuthProvider";
import ViewRatings from "./View-Rating";



export default function Rating(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { userDetails } = useAuth();

    useEffect(() => {
        onInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onInit() {
        getUsersList();
    }
    let today = new Date();
    let patchDateValue = today.getFullYear() + '-' + (today.getMonth() + 1 <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate())
    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState("View");
    const [teamOptions, setTeamOptions] = useState([]);
    const [team, setTeam] = useState("");
    const [date, setDate] = useState(patchDateValue);
    const [rating, setRating] = useState("");
    const [comments, setComments] = useState("");
    const [validated, setValidated] = useState(false);
    const [toaster, showToaster] = useState(false);
    const setShowToaster = (param) => showToaster(param);
    const [toasterMessage, setToasterMessage] = useState("");
    if (!team && location && location.state && location.state.userId) {
        setTeam(location.state.userId)
    }
    if (location && location.state && location.state.date && location.state.date !== date) {
        setDate(location.state.date)
        location.state.date = '';
    }

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const onchangeTeam = (e) => {
        setTeam(e.target.value);
    };

    const handleChangeDate = (date) => {
        setDate(date.target.value);
    };

    const onChangeOfComments = (e) => {
        setComments(e)
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleSubmit = (e) => {
        setValidated(true);
        e.preventDefault();
        e.stopPropagation();

        if (!team || !date || !rating || rating > 5 || rating < 0) {
            return;
        } else {
            let dataToSend = {
                userId: team,
                date: date?.split("-")[2],
                year: date?.split("-")[0],
                month: date?.split("-")[1],
                rating: rating,
                comment: comments,
                // taggedUsers: tags,
            };

            addRatingFunc(dataToSend);
        }
    };

    const getUsersList = async function () {

        setLoading(true);
        try {

            const user = await getAllUserDataForRating();
            setLoading(false);

            if (user.error) {
                setToasterMessage(user?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {

                setTeamOptions(user?.data);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
    };

    async function addRatingFunc(data) {
        setLoading(true);
        try {
            const rating = await addRating(data);
            setLoading(false);
            if (rating.error) {
                setToasterMessage(rating?.error?.message || 'Something Went Wrong');
                setShowToaster(true);

            } else {
                setToasterMessage('Rating Added Succesfully');
                setShowToaster(true);
                navigate('/')
            }
        }
        catch (error) {
            setLoading(false);
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
        }
    }

    const renderCurrentView = () => {


        switch (currentView) {
            case "Add":
                return (
                    <div className="dv-50-rating ">
                        <Form className="margin-form" noValidate validated={validated}>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" >
                                    <Form.Label>Select User</Form.Label>
                                    <Form.Control
                                        required
                                        as="select"
                                        type="select"
                                        name="select_team"
                                        onChange={onchangeTeam}
                                        value={team}
                                    >
                                        <option value="">Select User</option>
                                        {teamOptions.map((module) => (
                                            <option value={module._id} key={module._id}>
                                                {module.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        User name is required !!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="rating_date">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        required
                                        type="date"
                                        name="rating_date"
                                        placeholder="Rating  date"
                                        onChange={handleChangeDate}
                                        max={new Date().toISOString().split("T")[0]}
                                        value={date}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Date is required !!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="validationCustom01">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Rating"
                                        value={rating}
                                        onChange={handleRatingChange}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        min="0"
                                        max="5"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Rating is required, value must be in range [0,5] !!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3 desc">
                                <Form.Label>Comment</Form.Label>
                                <FroalaEditorComponent tag='textarea' onModelChange={onChangeOfComments} />
                            </Row>

											<div className="text-right">
                            <button onClick={handleSubmit} className="btn-gradient-border btnDanger submit">Submit</button>
							</div>
                        </Form>
                    </div>
                );

            case "View":
                return (
                    <div>
                        <ViewRatings showBtn={false} />
                    </div>
                );
            default:
                return
        }
    };

    return (
        <>
          <div className="w-100 px-3">
            {
                userDetails?.role !== "USER" &&
                <>
                    <div className="   main-div-tab">
                        {userDetails?.role !== "USER" && <div
                            onClick={() => handleViewChange("Add")}
                            className={`p-3  w-50  text-center rounded margin-class ${currentView === "Add" ? "text-white bg-active" : "border-bottom "
                                }`}
                            style={{ cursor: "pointer" }}
                        >
                            Add Rating
                        </div>
                        }
                        {/* <div
                            onClick={() => handleViewChange("View")}
                            className={`p-3 w-50 text-center rounded ${currentView === "View" ? "text-white bg-active" : "border-bottom "
                                }`}
                            style={{ cursor: "pointer" }}
                        >
                            Back{" "}
                        </div> */}
                        {loading ? <Loader /> : null}
                        {toaster && <Toaster
                            message={toasterMessage}
                            show={toaster}
                            close={() => showToaster(false)} />}
                    </div>
                </>
            }
            <div className="main-rating-contianer">

                {renderCurrentView()}
            </div>
            </div>
        </>
    );
}
