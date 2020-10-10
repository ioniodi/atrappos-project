import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faListAlt} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";


export const PathListModalBtn = () => {
    const {state, dispatch} = useContext(AppContext);
    return (
        <button className={"show-path-list-modal__btn bottom-action__btn"}
                disabled={false}
                onClick={()=> dispatch({...state, showPathListModal: true})}>
          <i>
              <FontAwesomeIcon icon={faListAlt} />
          </i>
          <span>View</span>
        </button>
    );
};

