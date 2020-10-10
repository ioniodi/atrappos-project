import React, {useContext, useEffect, useState} from 'react';
import localforage from "localforage";
import {AppContext} from "../../App";
import InfoTooltip from "./InfoTooltip";
import {tooltipContent} from "../../lib/constants";


export const PathInput = (props) => {
    const {type, label, placeholder, setValues} = props;
    const {state, dispatch} = useContext(AppContext);
    const [name, setName] = useState(null);

    useEffect(() => {
        if (!state.pathName) {
            localforage.getItem("userPathsLength").then(function(val) {
               setName("Path " + (val + 1));
               dispatch({...state, pathName: "Path " + (val + 1)})
            });
        } else {
            setName(state.pathName)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.pathName]);

    return (
        <div className="path-input__wrapper">
            <div className="path-input">
                {type === "path-description" ?
                    <div className="path-description__wrapper">
                        <InfoTooltip id={'path-description-info'} placement="top"
                                     clsName="path-description-tltp"
                                     gaEvent="add-description-tag-info"
                                     content={tooltipContent['description']}/>
                        <label className="path-actions--label"
                               htmlFor={type}>
                            {label}
                        </label>
                    </div>:
                    <label className="path-actions--label"
                           htmlFor={type}>
                        {label}
                    </label>
                }

                <input type="text"
                       id={type}
                       name={type}
                       placeholder={placeholder}
                       defaultValue={type === "path-name" ? name : state.pathDescr}
                       onChange={(e)=> setValues(e, type)}/>
            </div>
        </div>
    );
};