import React from 'react'
import Modal from 'react-bootstrap/Modal'
import './modal.css'
const Modals = (props) => {
    const { heading, modalBody, modalShow, onClick, onHide, keyboardProp, submitBtnDisabled, backdropProp, size, btnContent } = props;
    console.log(`Modals:`, props)
    return (
        <>
            <Modal
                onHide={onHide}
                show={modalShow}
                // backdrop={backdropProp}
                // keyboard={keyboardProp}
                size={size || 'lg'}
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
                    <button disabled={submitBtnDisabled} className='btn btn-gradient-border' onClick={onClick}>{btnContent || 'Submit'}</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Modals 