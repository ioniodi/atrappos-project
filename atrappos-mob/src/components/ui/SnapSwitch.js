import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../App";
import localforage from "localforage";
import pathService from "../../services/pathService";
import {useSelector} from "react-redux";
import InfoTooltip from "./InfoTooltip";
import {tooltipContent} from "../../lib/constants";
import {sendGaEvent} from "../../lib/utils";


export const SnapSwitch = (props) => {
    const {type} = props;
    const {state, dispatch} = useContext(AppContext);
    const [snapped, setSnapped] = useState(0);
    const [currCoords, setCurrCoords] = useState([]);
    const [alreadyChecked, setAlreadyChecked] = useState(false);
    const [fetchingSnap, setFetchingSnap] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    const pathsReducer = useSelector(state => state.paths);

    const offlineReducer = useSelector(state => state.offline);


    useEffect(() => {
        if (type === 'recordedPath') {
            setCurrCoords(state.recordedPathOriginal.geometry.coordinates);
        }
        if (type === 'selectedPath') {
            setCurrCoords(state.selectedPathOriginal.geometry.coordinates);
            setAlreadyChecked(state.selectedPathOriginal.snapped);
        }
    }, [type, state.recordedPathOriginal, state.selectedPathOriginal]);

    useEffect(() => {
      setIsOffline(!offlineReducer.online)
    }, [offlineReducer.online]);

    useEffect(()=> {
        setFetchingSnap(pathsReducer.snappedPath.fetching);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathsReducer.snappedPath.fetching]);


    const onChange = (e) => {
        if (e.target.checked) {
            sendGaEvent({category: "snap-" + type + "-action", action: 'map-action'});
            let nSnapped = snapped + 1;
            setSnapped(nSnapped);
            localforage.getItem('snapped-path').then((value)=> {
                if (!value) {
                    let coords = currCoords.join(';');
                    let radius = [];
                    currCoords.forEach(element => {
                        radius.push(10);
                    });
                    pathService.snapPath(coords, radius.join(';')).then((res)=> {
                        localforage.setItem('snapped-path', res).then((val)=> {
                            dispatch({...state, snapped: true});
                        });
                    }, (err)=> {
                        dispatch({
                            ...state,
                            notificationToast: {show: true, type: 'error', msg: 'snapToRoadErrorToast'}
                        });
                    })
                } else {
                    dispatch({...state, snapped: true});
                }
            })
        } else {
            dispatch({...state, snapped: false});
        }
    }

    return (
        <React.Fragment>
            {!isOffline ?
            <div className="snap">
                <InfoTooltip id={'snap-info'} placement="right"
                             clsName="snap-tltp"
                             gaEvent={"snap-" + type + "-info"}
                             content={tooltipContent[type === 'selectedPath' ? 'snapAfter': 'snapBefore']}/>
                <div className="snap__label">
                    Match to roads
                </div>
                <div className="snap__switch">
                    <label className={"switch" + (alreadyChecked || fetchingSnap ? " disabled" : "") }>
                        <input className="switch-input"
                               onChange={onChange}
                               disabled={alreadyChecked || fetchingSnap}
                               checked={(type === 'selectedPath' ? alreadyChecked || state.snapped : state.snapped)}
                               type="checkbox"/>
                        <span className="switch-label" data-on="ON" data-off="OFF"></span>
                        <span className="switch-handle"></span>
                    </label>
                </div>
            </div>:null}
        </React.Fragment>
    );
};
