import React from "react";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Loader from "../../../components/Loader";
import Toaster from "../../../components/Toaster";
import { CONSTANTS } from "../../../constants";
import { addNewUserDetail } from "../../../services/user/api";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function AddUser(props) {

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toaster, showToaster] = useState(false);
  const setShowToaster = (param) => showToaster(param);
  const navigate = useNavigate();
  const rolesList = CONSTANTS.ROLES;
  const registerFromFields = { name: "", email: "", role: rolesList[0] };
  const [registerFromValue, setRegisterFromValue] =
    useState(registerFromFields);

  const updateRegisterFormValue = (e) => {
    setRegisterFromValue({
      ...registerFromValue,
      [e.target.name]: e.target.value,
    });
  };

  function checkAllValuesPresent() {
    return Object.keys(registerFromValue).every(function (x) {
      if (x === "showPassword") return true;
      return registerFromValue[x];
    });
  }
  const submitRegisterFrom = async () => {
    setLoading(true);
    setValidated(true);
    try {
      if (!checkAllValuesPresent()) {
        setLoading(false);
        return;
      }
      const userRes = await addNewUserDetail(registerFromValue);
      setLoading(false);
      if (userRes.error) {
        setToasterMessage(userRes?.message || "Something Went Wrong");
        setShowToaster(true);
        return;
      } else {
        setToasterMessage("Success");
        setShowToaster(true);
        setRegisterFromValue(registerFromFields);
        setValidated(false);
        navigate("/team");
      }
    } catch (error) {
      setToasterMessage(error?.error?.message || "Something Went Wrong");
      setShowToaster(true);
      setLoading(false);
      return error.message;
    }
  };

  return (
    <div className="addUserFrom rightDashboard" style={{ marginTop: "7%" }}>
      <div className="backButton">
        <Link to="/team">
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </Button>
        </Link>
      </div>
      <Form noValidate validated={validated}>
        <Row className="mb-3 mt-3">
            
          <Form.Group as={Col} md="4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={updateRegisterFormValue}
              value={registerFromValue.name}
              name="name"
              placeholder="Name"
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Name is required !!
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group as={Col} md="4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              onChange={updateRegisterFormValue}
              value={registerFromValue.email}
              name="email"
              placeholder="Email id"
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Email is required !!
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group as={Col} md="4">
            <Form.Label>Role</Form.Label>
            <Form.Control
              required
              as="select"
              type="select"
              name="role"
              onChange={updateRegisterFormValue}
              value={registerFromValue.role}
            >
              <option value="" disabled>
                Select Role
              </option>
              {rolesList?.map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Row>

        <div style={{ marginRight: "10px" }} className="text-right">
          <Button
            className="btn-gradient-border btnDanger "
            type="button"
            onClick={submitRegisterFrom}
          >
            Submit
          </Button>
        </div>
      </Form>
      {toaster && (
        <Toaster
          message={toasterMessage}
          show={toaster}
          close={() => showToaster(false)}
        />
      )}
      {loading ? <Loader /> : null}
    </div>
  );
}
