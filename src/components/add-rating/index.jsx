/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import "../rating.css";
import {
  addRatingOnTask,
  getAllAssignedProject,
  getAllUsers,
  getProjectByProjectId,
  getRatingList,
  getTaskDetailsByProjectId,
} from "@services/user/api";

import Loader from "@components/Shared/Loader";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
// import { useAuth } from "../../../auth/AuthProvider";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Textarea } from "@nextui-org/react";
import { CheckLg } from "react-bootstrap-icons";
import RatingModalBody from "@pages/Rating/add-rating-modal";

export default function AddRating(props) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      {/* <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RatingModalBody />
        </Modal.Body>
      </Modal> */}
      <Offcanvas
        className="Offcanvas-modal"
        style={{ width: "500px" }}
        show={modalShow}
        onHide={() => setModalShow(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> Add Rating</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <RatingModalBody />
        </Offcanvas.Body>
      </Offcanvas>

      {!modalShow && (
        <Button
          variant="primary"
          size="sm"
          style={{ fontSize: "10px" }}
          onClick={() => setModalShow(true)}
        >
          Add Rating
        </Button>
      )}
    </>
  );
}
