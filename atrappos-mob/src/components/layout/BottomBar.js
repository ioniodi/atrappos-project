import React, {useContext, useEffect, useState} from 'react';
import {NavLink, withRouter} from "react-router-dom";
import {
    faChevronUp,
    faDrawPolygon,
    faLocationArrow,
    faRoute, faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {AppContext} from "../../App";
import {handleNavClick} from "../../lib/utils";

const BottomBarComponent = (props) => {
    const {location} = props;
    const {state, dispatch} = useContext(AppContext);
    const [recording, setRecording] = useState(false);
    const [recordedPath, setRecordedPath] = useState(false);
    const [drawing, setDrawing] = useState(false);;
    const [drawnPath, setDrawnPath] = useState(false);
    const [selectedPath, setSelectedPath] = useState(false);


    useEffect(() => {
        setRecording(state.recording);
    }, [state.recording]);

    useEffect(() => {
        setRecordedPath(!!state.recordedPath);
    }, [state.recordedPath]);

    useEffect(() => {
        setDrawing(!!state.drawing);
    }, [state.drawing]);

    useEffect(() => {
        setDrawnPath(!!state.drawnPath);
    }, [state.drawnPath]);

    useEffect(() => {
        setSelectedPath(!!state.selectedPath);
    }, [state.selectedPath]);

        if (
            location.pathname.match(/home/) ||
            location.pathname.match(/register/) ||
            location.pathname.match(/login/) ||
            location.pathname.match(/incompatible/) ||
            location.pathname.match(/change\/password/)
        ){
            return null;
        }



    return (
       <div className="bottom-bar">
           <div className="toggle-expand" onClick={()=> dispatch({...state, bottomExpanded: !state.bottomExpanded})}>
               <i className={state.bottomExpanded ? "down" : "up"}>
                   <FontAwesomeIcon icon={faChevronUp} />
               </i>
           </div>
           <nav>
               <div className="bottom-bar__part bottom-bar__part--left">
                   <NavLink to={"/location"}
                            onClick={(e)=> {handleNavClick(e, (recording || recordedPath || selectedPath || drawing || drawnPath))}}
                            className={drawing || drawnPath || selectedPath ? "disabled" : ""}
                            activeClassName="--active">
                       <i><FontAwesomeIcon icon={faLocationArrow} /></i>
                       <span>LOCATION</span>
                   </NavLink>
                   <NavLink to={"/draw"}
                            onClick={(e)=> {handleNavClick(e, (recording || recordedPath || selectedPath || drawing || drawnPath ))}}
                            className={recording || recordedPath || selectedPath ? "disabled" : ""}
                            activeClassName="--active">
                       <i className="polyline-icon"><FontAwesomeIcon icon={faDrawPolygon} /></i>
                       <span>DRAW</span>
                   </NavLink>
               </div>
               <div className="bottom-bar__part bottom-bar__part--right">
                   <NavLink to={"/pathlist"}
                            onClick={(e)=> {handleNavClick(e, (recording || recordedPath || selectedPath || drawing || drawnPath))}}
                            className={recording || recordedPath || drawing || drawnPath ? "disabled" : ""}
                            activeClassName="--active">
                       <i><FontAwesomeIcon icon={faRoute} /></i>
                       <span>MY PATHS</span>
                    </NavLink>
                   <NavLink to={"/community"}
                            onClick={(e)=> {handleNavClick(e, (recording || recordedPath || selectedPath ||  drawing || drawnPath))}}
                            className={recording || recordedPath || drawing || drawnPath ? "disabled" : ""}
                            activeClassName="--active">
                       <i><FontAwesomeIcon icon={faUsers} /></i>
                       <span>COMMUNITY</span>
                   </NavLink>
               </div>
           </nav>
       </div>
    );
};

export const BottomBar = withRouter(BottomBarComponent);