import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";
import {defaultObjectiveValue, defaultSubjectiveValue} from "../../lib/constants";
import localforage from "localforage";
import {useDispatch} from "react-redux";
import {editOnePath, saveOnePath} from "../../actions/actions";


export const SavePathBtn = (props) => {
    const {state, dispatch} = useContext(AppContext);
    const {type} = props;
    const [disableSaveEditablePath, setDisableSaveEditablePath] = useState(false);
    const reduxDispatch = useDispatch();



    const savePath = (path, type) => {
        path.area = state.area;
        path.distance = state.distance;
        path.name = state.pathName;
        path.description = state.pathDescr;
        path.drawType = state.drawType;
        path.drawn = state.drawn;
        path.evaluations = state.evaluations;
        path.edited = state.edited;
        path.properties.objective = state.objectiveSelection;
        path.properties.subjective = state.subjectiveSelection;
        path.snapped = state.snapped;
        if (type !== 'saveSelectedPath') {
            reduxDispatch(saveOnePath(path)).then(() => {
                dispatch({
                    ...state,
                    clearMap: true,
                    drawStart: null,
                    snapIt: {active: false, type: null},
                    objectiveSelection: defaultObjectiveValue,
                    subjectiveSelection: defaultSubjectiveValue,
                    showDeleteModal: {show: false, type: null, msg: null},
                    pathEvaluated: false,
                    recordedPath: null,
                    drawnPath: null,
                    area: null,
                    distance: null,
                    pathName: null,
                    pathDescr: null,
                    drawType: null,
                    drawn: null,
                    evaluations: [],
                    edited: [],
                    snapped: false,
                    notificationToast: {show: true, type: 'success', msg: type + 'SuccessToast'}
                })
                localforage.removeItem('snapped-path');
            }, () => {
                // TODO offline actions here
                dispatch({
                    ...state,
                    notificationToast: {show: true, type: 'error', msg: type + 'ErrorToast'}
                });
            });
        } else {
            reduxDispatch(editOnePath(path, path._id)).then((res) => {
                dispatch({
                    ...state,
                    snapIt: {active: false, type: null},
                    objectiveSelection: defaultObjectiveValue,
                    subjectiveSelection: defaultSubjectiveValue,
                    showDeleteModal: {show: false, type: null, msg: null},
                    pathEvaluated: false,
                    recordedPath: null,
                    drawnPath: null,
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
                    clearMap: true,
                    notificationToast: {show: true, type: 'success', msg: type + 'SuccessToast'}
                })
                localforage.removeItem('snapped-path');
            }, () => {
                // TODO offline actions here
                dispatch({
                    ...state,
                    notificationToast: {show: true, type: 'error', msg: type + 'ErrorToast'}
                });
            });

        }
    }


    const defineSaveAction = (type) => {
        switch (type) {
            case 'saveRecordedPath':
                return savePath(state.recordedPath, type);
            case 'saveDrawnPath':
                return savePath(state.drawnPath, type);
            case 'saveSelectedPath':
                return savePath(state.selectedPath, type);
            default:
                return null;
        }
    }

    useEffect(() => {
        if (type === 'saveSelectedPath') {
            let sameObjective = state.selectedPathOriginal.properties.objective===state.objectiveSelection;
            let sameSubjective = state.selectedPathOriginal.properties.subjective===state.subjectiveSelection;
            let didNotEdit = state.selectedPathOriginal.edited.length===state.edited.length;
            let sameName = state.selectedPathOriginal.name===state.pathName;
            let sameDescr = state.selectedPathOriginal.description===state.pathDescr;
            let sameSnapOpt = state.selectedPathOriginal.snapped===state.snapped;
            let res = sameObjective && sameSubjective && didNotEdit && sameName && sameDescr && sameSnapOpt;
            setDisableSaveEditablePath(res);
        } else {
            setDisableSaveEditablePath(false);
        }
    }, [type, state.selectedPathOriginal,
            state.objectiveSelection,
            state.subjectiveSelection,
            state.edited.length,
            state.pathName,
            state.pathDescr,
            state.snapped]);


    return (
        <button className="save-path__btn bottom-action__btn"
                disabled={state.editProcedure || disableSaveEditablePath}
                onClick={(e)=> {
                    if (state.pathEvaluated) {
                        defineSaveAction(type)
                    } else {
                        alert("You must evaluate your path before saving it.")
                    }
                }}>
            <i>
                <FontAwesomeIcon icon={faSave} />
            </i>
            <span>Save</span>
        </button>
    );
};
