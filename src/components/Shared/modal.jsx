import React from "react";
import { Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Offcanvas from "react-bootstrap/Offcanvas";

const Modals = (props) => {
  const {
    heading,
    modalBody,
    modalShow,
    onClick,
    onHide,
    submitBtnDisabled,
    backdropProp,
    keyboardProp,
    size,
    btnContent,
    loading,
  } = props;
  return (
    // <Modal
    //   onHide={onHide}
    //   show={modalShow}
    //   size={size || "lg"}
    //   backdrop={backdropProp}
    //   keyboard={keyboardProp}
    //   aria-labelledby="contained-modal-title-vcenter"
    //   centered
    //   scrollable={true}
    //   animation={false}
    // >
    //   <Modal.Header closeButton>
    //     <Modal.Title id="contained-modal-title-vcenter">
    //       <p>{heading}</p>
    //     </Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body bsPrefix="">{modalBody}</Modal.Body>
    //   <Modal.Footer>
    //     <button
    //       disabled={submitBtnDisabled}
    //       className="modal-close-btn"
    //       onClick={onClick}
    //     >
    //       {btnContent || "Submit"}
    //     </button>
    //   </Modal.Footer>
    // </Modal>
    <Offcanvas
      className="Offcanvas-modal"
      style={{ width: "500px" }}
      onHide={onHide}
      show={modalShow && !loading }
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title> {heading}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {modalBody}

        <button
          disabled={submitBtnDisabled}
          className="btn btn-primary mt-3 pull-right"
          onClick={onClick}
        >
          {btnContent || "Submit"} {loading && <Spinner animation="border" />}
        </button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Modals;
