import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSlash} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";
import {mapEvent} from "../../lib/utils";
import moment from "moment";



export const DrawPathBtn = (props) => {
    const {state, dispatch} = useContext(AppContext);

    return (
        <button className="draw-path__btn bottom-action__btn"
                disabled={state.disableDraw}
                onClick={(e)=> {
                    dispatch({...state, drawing: true, drawStart: moment(new Date())})
                    mapEvent(e, "leaflet-draw-draw-polyline")
                }}>
            <i>
                <FontAwesomeIcon icon={faSlash} />
            </i>
            <span>{state.drawing ? "Drawing..." : "Draw"}</span>
        </button>
    );
};
