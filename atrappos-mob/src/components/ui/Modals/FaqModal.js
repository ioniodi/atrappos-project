import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../App";
import {Modal, Button} from "react-bootstrap";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {sendGaEvent} from "../../../lib/utils";
import {FaqContent} from "../FaqContent";
import {useDispatch, useSelector} from "react-redux";
import {setFaqShown} from "../../../actions/pathsActions";


export const FaqModal = () => {
    const {state, dispatch} = useContext(AppContext);
    const [show, setShow] = useState(false);

    const reduxDispatch = useDispatch();

    const pathsReducer = useSelector(state => state.paths);

    const handleClose = () => {
        dispatch({...state, showFaqModal: false});
        reduxDispatch(setFaqShown(true));
    };

    useEffect(()=> {
        setShow(state.showFaqModal && pathsReducer.rehydrated);
        if (state.showFaqModal) {
            sendGaEvent({category: 'show-faq', action: 'user-action'});
        }
    }, [state.showFaqModal, pathsReducer.rehydrated]);

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
                    <FaqContent />
                </div>
                <div className="faq__btn--wrapper">
                    <Button className="faq__btn"
                            onClick={handleClose}>
                        <i>
                            <FontAwesomeIcon icon={faCheck} />
                        </i>
                        <span>Ok!</span>
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};
