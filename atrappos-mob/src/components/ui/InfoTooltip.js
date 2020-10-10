import React, {useState, useRef, useEffect} from 'react';
import{Overlay, Popover} from 'react-bootstrap';
import {faComment, faInfo, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {sendGaEvent} from "../../lib/utils";

function InfoTooltip(props) {
    const {id, clsName, content, placement, gaEvent, pathDetails, pathName} = props;
    const [show, setShow] = useState(false);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);

    const handleClick = () => {
        setShow(!show);
    };

    useEffect(()=> {
        if (show) {
            sendGaEvent({category: gaEvent, action: 'show-tooltip'});
        }
    }, [show, gaEvent]);


    return (
        <div className='tltp--wrapper' ref={containerRef}
             key={'tltp-' + id + '--wrapper'}>
            <i className={clsName + '__btn--tltp'}
               ref={triggerRef}
               onClick={handleClick}>
                {pathDetails ?
                    <React.Fragment>
                        <span className={"path-details__icons" + (show ? ' visible-tltp': '')}>
                            <b className="bubble__icon">
                                <FontAwesomeIcon icon={faComment} />
                            </b>
                            <b className="info__icon">
                                <FontAwesomeIcon icon={faInfo} />
                            </b>
                        </span>
                        {pathName ?
                            <span className="path-list__item_name">
                            {pathName}
                        </span>
                            :null}
                    </React.Fragment>
                :
                    <FontAwesomeIcon icon={faInfoCircle} />
                }
            </i>
            <Overlay
                show={show}
                onHide={()=> {setShow(!show)}}
                placement={placement}
                containerPadding={20}
                container={containerRef}
                target={triggerRef}
                rootClose
            >
                <Popover id={id}>
                    <Popover.Content>
                        <i className='close-pop-overlay' onClick={()=>{setShow(!show)}}>
                            <FontAwesomeIcon icon={faTimes} />
                        </i>
                        {content}
                    </Popover.Content>
                </Popover>
            </Overlay>
        </div>
    );
}

export default InfoTooltip;

