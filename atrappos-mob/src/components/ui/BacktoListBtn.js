import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";
import {defaultObjectiveValue, defaultSubjectiveValue} from "../../lib/constants";

export const BackToListBtn = () => {
    const {state, dispatch} = useContext(AppContext);

    const noPathChanges = () => {

        let sameObjective = state.selectedPathOriginal.properties.objective === state.objectiveSelection;
        let sameSubjective = state.selectedPathOriginal.properties.subjective === state.subjectiveSelection;
        let didNotEdit = state.selectedPathOriginal.edited.length === state.edited.length;
        let sameName =  state.selectedPathOriginal.name === state.pathName;
        let sameDescr =  state.selectedPathOriginal.description === state.pathDescr;
        let sameSnapOpt = state.selectedPathOriginal.snapped === state.snapped;
        return sameObjective && sameSubjective &&
            didNotEdit && sameName && sameDescr &&
            sameSnapOpt;
    }

    const resetEditablePath = () => {
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
            snapped: false
        });
    }

    return (
        <button className="path-list__back"
                disabled={state.editProcedure}
                onClick={()=> {
                    if (noPathChanges()) {
                        resetEditablePath();
                    } else {
                        dispatch({...state, showDeleteModal:
                                {show: true, type: 'undoSelectedPathModal', msg: 'undoSelectedPathModal'}})}
                    }
                }>
            <i>
                <FontAwesomeIcon icon={faArrowLeft} />
            </i>
            <span>{"Back to list"}</span>
        </button>
    );
};
