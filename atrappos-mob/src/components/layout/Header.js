import React, {useContext} from 'react';
import {Logo} from "./Logo";
import {withRouter} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMap, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";


const HeaderComponent = (props) => {
    const {location} = props;
    const {state, dispatch} = useContext(AppContext);

    if (
        location.pathname.match(/home/) ||
        location.pathname.match(/register/) ||
        location.pathname.match(/login/) ||
        location.pathname.match(/incompatible/) ||
        location.pathname.match(/change\/password/)
    ){
        return <header/>
    }

    return (
        <header>
            <div className="header">
                <Logo place="map" />
                <div className="header-modal__btns">
                    <button
                        onClick={()=> {
                            dispatch({...state, showMapSelectionModal: true})
                        }}>
                        <i>
                            <FontAwesomeIcon icon={faMap} />
                        </i>
                        <span>MAP</span>
                    </button>
                    <button
                        onClick={()=> {
                            dispatch({...state, showFaqModal: true})
                        }}>
                        <i>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </i>
                        <span>FAQ</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export const Header = withRouter(HeaderComponent);