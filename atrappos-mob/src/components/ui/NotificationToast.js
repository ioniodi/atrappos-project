import React, {useContext, useEffect, useState} from "react";
import {Toast} from "react-bootstrap";
import {
    faCheckCircle, faExclamationCircle, faSyncAlt,
    faTimesCircle, faHandPointRight, faThumbsDown

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {AppContext} from "../../App";
import {notificationMsgs, toastDelay, pointOutToastDelay} from "../../lib/constants";
import {useSelector} from "react-redux";

export const NotificationToast = (props) => {
    const {state, dispatch} = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('');
    const [type, setType] = useState(null);
    const [isOffline, setIsOffline] = useState(false);

    const handleClose = () => {
        dispatch({...state, notificationToast: {show: false, type: null, msg: null}});
    };

    const offlineReducer = useSelector(state => state.offline);

    useEffect(()=> {
        setShow(state.notificationToast.show);
        setType(state.notificationToast.type);
        setMsg(state.notificationToast.msg);
    }, [state.notificationToast]);

    useEffect(() => {
        setIsOffline(!offlineReducer.online);
    },[offlineReducer]);

    useEffect(() => {
        if (isOffline && notificationMsgs[msg + 'Offline']) {
            setType("warning");
        }
    },[isOffline, msg]);

    return (
        <div className="notification-toast__wrapper">
            <Toast className={"notification-toast " + (type)}
                   onClose={handleClose}
                   show={show}
                   delay={(type && !type.startsWith('point-out')) ? toastDelay : pointOutToastDelay} autohide >
                <Toast.Header>
                </Toast.Header>
                <Toast.Body>
                    <span>
                        {type === "success" ?
                            <FontAwesomeIcon icon={faCheckCircle} />:null}
                        {type === "error" ?
                            <FontAwesomeIcon icon={faTimesCircle} />:null}
                        {type === "info" ?
                            <FontAwesomeIcon icon={faSyncAlt} />:null}
                        {type === "warning" ?
                            <FontAwesomeIcon icon={faExclamationCircle} />:null}
                        {type === "point-out" ?
                            <FontAwesomeIcon icon={faHandPointRight} />:null}
                        {type === "point-out-fail" ?
                            <FontAwesomeIcon icon={faThumbsDown} />:null}
                    </span>
                    <span>{isOffline && notificationMsgs[msg + 'Offline'] ?
                        notificationMsgs[msg + 'Offline'] : notificationMsgs[msg]}</span>
                </Toast.Body>
            </Toast>
        </div>
    );
};
