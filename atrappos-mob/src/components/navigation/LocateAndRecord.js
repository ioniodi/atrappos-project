import React from 'react';
import {BottomContainer} from "../layout/BottomContainer";
import {withRouter} from "react-router-dom";

const LocateAndRecordComponent = () => {
    return (
       <BottomContainer content={"locateAndRecord"} />
    );
};

export const  LocateAndRecord  =  withRouter(LocateAndRecordComponent);