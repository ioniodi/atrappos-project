import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";


export const CollapseNotification = (props) => {
    const {hasPaths} = props;
    return (
        <div className={"collapse__notification--wrapper" + (!hasPaths ? " no-paths": " has-paths")}>
            <div className="collapse__notification">
                <span>{"Click below to collapse and return to the map" + (hasPaths ?  " / see the results": "")}</span>
                <i><FontAwesomeIcon icon={faArrowDown} /></i>
            </div>
        </div>
    );
};

