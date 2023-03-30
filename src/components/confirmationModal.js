import React from "react";
import Modal from "react-bootstrap/Modal";
const ConfirmationModal = (props) => {
  const {
    heading,
    modalBody,
    modalShow,
    onHide,
    keyboardProp,
    backdropProp,
    size,
    onReject,
    onAccept,
  } = props;
  return (
    <>
      <Modal
        onHide={onHide}
        show={modalShow}
        backdrop={backdropProp}
        keyboard={keyboardProp}
        size={size || "lg"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {heading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-gradient-border" onClick={onReject}>
            {"No"}
          </button>
          <button className="btn btn-gradient-border" onClick={onAccept}>
            {"Yes"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ConfirmationModal;
