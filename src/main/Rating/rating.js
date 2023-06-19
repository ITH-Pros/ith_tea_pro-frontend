/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState } from "react";
import "react-date-picker/dist/DatePicker.css";
import "./rating.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import ViewRatings from "./View-Rating";
import { useLocation } from "react-router-dom";
import { FaUser, FaHome, FaGem, FaList, FaRegLaughWink } from "react-icons/fa";
import {
  Row,
  Container,
  Nav,
  Dropdown,
  Card,
  Button,
  Badge,
  Modal,
  Popover,
  Col,
} from "react-bootstrap";

export default function Rating(props) {
  const location = useLocation();
  let today = new Date();
  let patchDateValue =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1 <= 9
      ? "0" + (today.getMonth() + 1)
      : today.getMonth() + 1) +
    "-" +
    (today.getDate() <= 9 ? "0" + today.getDate() : today.getDate());
  const [team, setTeam] = useState("");
  const [date, setDate] = useState(patchDateValue);

  if (!team && location && location.state && location.state.userId) {
    setTeam(location.state.userId);
  }
  if (
    location &&
    location.state &&
    location.state.date &&
    location.state.date !== date
  ) {
    setDate(location.state.date);
    location.state.date = "";
  }

  const renderCurrentView = () => {
    return (
      <div>
        <ViewRatings showBtn={false} />
      </div>
    );
  };
  return (
    // onClick={() => setModalShow(true)

    <>
      <div className="rightDashboard" style={{ marginTop: "7%" }}>
        <Row>
          <Col lg={6}>
            <h1 className="h1-text">
              <i>
                <FaRegLaughWink />
              </i>
              Team Rating
            </h1>
          </Col>
        </Row>

        <div className="main-rating-contianer">{renderCurrentView()}</div>
      </div>
    </>
  );
}
