import React from 'react'
import Modal from 'react-bootstrap/Modal'

const Modals = (props) => {
    console.log(`Modals:`)
    const { heading, modalBody, modalShow, onClick, onHide } = props;
    return (
        <>
            <Modal
                onHide={onHide}
                show={modalShow}
                backdrop="static"
                keyboard={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {heading}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalBody}
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-gradient-border ' onClick={onClick}>Submit</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Modals 