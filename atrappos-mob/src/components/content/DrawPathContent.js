import React, {useContext} from 'react';
import {EvaluationModalBtn} from "../ui/Buttons/EvaluationModalBtn";
import {EditPathBtn} from "../ui/Buttons/EditPathBtn";
import {SavePathBtn} from "../ui/Buttons/SavePathBtn";
import {AppContext} from "../../App";
import {DrawPathBtn} from "../ui/Buttons/DrawPathBtn";
import {ErasePathBtn} from "../ui/Buttons/ErasePathBtn";
import {DiscardPathBtn} from "../ui/Buttons/DiscardPathBtn";

export const DrawPathContent = (props) => {
    const {state} = useContext(AppContext);

    return (
        <div className="draw-path__content bottom__content">
            <h5>Draw a path</h5>
            {state.disableDraw && !state.drawnPath ?
                <div className="disable-draw__notification">
                    {"You need to zoom the map more to draw a path"}
                </div>:null
            }
            {!state.drawnPath ?
                <DrawPathBtn />
            :null
            }
            <EvaluationModalBtn />
            {state.drawnPath ?
                <React.Fragment>
                    <EditPathBtn />
                    <ErasePathBtn />
                    <DiscardPathBtn type="deleteDrawnPathModal" />
                    <SavePathBtn type="saveDrawnPath" />
                </React.Fragment>
                :null
            }
        </div>
    );
};