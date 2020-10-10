import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../App";
import {Modal, Button} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import { mapLayersTitles, mapLayers } from "../../../lib/constants";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {setMapLayer} from "../../../actions/pathsActions";
import {sendGaEvent} from "../../../lib/utils";


export const MapSelectionModal = () => {

    const mapLayersReducer = useSelector(state => state.mapLayers);
    const {state, dispatch} = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [selectedMap, setSelectedMap] = useState(mapLayersReducer.mapLayer);

    const reduxDispatch = useDispatch();


    const handleClose = () => {
        dispatch({...state, showMapSelectionModal: false})
    };

    useEffect(()=> {
        setShow(state.showMapSelectionModal)
    }, [state.showMapSelectionModal]);

    useEffect(()=> {
        if (mapLayersReducer.mapLayer) {
            setSelectedMap(mapLayersReducer.mapLayer);
        }
    }, [mapLayersReducer.mapLayer]);


    const toggleSelectedMap = (id) => {
        setSelectedMap(id);
    };

    const changeMap = () => {
        reduxDispatch(setMapLayer(selectedMap));
        sendGaEvent({category: "map-layer-selected-" + selectedMap, action: 'map-action'});
        handleClose();
    };


    return (
        <Modal show={show}
               onHide={handleClose}
               backdrop="static"
               backdropClassName="map-selection-backdrop"
               dialogClassName="map-selection-dialog">
            <Modal.Header closeButton>
                <Modal.Title as="h3">Select Map Style</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="map-selection__container">
                    {mapLayersTitles.map((id)=> {
                        return <div id={id} key={id}
                                    className="map-preview"
                                    onClick={()=> {toggleSelectedMap(id)}}>
                            <div  className={'bg-map-preview bg-' + id}>
                                <h6>{mapLayers[id].title}</h6>
                            </div>
                            <div className={"map-layer" + (selectedMap === id ?
                                " map-layer--selected": "")}>
                            </div>
                        </div>
                    })
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light"
                        className="map-selection__btn map-selection__btn--cancel"
                        onClick={handleClose}>
                    <i><FontAwesomeIcon icon={faTimes} /></i>
                    <span>Cancel</span>
                </Button>
                <Button className="map-selection__btn map-selection__btn--change"
                        onClick={()=>  {changeMap()}}
                >
                    <i><FontAwesomeIcon icon={faCheck} /></i>
                    <span>Change</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
