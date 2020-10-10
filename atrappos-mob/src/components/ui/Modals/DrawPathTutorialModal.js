import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../App";
import {Modal, Button} from "react-bootstrap";
import {faArrowsAltV, faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDispatch, useSelector} from "react-redux";
import {setShowDrawTutorial} from "../../../actions/pathsActions";
import tutorial from "../../../assets/img/tutorial.gif";
import moment from "moment";
import {mapEvent} from "../../../lib/utils";


export const DrawPathTutorialModal = () => {
    const {state, dispatch} = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [hideTutorial, setHideTutorial] = useState(false);

    const reduxDispatch = useDispatch();

    const pathsReducer = useSelector(state => state.paths);

    const gestures = ['gesture1', 'gesture2', 'gesture3', 'gesture4'];

    useEffect(()=> {
        setShow(state.showDrawPathTutorialModal && pathsReducer.rehydrated);
    }, [state.showDrawPathTutorialModal, pathsReducer.rehydrated]);


    const handleChange= (e) => {
        setHideTutorial(e.target.checked);
    };

    const dispatchConsent = (e) => {
        reduxDispatch(setShowDrawTutorial(!hideTutorial));
        dispatch({...state, showDrawPathTutorialModal: false, drawing: true, drawStart: moment(new Date())})
        mapEvent(e, "leaflet-draw-draw-polyline");
    };

    return (
        <Modal show={show}
               backdrop="static"
               backdropClassName="consent-backdrop"
               dialogClassName="consent-dialog">
            <Modal.Header>
                <Modal.Title as="h3">Moving the map while drawing</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="consent__container">
                    <img className="tutorial-preview" src={tutorial} alt='drawing  a path preview' />
                    <div className="tutorial_gestures">
                        {gestures.map((gest, idx)=> {
                            return <div key={'gesture-icon-' + idx} className={gest + ' gesture-sprite'} />
                        })}
                    </div>
                     <p>
                        <b>Only while drawing your path</b> you can move the map with just one finger (see the above example).<br/>
                        Swiping the map with two fingers is not necessary in this specific case.<br/>
                        This will help you draw your path easily with no interruptions to move the map.<br/>
                        Also, you cannot zoom the map while drawing.
                     </p>
                </div>
            </Modal.Body>
            <div className="consent__scroll--wrapper">
                <div className="consent__scroll">
                    <FontAwesomeIcon icon={faArrowsAltV} />
                </div>
            </div>
            <Modal.Footer>
                <label className="cbox-container tutorial-consent">
                        <span className="cbox-lbl-txt">
                            I understand, do not show this again.
                        </span>
                    <input type="checkbox"
                           onChange={handleChange}
                    />
                    <span className="cbox-checkmark"/>
                </label>
                <Button className="save-location-consent__btn"
                        onClick={(e)=> dispatchConsent(e)}>
                    <i><FontAwesomeIcon icon={faCheck} /></i>
                    <span>Ok!</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
