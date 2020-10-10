import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare, faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";



export const EvaluationModalBtn = () => {
    const {state, dispatch} = useContext(AppContext);

    return (
        <button className={"show-eval-modal__btn bottom-action__btn" + (state.pathEvaluated ? " evaluated": "")}
                disabled={state.editProcedure || state.drawing}
                onClick={()=> dispatch({...state, showEvaluationModal: true})}>
          <i>
              <FontAwesomeIcon icon={state.pathEvaluated ? faCheckSquare : faExclamationCircle} />
          </i>
          <span>Evaluation & Features</span>
        </button>
    );
};

