import React from 'react';
import {BottomContainer} from "../layout/BottomContainer";
import {withRouter} from "react-router-dom";

const PathListComponent = () => {
    return (
       <BottomContainer content={"pathList"} />
    );
};

export const  PathList  =  withRouter(PathListComponent);