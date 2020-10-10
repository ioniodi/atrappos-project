import React, {useEffect} from 'react';
import {withRouter} from "react-router-dom";
import {isMobile} from 'react-device-detect';
import logo from "../../assets/img/logo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDesktop, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

const DeviceMessageComponent = (props) => {
    const {history} = props;

    useEffect(()=> {
        if (isMobile) {
            history.push('/home');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    return (
        <div className="device-message">
            <img src={logo} alt="atrappos logo"/>
            <p className='device-message--icons'>
                <i>
                    <FontAwesomeIcon icon={faDesktop} />
                </i>
                <i>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </i>
            </p>
            <article className='device-message--text'>
                The bad news is that you have reached Atr<b>app</b>os Mobile using a pc. <br/>
                The good news is that there exists a desktop app for your current device!  <br/>
                You can use it with the same credentials.
                <a href={process.env.DESKTOP_APP_URL} target='_self'>
                    Atr<b>app</b>os Web
                </a>
            </article>
        </div>
    );
};

export const  DeviceMessage =  withRouter(DeviceMessageComponent);