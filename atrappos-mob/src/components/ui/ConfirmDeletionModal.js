import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faTrash, faUndoAlt} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";
import {Modal, Button} from "react-bootstrap";
import {defaultObjectiveValue, defaultSubjectiveValue, notificationMsgs} from "../../lib/constants";
import localforage from "localforage";
import {deleteOnePath} from "../../actions/actions";
import {useDispatch} from "react-redux";
import {sendGaEvent} from "../../lib/utils";

export const ConfirmDeletionModal = (props) => {
    const {state, dispatch} = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('');
    const [type, setType] = useState(null);
    const [pathId, setPathId] = useState(null);

    const reduxDispatch = useDispatch()

    const handleClose = () => {
        dispatch({...state, showDeleteModal: {show: false, msg: null, type: null, id: null}})
    };

    useEffect(()=> {
        setShow(state.showDeleteModal.show);
        setMsg(state.showDeleteModal.msg);
        setType(state.showDeleteModal.type);

        setPathId(state.showDeleteModal.id);
        // if (state.showDeleteModal.show && state.showDeleteModal.type === 'deleteSelectedPathModal') {
        //     dispatch({...state, reFetch: false})
        // }
    }, [state.showDeleteModal]);

    const discardRecordedPath = () => {
        dispatch({
            ...state,
            clearMap: true,
            drawStart: null,
            objectiveSelection: defaultObjectiveValue,
            subjectiveSelection: defaultSubjectiveValue,
            showDeleteModal: {show: false, type: null, msg: null, id: null},
            pathEvaluated: false,
            recordedPath: null,
            area: null,
            distance: null,
            pathName: null,
            pathDescr: null,
            drawType: null,
            drawn: null,
            evaluations: [],
            edited: [],
            snapped: false,
            notificationToast: {show: true, type: 'success', msg: 'deletedRecordedPathToast'}
        });
        sendGaEvent({category: "discard-recorded-path", action: 'location-map-action'});
        localforage.removeItem('snapped-path');

    }

    const deleteSelectedPath = () => {
        // pathService.deleteOne(pathId).then((res) => {
        let visibleUserPathsCopy = state.visibleUserPaths ? JSON.parse(JSON.stringify(state.visibleUserPaths)) : null;
        if (state.visibleUserPaths && state.visibleUserPaths.length > 0 &&
            state.visibleUserPaths.filter(path => path._id === pathId).length > 0
        ) {
            visibleUserPathsCopy = visibleUserPathsCopy.filter(function( path ) {
                return path._id !== pathId;
            });
        }
        reduxDispatch(deleteOnePath(pathId)).then((res) => {
            dispatch({
                ...state,
                clearMap: true,
                objectiveSelection: defaultObjectiveValue,
                subjectiveSelection: defaultSubjectiveValue,
                showDeleteModal: {show: false, type: null, msg: null, id: null},
                pathEvaluated: false,
                recordedPath: null,
                area: null,
                distance: null,
                pathName: null,
                pathDescr: null,
                drawType: null,
                drawn: null,
                evaluations: [],
                edited: [],
                snapped: false,
                showPathListModal: false,
                visibleUserPaths: visibleUserPathsCopy ? visibleUserPathsCopy: [],
                notificationToast: {show: true, type: 'success', msg: 'deleteSelectedPathSuccessToast'}
            });
            sendGaEvent({category: "delete-path", action: 'db-action'});
        }, (error)=> {
            dispatch({
                ...state,
                showDeleteModal: {show: false, type: null, msg: null, id: null},
                notificationToast: {show: true, type: 'error', msg: 'deleteSelectedPathErrorToast'}
            })
        });

    }

    const undoSelectedPath = () => {
        dispatch({
            ...state,
            clearMap: true,
            objectiveSelection: defaultObjectiveValue,
            subjectiveSelection: defaultSubjectiveValue,
            showDeleteModal: {show: false, type: null, msg: null, id: null},
            pathEvaluated: false,
            selectedPath: null,
            area: null,
            distance: null,
            pathName: null,
            pathDescr: null,
            drawType: null,
            drawn: null,
            evaluations: [],
            edited: [],
            snapped: false,
            notificationToast: {show: true, type: 'success', msg: 'undoSelectedPathToast'}
        });
        localforage.removeItem('snapped-path');
    }


    const defineModalAction = (type) => {
        switch (type) {
            case 'deleteRecordedPathModal':
                return discardRecordedPath();
            case 'deleteSelectedPathModal':
                return deleteSelectedPath();
            case 'undoSelectedPathModal':
                return undoSelectedPath();
            default:
                return null;
        }
    }

    return (
        <Modal show={show}
               onHide={handleClose}
               backdrop="static"
               backdropClassName="warning-backdrop"
               dialogClassName="warning-modal">
            <Modal.Header>
                <Modal.Title as="h3" className={type !== "undoSelectedPathModal" ?
                    "delete": "discard"}>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>{notificationMsgs[msg]}</Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={handleClose}>
                    <span><FontAwesomeIcon icon={faTimes} /></span>
                    <span>{type !== "undoSelectedPathModal" ? "No, keep it" : "No, continue"}</span>
                </Button>
                <Button variant={type !== "undoSelectedPathModal" ? "danger" : "warning"} onClick={()=> defineModalAction(type)}>
                    <span><FontAwesomeIcon icon={type !== "undoSelectedPathModal" ? faTrash : faUndoAlt} /></span>
                    <span>{type !== "undoSelectedPathModal" ? "Yes, delete" : "Yes, return"}</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
