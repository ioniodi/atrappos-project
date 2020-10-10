import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../App";
export default (props) => {
    const { list, type, setValues } = props;
    const [objSelectedValue, setObjSelectedValue] = useState(null);
    const [subjSelectedValue, setSubjSelectedValue] = useState(null);
    const {state} = useContext(AppContext)

    const onChange = (e, type) => {
        setValues(e, type);
        if (type === "objective") {
            setObjSelectedValue(e.target.value);
        } else {
            setSubjSelectedValue(e.target.value);
        }
    }

    useEffect(()=> {
        setObjSelectedValue(state.objectiveSelection)
    }, [state.objectiveSelection]);

    useEffect(()=> {
        setSubjSelectedValue(state.subjectiveSelection)
    }, [state.subjectiveSelection]);

    return (
        <div className={"selection-container " + type}>
            <div className="selection-tile-group">
                {list.map((el) => {
                    return <div className="input-container" key={el.className + "-key"}>
                        <input id={type + "-" + el.className}
                               checked={el.value === (type === 'objective' ? objSelectedValue : subjSelectedValue )}
                               onChange={(e)=> onChange(e, type)}
                               className="selection-button"
                               type="radio" name={"selection-" + type}
                               value={el.value}
                        />
                        <div className="selection-tile">
                            <label htmlFor={type + "-" + el.className}
                                   className={"selection-tile-label " + (type + "-" + el.className)}>
                                {el.label}
                            </label>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
};
