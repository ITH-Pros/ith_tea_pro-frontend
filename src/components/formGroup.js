import React from 'react'
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const Formgroup = (props) => {
  const { label, controlId, children, errorMessage, feedback } = props;
  return (
    <Form.Group as={Col} md="12" controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      {
        children
      }
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
      <Form.Control.Feedback>{feedback}</Form.Control.Feedback>
    </Form.Group>)
}

export default Formgroup 