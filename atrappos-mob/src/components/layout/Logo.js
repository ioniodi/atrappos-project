import React, {useContext} from "react";
import {Link} from "react-router-dom";
import logo from "../../assets/img/logo.png";
import logoSmall from "../../assets/img/logo-s.png";
import {AppContext} from "../../App";
import {handleNavClick} from "../../lib/utils";

export const Logo = (props) => {
    const {place} = props;
    const {state} = useContext(AppContext);

    return (
        <Link to={"/"} className={"logo logo--" + (place)}
              title="Back to home"
              onClick={(e)=> {handleNavClick(e, (state.recording || state.recordedPath ||
                  state.drawing || state.drawnPath || state.selectedPath))}}>
            <img src={place === "landing" ? logo : logoSmall} alt="atrappos logo"/>
        </Link>
    )
};