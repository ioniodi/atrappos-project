import React, {useContext} from 'react';
import {AppContext} from "../../App";
import {PathListView} from "./PathListView";
import {EvaluationModalBtn} from "../ui/Buttons/EvaluationModalBtn";
import {EditPathBtn} from "../ui/Buttons/EditPathBtn";
import {SavePathBtn} from "../ui/Buttons/SavePathBtn";
import {SnapSwitch} from "../ui/SnapSwitch";
import {BackToListBtn} from "../ui/Buttons/BacktoListBtn";

export const PathListContent = () => {
    const {state} = useContext(AppContext);
    return (
        <div className="path-list__content bottom__content">
            <h5>
                {!!state.selectedPath ?
                    <BackToListBtn />
                :null}
                    <span>
                        {!!state.selectedPath ? "Modifying " + state.pathName : "My paths" }
                    </span>
            </h5>
                <React.Fragment>
                {!state.selectedPath ?
                    <PathListView />:
                    <React.Fragment>
                        <EvaluationModalBtn />
                            {state.drawType && state.drawType === "location" ?
                                <SnapSwitch type={"selectedPath"}/>:null
                            }
                        {state.drawType === 'phone' || state.drawType === 'desktop' ?
                        <EditPathBtn />:null}
                        <SavePathBtn type="saveSelectedPath" />
                    </React.Fragment>
                }
            </React.Fragment>
        </div>
    );
};
