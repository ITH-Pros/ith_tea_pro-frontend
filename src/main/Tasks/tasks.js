import React from 'react';
import './tasks.css';
import Modal from 'react-bootstrap/Modal'
import Accordion from 'react-bootstrap/Accordion';

export default function Tasks() {
  const [modalShow, setModalShow] = React.useState(false);


  return (
    <>
      <div className='tasks'>
        <button className='btn btn-gradient-border btn-glow' style={{ float: "left" }}>Filter </button>
        <button className='clrfltr btn btn-gradient-border btn-glow' >Clear Filter</button>
        <button className='btn btn-gradient-border btn-glow' variant="primary" onClick={() => setModalShow(true)} style={{ float: "right" }}>Add Tasks</button>
      </div>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
      />

      <div className='mt-5'>
        <Accordion defaultActiveKey="0" className='mt-5'>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Cex MM / Addhock  #1</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Cex MM / FrontEnd  #2</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </div>


    </>
  )
};




function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-gradient-border ' onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}
