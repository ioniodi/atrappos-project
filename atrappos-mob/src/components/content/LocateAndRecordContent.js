import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../App";
import {
    faRecordVinyl, faStop
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {EvaluationModalBtn} from "../ui/Buttons/EvaluationModalBtn";
import moment from "moment";
import {defaultObjectiveValue, defaultSubjectiveValue, idleTimeLimit} from "../../lib/constants";
import {DiscardPathBtn} from "../ui/Buttons/DiscardPathBtn";
import {SavePathBtn} from "../ui/Buttons/SavePathBtn";
import {SnapSwitch} from "../ui/SnapSwitch";
import {useSelector} from "react-redux";
import { usePageVisibility } from 'react-page-visibility';

export const LocateAndRecordContent = () => {
    const {state, dispatch} = useContext(AppContext);

    const [idleChecker, setIdleChecker] = useState(null);
    const consentReducer = useSelector(state => state.consent);

    const NoSleep =  require('nosleep.js');

    const isVisible = usePageVisibility();

    useEffect(()=> {
        if (!isVisible && state.recording) {
            setIdleChecker(new Date().getTime());
        }
        if (isVisible && state.recording) {
            let currentChecker =  new Date().getTime();
            if (currentChecker - idleChecker > idleTimeLimit ) {
                setIdleChecker(null);
                dispatch({
                    ...state,
                    recording: false,
                    clearMap: true,
                    objectiveSelection: defaultObjectiveValue,
                    subjectiveSelection: defaultSubjectiveValue,
                    pathEvaluated: false,
                    recordedPath: null,
                    area: null,
                    distance: null,
                    pathName: null,
                    pathDescr: null,
                    drawType: null,
                    drawn: null,
                    evaluations: [],
                    edited: [],
                    snapped: false,
                    notificationToast: {show: true, type: 'point-out-fail', msg: 'sleptPointOutFailToast'}
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    useEffect(() => {
        let noSleep = new NoSleep();
        if (state.recording) {
            dispatch({...state,
                clearMap: false,
                objectiveSelection: defaultObjectiveValue,
                subjectiveSelection: defaultSubjectiveValue,
                pathEvaluated: false,
                recordedPath: null,
                area: null,
                distance: null,
                pathName: null,
                pathDescr: null,
                drawType: 'location',
                drawStart: moment(new Date()),
                evaluations: [],
                edited: [],
                snapped: false,
                notificationToast: {show: true, type: 'point-out', msg: 'doNotSleepPointOutToast'}
            });
            noSleep.enable();
        } else {
            noSleep.disable();
        }
        DisableGpsBtn(state.recording);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.recording]);

    useEffect(()=> {
        if (!consentReducer.faqShown) {
            dispatch({...state, showFaqModal: true});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consentReducer.faqShown]);


    const GpsIsOn = (e) => {
        let gpsIsOn = document.getElementsByClassName("leaflet-control-locate leaflet-bar leaflet-control active");
        return gpsIsOn && gpsIsOn.length > 0;
    }

    const DisableGpsBtn = (disable) => {
        let gpsBtn = document.getElementsByClassName("leaflet-control-locate leaflet-bar leaflet-control active");
       if (gpsBtn && gpsBtn.length > 0) {
           gpsBtn[0].style.pointerEvents = disable ? "none" : "initial";
           if (disable) {
               gpsBtn[0].classList.add("disabled")
           } else {
               gpsBtn[0].classList.remove("disabled")
           }
       }
    }


    return (
        <div className="locate-and-record__content bottom__content">
            <h5>Record a path</h5>
            {!state.recordedPath ?
                <button className={"record__btn bottom-action__btn" + (state.recording ? " record__btn--recording": "")}
                        onClick={(e)=> {
                            if (GpsIsOn(e)) {
                                if (consentReducer.showSaveLocationConsent) {
                                    dispatch({...state, showSaveLocationConsentModal: true})
                                } else {
                                    dispatch({ ...state,
                                        recording: !state.recording,
                                    });
                                }
                            } else {
                                alert('The GPS must be activated in order to record a path.')
                            }
                        }}>
                    <i>
                        <FontAwesomeIcon icon={!state.recording ? faRecordVinyl : faStop} />
                    </i>
                    <span>{!state.recording ? "Start " : "Stop "} recording</span>
                </button>
            :null}
            {state.recording|| state.recordedPath ?
                <EvaluationModalBtn />:null
            }
            {state.recordedPath ?
              <React.Fragment>
                <SnapSwitch type={"recordedPath"}/>
                <DiscardPathBtn type="deleteRecordedPathModal" />
                <SavePathBtn type="saveRecordedPath" />
              </React.Fragment>
            :null
            }
        </div>
    );
};