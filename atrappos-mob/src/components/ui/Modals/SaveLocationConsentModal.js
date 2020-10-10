import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../App";
import {Modal, Button} from "react-bootstrap";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDispatch, useSelector} from "react-redux";
import {setShowSaveLocationConsent} from "../../../actions/pathsActions";


export const SaveLocationConsentModal = () => {
    const {state, dispatch} = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [hideConsent, setHideConsent] = useState(false);

    const reduxDispatch = useDispatch();

    const pathsReducer = useSelector(state => state.paths);

    useEffect(()=> {
        setShow(state.showSaveLocationConsentModal && pathsReducer.rehydrated);
    }, [state.showSaveLocationConsentModal, pathsReducer.rehydrated]);

    const handleChange= (e) => {
        setHideConsent(e.target.checked);
    };

    const dispatchConsent = () => {
        reduxDispatch(setShowSaveLocationConsent(!hideConsent));
        if (hideConsent) {
            dispatch({
                ...state, recording: true, showSaveLocationConsentModal: false
            })
        } else {
            dispatch({
                ...state, recording: false, showSaveLocationConsentModal: false
            })
        }
    };

    return (
        <Modal show={show}
               backdrop="static"
               backdropClassName="consent-backdrop"
               dialogClassName="consent-dialog">
            <Modal.Header>
                <Modal.Title as="h3">Privacy Policy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="save-location-consent__container">
                    <p>
                       You will be able to save your recorded path in a database, so that you can view, edit or delete it later. <br/>
                       After saving it, it will also be visible to other users. However, it won't be connected with your identity by any means. <br/>
                       Other users won't be able to see your name, email or any relative information to your personal data.<br/>
                       The stored information will be used only for academic purposes and statistical reasons.
                    </p>
                    <label className="cbox-container location-consent">
                                    <span className="cbox-lbl-txt">
                                        I agree to store my recorded location data for academic purposes and statistical reasons
                                    </span>
                        <input type="checkbox"
                               onChange={handleChange}
                        />
                        <span className="cbox-checkmark"/>
                    </label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="save-location-consent__btn"
                        onClick={dispatchConsent}>
                    <i><FontAwesomeIcon icon={faCheck} /></i>
                    <span>Submit</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
