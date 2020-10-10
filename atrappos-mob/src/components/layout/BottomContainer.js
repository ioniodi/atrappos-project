import React, {useContext, useEffect, useState} from 'react';
import {LocateAndRecordContent} from "../content/LocateAndRecordContent";
import {DrawPathContent} from "../content/DrawPathContent";
import {PathListContent} from "../content/PathListContent";
import {CommunityPathListContent} from "../content/CommunityPathListContent";
import {withRouter} from "react-router-dom";
import {AppContext} from "../../App";


const BottomContainerComponent = (props) => {
    const {content, location} = props;
    const {state} = useContext(AppContext);
    const [expanded, setExpanded] = useState(state.bottomExpanded);
    const [recording, setRecording] = useState(false);
    const [recordedPath, setRecordedPath] = useState(false);

    useEffect(() => {

    },[]);

    useEffect(() => {
        if (expanded !== state.bottomExpanded) {
            setExpanded(state.bottomExpanded)
        }
    },[state.bottomExpanded, expanded]);

    useEffect(() => {
        setRecordedPath(state.recordedPath)
    },[state.recordedPath]);

    useEffect(() => {
        setRecording(state.recording)
    },[state.recording]);

    if (
        location.pathname.match(/home/) ||
        location.pathname.match(/register/) ||
        location.pathname.match(/login/) ||
        location.pathname.match(/change\/password/)
    ){
        return null;
    }


    const renderSwitch = (cont) => {
        switch(cont) {
            case "locateAndRecord":
                return <LocateAndRecordContent/>
            case "drawPath":
                return <DrawPathContent />
            case "pathList":
                return <PathListContent />
            case "communityPathList":
                return <CommunityPathListContent />
            default:
                return <LocateAndRecordContent/>
        }
    }

    return (
        <div className={"bottom-container" + (expanded ? " expanded": "") +
        (" " + location.pathname.replace("/", "")) +
        ((recording ? " recording": ""))+
        ((recordedPath ? " recorded-path": "")) +
        ((state.drawnPath ? " drawn-path": "")) +
        ((state.selectedPath ? " selected-path": ""))}>
            <div className="bottom-container__content">
                {renderSwitch(content)}
            </div>
        </div>
    );
};

export const BottomContainer = withRouter(BottomContainerComponent);