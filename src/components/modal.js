import React from "react";
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
      show={modalShow}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title> {heading}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {modalBody}

        <button
          disabled={submitBtnDisabled}
          className="modal-close-btn"
          onClick={onClick}
        >
          {btnContent || "Submit"}
        </button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Modals;
