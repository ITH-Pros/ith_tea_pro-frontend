/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState } from "react";
import "react-date-picker/dist/DatePicker.css";
import "./rating.css";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import ViewRatings from "./View-Rating";
import { useLocation } from "react-router-dom";


export default function Rating(props) {

    const location = useLocation();
    let today = new Date();
    let patchDateValue = today.getFullYear() + '-' + (today.getMonth() + 1 <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate())
    const [team, setTeam] = useState("");
    const [date, setDate] = useState(patchDateValue);

    if (!team && location && location.state && location.state.userId) {
        setTeam(location.state.userId)
    }
    if (location && location.state && location.state.date && location.state.date !== date) {
        setDate(location.state.date)
        location.state.date = '';
    }

    const renderCurrentView = () => {
                return (
                    <div>
                        <ViewRatings showBtn={false} />
                    </div>
                );
    };
    return (
        <>
          <div className="rightDashboard" style={{marginTop:'7%'}}>
          <h1 className="h1-text">
          <i className="fa fa-database" aria-hidden="true"></i>Rating  
        </h1>
            <div className="main-rating-contianer">
                {renderCurrentView()}
            </div>
        </div>
        </>
    );
}
