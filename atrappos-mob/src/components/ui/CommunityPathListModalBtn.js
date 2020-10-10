import React, {useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThList} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";


export const CommunityPathListModalBtn = (props) => {
    const {state, dispatch} = useContext(AppContext);

    return (
        <button className={"show-community-path-list-modal__btn bottom-action__btn"}
                disabled={false}
                onClick={()=> dispatch({...state, showCommunityPathListModal: true})}>
          <i>
              <FontAwesomeIcon icon={faThList} />
          </i>
          <span>View</span>
        </button>
    );
};

