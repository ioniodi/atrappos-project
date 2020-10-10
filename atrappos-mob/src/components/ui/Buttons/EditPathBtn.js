import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../../App";
import {mapEvent} from "../../../lib/utils";


export const EditPathBtn = () => {
    const {state} = useContext(AppContext);

    return (
        <button className="edit-path__btn bottom-action__btn"
            disabled={state.eraseProcedure}
            onClick={(e)=> {
                mapEvent(e, "leaflet-draw-edit-edit")}}>
            <i>
                <FontAwesomeIcon icon={faEdit} />
            </i>
            <span>{state.editProcedure ? "Editing..." : "Edit"}</span>
        </button>
    );
};
