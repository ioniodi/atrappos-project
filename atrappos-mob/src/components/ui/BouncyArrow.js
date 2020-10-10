import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {withRouter} from "react-router-dom";

const BouncyArrowComponent = (props) => {
    const {location} = props;
    const [show, setShow] = useState(false);

    useEffect(()=> {
        if (location.pathname.match(/location/)) {
            setInterval(function() {
                let gpsIsOn = document.getElementsByClassName("leaflet-control-locate leaflet-bar leaflet-control active");
                setShow(!(gpsIsOn && gpsIsOn.length > 0));
            }, 1500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    if (
        !(location.pathname.match(/location/) && show)
    ){
        return null;
    }
    return (
       <div className="arrow-gps bouncy-arrow">
           <FontAwesomeIcon icon={faArrowUp} />
       </div>
    );
};

export const BouncyArrow = withRouter(BouncyArrowComponent);

