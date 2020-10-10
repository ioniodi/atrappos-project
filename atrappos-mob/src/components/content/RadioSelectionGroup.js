import React from 'react';
import RadioSelection from "../ui/RadioSelection";
import {objectiveTypes, subjectiveTypes, tooltipContent} from "../../lib/constants";
import InfoTooltip from "../ui/InfoTooltip";

export const RadioSelectionGroup = (props) => {
    const {setValues} = props;
    return (
       <div className="select-sub-obj">
           <div className={"path-actions path-actions--objective"}  key={"objective-types"}>
               <label className="path-actions--label path-actions--label__evaluation">How satisfying do you consider the walking activity in this path?<br/>
                   <span>Focus on the <b>&nbsp;walking&nbsp;</b> experience
                        <InfoTooltip id='walkability-evaluation-btn-tltp'
                                     placement="bottom"
                                     clsName="path-evaluation-walkability"
                                     gaEvent="select-walkability-evaluation-info"
                                     content={tooltipContent["walkability"]}/>
                   </span>
               </label>
               <span className="path-actions--caption">(Defines path's width)</span>
           </div>
           <RadioSelection list={objectiveTypes}
                           setValues={setValues}
                           type={'objective'}
           />
           <div className={"path-actions path-actions--subjective"} key={"subjective-types"}>
               <label className="path-actions--label path-actions--label__evaluation">How aesthetically pleasing do you find the landscapes in this path?<br/>
                   <span>Focus on the <b>&nbsp;visual&nbsp;</b> experience
                        <InfoTooltip id='landscape-evaluation-btn-tltp'
                                     placement="bottom"
                                     clsName="path-evaluation-landscape"
                                     gaEvent="select-landscape-evaluation-info"
                                     content={tooltipContent["landscape"]}/>
                    </span>
               </label>
               <span className="path-actions--caption">(Defines path's color)</span>
           </div>
           <RadioSelection list={subjectiveTypes}
                           setValues={setValues}
                           type={'subjective'}
           />
       </div>
    );
};

