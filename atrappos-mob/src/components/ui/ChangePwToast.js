import React, {useEffect, useState} from "react";
import {Toast} from "react-bootstrap";
import {
    faCheckCircle,
    faTimesCircle

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {toastDelay} from "../../lib/constants";

export const ChangePwToast = (props) => {
    const {showMsgToast, toastObj} = props;
    const [show, setShow] = useState(false);

    const handleClose = () => {
        showMsgToast(false, null, null);
    };


    useEffect(()=> {
        setShow(toastObj.show)
    }, [toastObj.show]);


    return (
        <div className="notification-toast__wrapper">
            <Toast className={"notification-toast " + (toastObj.type)}
                   onClose={handleClose} show={show} delay={toastDelay} autohide  >
                <Toast.Body>
                    <span>
                        {toastObj.type === "success" ?
                            <FontAwesomeIcon icon={faCheckCircle} />:null}
                        {toastObj.type === "error" ?
                            <FontAwesomeIcon icon={faTimesCircle} />:null}
                    </span>
                    <span>{toastObj.msg}</span>
                </Toast.Body>
            </Toast>
        </div>
    );
};
