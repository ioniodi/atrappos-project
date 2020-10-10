import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEraser} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";
import {mapEvent} from "../../lib/utils";



export const ErasePathBtn = (props) => {
    const {state, dispatch} = useContext(AppContext);

    return (
        <button className="erase-path__btn bottom-action__btn"
                disabled={state.erasing}
                onClick={(e)=> {
                    dispatch({...state, erasing: true})
                    mapEvent(e, "leaflet-draw-edit-remove")
                }}>
            <i>
                <FontAwesomeIcon icon={faEraser} />
            </i>
            <span>{state.erasing ? "Erasing..." : "Erase"}</span>
        </button>
    );
};
