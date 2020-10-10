import React, {useContext, useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {RadioSelectionGroup} from "../content/RadioSelectionGroup";
import {AppContext} from "../../App";
import moment from "moment";
import {PathInput} from "./PathInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {defaultObjectiveValue, defaultSubjectiveValue} from "../../lib/constants";

export const EvaluationModal= (props) => {
    const [objSelectedValue, setObjSelectedValue] = useState(null);
    const [subjSelectedValue, setSubjSelectedValue] = useState(null);
    const [pathName, setPathName] = useState(null);
    const [pathDescr, setPathDescr] = useState(null);
    const [valuesDispatched, setValuesDispatched] = useState(false);
    const {state, dispatch} = useContext(AppContext);

    const handleClose = () => {
        dispatch({...state, showEvaluationModal: false})
    }

    useEffect(() => {
        if (valuesDispatched) {
            handleClose();
            setValuesDispatched(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[valuesDispatched]);


    useEffect(() => {
        if (state.selectedPath || state.pathName) {
            setPathName(state.pathName)
        }
    },[state.selectedPath, state.pathName]);

    useEffect(()=> {
        setObjSelectedValue(state.objectiveSelection)
    }, [state.objectiveSelection]);

    useEffect(()=> {
        setSubjSelectedValue(state.subjectiveSelection)
    }, [state.subjectiveSelection]);

    const setValues = (e, type) => {
        switch(type) {
            case "objective":
                setObjSelectedValue(e.target.value)
                break;
            case "subjective":
                setSubjSelectedValue(e.target.value)
                break;
            case "path-name":
                let name = e.target.value;
                name = !name || name.trim() === "" ? null : name;
                setPathName(name);
                break;
            case "path-description":
                let descr = e.target.value;
                descr = !descr || descr.trim() === "" ? null : descr;
                setPathDescr(descr);
                break;
            default:
                return null;
        }
    }

    const defineEvalState = () => {
        switch (true) {
            case !!state.recording:
                return 'beforeDraw';
            case !!state.recordedPath:
                return 'afterDraw';
            case !!state.drawnPath:
                return 'afterDraw';
            case !!state.selectedPath:
                return 'afterSave';
            default:
                return 'beforeDraw';
        }
    }

    const disableSubmitEditablePath = () => {
        if (!!state.selectedPath) {
            let sameObjective = state.selectedPathOriginal.properties.objective === objSelectedValue;
            let sameSubjective = state.selectedPathOriginal.properties.subjective === subjSelectedValue;
            let sameName =  state.selectedPathOriginal.name === pathName;
            let sameDescr =  state.selectedPathOriginal.description === pathDescr;
            return sameObjective && sameSubjective && sameName && sameDescr;
        } else {
            return false;
        }
    }

    const dispatchValues = () => {
        // let evaluations = [...state.evaluations];
        let evalObj = {date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), state: defineEvalState()}
        // evaluations.push(evalObj);
        // console.log('evaluations', evaluations);
        dispatch({...state,
            objectiveSelection: objSelectedValue,
            subjectiveSelection: subjSelectedValue,
            pathEvaluated: true,
            pathName: pathName,
            pathDescr: pathDescr,
            evaluations: [...state.evaluations, evalObj]})
            setValuesDispatched(true);
    }


    return (
        <Modal show={state.showEvaluationModal}
               onHide={handleClose}
               backdropClassName="evaluation-backdrop"
               dialogClassName="evaluation-dialog"
               backdrop="static">
            <Modal.Header>
                <Modal.Title as="h3">
                    Path evaluation & features
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PathInput type="path-name"
                           label="Name"
                           placeholder="Type a path name"
                           setValues={setValues}
                />
                <RadioSelectionGroup setValues={setValues}/>
                <PathInput type="path-description"
                           label="Tag (Optional)"
                           placeholder="Type any useful info"
                           setValues={setValues}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="evaluation__btn evaluation__btn--cancel"
                    variant="secondary" onClick={handleClose}>
                    <i>
                        <FontAwesomeIcon icon={faTimes} />
                    </i>
                    <span>
                        Cancel
                    </span>
                </Button>
                <Button
                    className="evaluation__btn evaluation__btn--submit"
                    disabled={(!state.selectedPath &&
                        (objSelectedValue === defaultObjectiveValue ||
                        subjSelectedValue === defaultSubjectiveValue || !pathName)) ||
                    (!!state.selectedPath && disableSubmitEditablePath())}
                    variant="primary" onClick={dispatchValues}>
                    <i>
                        <FontAwesomeIcon icon={faCheck} />
                    </i>
                    <span>
                        Submit Evaluation
                    </span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

