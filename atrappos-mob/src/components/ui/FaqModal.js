import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../App";
import {Modal, Button} from "react-bootstrap";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {sendGaEvent} from "../../lib/utils";


export const FaqModal = () => {
    const {state, dispatch} = useContext(AppContext);
    const [show, setShow] = useState(false);



    const handleClose = () => {
        dispatch({...state, showFaqModal: false})
    };

    useEffect(()=> {
        setShow(state.showFaqModal);
        if (state.showFaqModal) {
            sendGaEvent({category: 'show-faq', action: 'user-action'});
        }

    }, [state.showFaqModal]);


    return (
        <Modal show={show}
               onHide={handleClose}
               backdrop="static"
               backdropClassName="faq-backdrop"
               dialogClassName="faq-dialog">
            <Modal.Header closeButton>
                <Modal.Title as="h3">FAQ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="faq__container">
                   TODO FAQ text
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="faq__btn"
                        onClick={handleClose}>
                    <i><FontAwesomeIcon icon={faCheck} /></i>
                    <span>Got it!</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
