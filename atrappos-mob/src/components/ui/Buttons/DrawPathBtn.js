import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSlash} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../../App";
import {mapEvent} from "../../../lib/utils";
import moment from "moment";
import {useSelector} from "react-redux";

export const DrawPathBtn = () => {
    const {state, dispatch} = useContext(AppContext);
    const consentReducer = useSelector(state => state.consent);

    return (
        <button className="draw-path__btn bottom-action__btn"
                disabled={state.disableDraw || state.drawing}
                onClick={(e)=> {
                    if (consentReducer.showDrawTutorial) {
                        dispatch({...state, showDrawPathTutorialModal: true})
                    } else {
                        dispatch({...state, drawing: true, drawStart: moment(new Date())})
                        mapEvent(e, "leaflet-draw-draw-polyline");
                    }
                }}>
            <i>
                <FontAwesomeIcon icon={faSlash} />
            </i>
            <span>{state.drawing ? "Drawing..." : "Draw"}</span>
        </button>
    );
};
