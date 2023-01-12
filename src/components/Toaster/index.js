import React from 'react';
// import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import './Toaster.css';

function Toaster(props) {
    const { close, show, message } = props;
  return (
    <Row>
      <Col xs={6}>
        <ToastContainer className="p-3" position={`bottom-end`}>
          <Toast
            onClose={close}
            show={show}
            delay={4000}
            autohide >
                      <Toast.Body >
                            {message}
                      </Toast.Body>
          </Toast>
        </ToastContainer>
      </Col>
    </Row>
  );
}

export default Toaster;
