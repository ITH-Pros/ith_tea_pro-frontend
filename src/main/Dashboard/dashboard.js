import React from "react";
import moment from "moment";

import { useState, useEffect } from "react";
import { getRatings } from "../../services/user/api";
import "./dashboard.css";
import { MDBTooltip } from "mdb-react-ui-kit";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Loader from "../../components/Loader";
import { getAllUsers } from "../../services/user/api";
import RatingBox from "../../components/ratingBox";
import { useAuth } from "../../auth/AuthProvider";
import Toaster from "../../components/Toaster";
import { today } from "@internationalized/date";

var month = moment().month();
let currentYear = moment().year();
export default function Dashboard(props) {
    const [usersArray, setTeamOptions] = useState([]);
    const [ratingsArray, setRatings] = useState([]);
    const [toasterMessage, setToasterMessage] = useState("");
    const [toaster, showToaster] = useState(false);
    const [loading, setLoading] = useState(false);
    const setShowToaster = (param) => showToaster(param);
    const { userDetails } = useAuth();

    useEffect(() => {
        onInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onInit() {
        getUsersList();
        let dataToSend = {
            month: months.indexOf(monthUse) + 1,
            year: yearUse,
        };
        getAllRatings(dataToSend);
    }

    const [days, setDays] = useState(moment().daysInMonth());
    const [monthUse, setMonth] = useState(moment().format("MMMM"));
    const [yearUse, setYear] = useState(currentYear);

    const onchangeMonth = (e) => {
        setMonth(e.target.value);
        let dataToSend = {
            month: months.indexOf(e.target.value) + 1,
            year: yearUse,
        };
        let monthDays = new Date(yearUse, months.indexOf(e.target.value) + 1, 0)
        setDays(monthDays.getDate())
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
                setToasterMessage(user?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {
                setTeamOptions([...user.data]);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
            return error.message;
        }
    };

    async function getAllRatings(data) {
        setLoading(true);

        try {
            if (!data) {
                data = {
                    month: months.indexOf(monthUse) + 1,
                    year: yearUse,
                };
            }
            const rating = await getRatings(data);
            setLoading(false);

            if (rating.error) {
                setToasterMessage(rating?.error?.message || 'Something Went Wrong');
                setShowToaster(true);
            } else {
                setRatings([...rating.data]);
            }
        } catch (error) {
            setToasterMessage(error?.error?.message || 'Something Went Wrong');
            setShowToaster(true);
            setLoading(false);
        }
    }

    return (
        <div className="dashboard_camp">

            {
                props.showBtn &&

                <h1 className="h1-text">
                    <i className="fa fa-home" aria-hidden="true"></i> Dashboard
                </h1>
            }
            <div className="m-3 d-flex justify-content-center flex-column">
                <div>
                    {
                        userDetails?.role !== "USER" &&
                        <Link to="/rating" params={{ params: true }}>
                            {props.showBtn && (
                                <div className="wrap">
                                    <button className='add-rating-button'  ><span>Add Rating</span></button>
                                </div>
                            )}
                        </Link>
                    }
                    <h5 className="text-center h5cls">
                        <p style={{ marginRight: "10px", marginTop: "6px" }}>
                            Ratings for{" "}
                        </p>
                        <Form.Group as={Col} md="1" controlId="select_month">
                            <Form.Control className="month-drop-select"
                                required
                                as="select"
                                type="select"
                                name="select_team"
                                onChange={onchangeMonth}
                                value={monthUse}>
                                <option value="" disabled>
                                    Select Month
                                </option>
                                {months.map((monthh, index) => (
                                    <option value={monthh} key={monthh} disabled={index > month && yearUse >= currentYear}>
                                        {monthh}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="1" controlId="select_year">
                            <Form.Control className="year-drop-select"
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
                <table className="table fixed_header" >
                    <thead>
                        <tr>
                            <th>Name</th>
                            {Array(days)
                                .fill(0)
                                .map((rating, index) => {
                                    return (
                                        <th className="dates text-center" key={`${index}_${index}`} >{index + 1 < 10 ? '0' + (index + 1) : (index + 1)}</th>
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
                                    {Array(days)?.fill(0)?.map((day, index) => {
                                        let ratingUserObj = ratingsArray.find((el) => { return el._id === user._id; });
                                        let ratingCommentObj = ratingUserObj?.ratingsAndComment.find((el) => el.date - 1 === index);
                                        if (ratingCommentObj) {
                                            userRatingSum += ratingCommentObj?.rating;
                                            userRatingCount += 1;
                                            return (<RatingBox key={index} index={index} getAllRatings={getAllRatings} ratingCommentObj={ratingCommentObj} />);
                                        } else {
                                            let dateToSend = `${yearUse}-${(months.indexOf(monthUse) + 1) <= 9 ? ('0' + (months.indexOf(monthUse) + 1)) : months.indexOf(monthUse) + 1}-${(index + 1) <= 9 ? '0' + (index + 1) : index + 1}`
                                            return (
                                                <td key={index}>
                                                    {
                                                        userDetails?.role === "USER" || new Date(dateToSend) > new Date() ?
                                                            <span style={{ padding: '3px', paddingLeft: '18px' }} className="input_dashboard"></span>
                                                            :
                                                            <MDBTooltip tag="div" wrapperProps={{ href: "#" }} title={"click to Add Rating"}>
                                                                <Link to={{ pathname: "/rating" }} state={{ userId: user._id, date: dateToSend }}>
                                                                    <span style={{ cursor: "cell", padding: '3px', paddingLeft: '18px' }} className="input_dashboard"></span>
                                                                </Link>
                                                            </MDBTooltip>
                                                    }
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
            {toaster && <Toaster
                message={toasterMessage}
                show={toaster}
                close={() => showToaster(false)} />
            }
        </div>
    );
}
