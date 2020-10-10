import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";

export const DiscardPathBtn = (props) => {
    const {state, dispatch} = useContext(AppContext);
    const {type} = props;

    return (
        <button className="discard-path__btn bottom-action__btn"
                disabled={state.editProcedure}
                onClick={(e)=> {dispatch({...state, showDeleteModal:
                        {show: true, type: type, msg: type }})}}>
            <i>
                <FontAwesomeIcon icon={faTrashAlt} />
            </i>
            <span>Discard</span>
        </button>
    );
};
