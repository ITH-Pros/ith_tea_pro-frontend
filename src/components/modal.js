import React, { memo } from 'react'
import Modal from 'react-bootstrap/Modal'
import './modal.css'
const Modals = (props) => {
    const { heading, modalBody, modalShow, onClick, onHide, keyboardProp, submitBtnDisabled, backdropProp, size, btnContent } = props;
    console.log(`Modals:`, props)
    return (
            <Modal
                onHide={onHide}
                show={modalShow}
            size={size || 'lg'}
            backdrop={backdropProp}
            keyboard={keyboardProp}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable={true}
                animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    <p>
                        {heading}
                    </p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='' >
                    {modalBody}
                </Modal.Body>
                <Modal.Footer>
                    <button disabled={submitBtnDisabled} className='modal-close-btn' onClick={onClick}>{btnContent || 'Submit'}</button>
                </Modal.Footer>
            </Modal>
    )
}

export default Modals 