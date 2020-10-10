import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {AppContext} from "../../App";
import localforage from "localforage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowsAltV,
    faCheck,
    faExclamationTriangle,
    faEye,
    faEyeSlash, faSearchLocation,
    faTimes,
    faTools,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {
    defaultObjectiveValue,
    defaultSubjectiveValue, filterLbl
} from "../../lib/constants";
import InfoTooltip from "./InfoTooltip";
import {withRouter} from "react-router-dom";
import {PathInfoTooltip} from "./PathInfoTooltip";
import {useSelector} from "react-redux";
import {LoaderPin} from "./LoaderPin";
import {FilterPaths} from "./FilterPaths";
import {sendGaEvent} from "../../lib/utils";

const PathListModalComponent = (props) => {
    const {location, arrangePaths} = props;
    const [paths, setPaths] = useState([]);
    const [viewState, setViewState] = useState({});
    const [selectedForEdit, setSelectedForEdit] = useState(null);
    const [selectedForZoom, setSelectedForZoom] = useState(null);
    const [visibleUserPaths, setVisibleUserPaths] = useState([]);
    const [valuesDispatched, setValuesDispatched] = useState(false);
    const [showAllPaths, setShowAllPaths] = useState(false);
    const [filterPaths, setFilterPaths] = useState(false);
    const [filterObjective, setFilterObjective] = useState(null);
    const [filterSubjective, setFilterSubjective] = useState(null);
    const [filterResult, setFilterResult] = useState(null);

    const [ids, setIds] = useState([]);

    const {state, dispatch} = useContext(AppContext);

    const offlineReducer = useSelector(state => state.offline);

    const pathsReducer = useSelector(state => state.paths);

    const showAllPathsRef = useRef(null);


    const handleClose = () => {
        dispatch({...state, showPathListModal: false})
    }

    useEffect(() => {
        if (location && location.pathname !== '/pathlist') {
            setViewState({});
            setSelectedForEdit(null);
            setSelectedForZoom(null);
            setVisibleUserPaths([]);
            setShowAllPaths(false);
            setFilterPaths(false);
            dispatch({
                ...state,
                reFetch: false,
                clearMap: true,
                valuesDispatched: false,
                visibleUserPaths: [],
                centerCoords: null,
                selectedPath: null,
                selectedPathOriginal: null
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location]);


    useEffect(() => {
        if (valuesDispatched) {
            setValuesDispatched(false);
            setSelectedForEdit(null);
            handleClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[valuesDispatched]);

    useEffect(() => {
        if (state.pathsRefetched) {
            localforage.getItem('userPaths').then((val) => {
                setPaths(val);
                let ids = val.map((path) => path._id);
                setIds(ids);
            });
        }
    },[state.pathsRefetched]);

    useEffect(() => {
       if (offlineReducer.lastTransaction > 0 &&
        offlineReducer.outbox.length === 0 &&
        offlineReducer.online &&
        !offlineReducer.retryScheduled > 0) {
           arrangePaths(true);
       }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[offlineReducer]);


    useEffect(()=> {
        if (filterObjective && filterSubjective && paths) {
            let filterArr =  paths.filter((path, idx) => {
                return path.properties.objective === filterObjective &&
                    path.properties.subjective === filterSubjective;
            });
            let filterRes = filterArr.map((path)=> {
                return path._id;
            })
            setFilterResult(filterRes ? filterRes.length : 0);
            showFilteredPaths(filterRes);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterObjective, filterSubjective, paths]);

    useEffect(()=> {
        if (!filterPaths) {
            setFilterObjective(null);
            setFilterSubjective(null);
            setFilterResult(null);
        }
    }, [filterPaths]);

    useEffect(() => {
        if (selectedForZoom) {
            sendGaEvent({category: "zoom-user-path", action: 'map-action'});
        }
    },[selectedForZoom]);

    const toggleVisibleUserPaths = (id) => {
        let idx = visibleUserPaths.indexOf(id);
        let visiblePathsCopy = JSON.parse(JSON.stringify(visibleUserPaths));
        if (id !== selectedForEdit) {
            if (idx > -1) {
                setShowAllPaths(false);
                visiblePathsCopy.splice(idx, 1);
                sendGaEvent({category: "hide-single-user-path", action: 'map-action'});
            } else {
                visiblePathsCopy.push(id);
                sendGaEvent({category: "show-single-user-path", action: 'map-action'});
            }
            if (filterPaths) {
                setFilterPaths(false);
            }
            if (visiblePathsCopy.length === paths.length) {
                setShowAllPaths(true);
            }
            if (id === selectedForZoom && viewState[id]) {
                setSelectedForZoom(null);
            }
            setViewState(prevState => ({...prevState, [id]: !prevState[id]}));
            setVisibleUserPaths(visiblePathsCopy);
        }
    };

    const toggleSelectedForEdit = (id) => {
        let idx = visibleUserPaths.indexOf(id);
        if (idx > -1) {
            toggleVisibleUserPaths(id);
        }
        setSelectedForEdit(prevState => (prevState === id ? null : id));
    }

    const toggleShowAllPaths = (e) => {
        let checked = e.target.checked;
        setShowAllPaths(checked);
        if (checked) {
            setVisibleUserPaths(ids);
            sendGaEvent({category: "show-all-user-paths", action: 'map-action'});
        } else {
            setVisibleUserPaths([]);
            sendGaEvent({category: "hide-all-user-paths", action: 'map-action'});
        }
        ids.forEach((id)=> {
            setViewState(prevState => ({ ...prevState, [id]: id !== selectedForEdit ? checked : false}));
        });
    };

    const showFilteredPaths = (arr) => {
        setVisibleUserPaths(arr);
        ids.forEach((id)=> {
            setViewState(prevState => ({ ...prevState, [id]: arr.includes(id)}));
        });
        if (arr.length === paths.length) {
            setShowAllPaths(true);
        }
    }

    const toggleFilterPaths = (e) => {
        let checked = e.target.checked;
        setFilterPaths(checked);
        if (showAllPaths && checked) {
            showAllPathsRef.current.click();
        }
        if (!checked) {
            setVisibleUserPaths([]);
            ids.forEach((id)=> {
                setViewState(prevState => ({ ...prevState, [id]: false}));
            });
            sendGaEvent({category: "disable-filter-user-paths", action: 'map-action'});
        } else {
            sendGaEvent({category: "enable-filter-user-paths", action: 'map-action'});
        }
    }

    const applyFilters = (type, val) => {
        if (type === 'objective' ) {
            setFilterObjective(val);
        } else {
            setFilterSubjective(val);
        }
    }

    const toggleSelectedForZoom = (id) => {
        setSelectedForZoom(prevState => (prevState === id ? null : id));
    }

    const dispatchModalActions = () => {
        let filteredForView = paths.filter(function(path) {
            return visibleUserPaths.indexOf(path._id) !== -1 && path._id !== selectedForEdit;
        });
       let filteredForEdit  = paths.filter(path => {
            return path._id === selectedForEdit;
        });
       let centerCoords = null;
       let coordsCopy = null;
       let selectedPath = filteredForEdit[0] ? filteredForEdit[0] : null;
       let pathCopy = JSON.parse(JSON.stringify(selectedPath));
       let pathObj = pathCopy ? {
           _id: pathCopy._id,
           userId: pathCopy.userId,
           type: pathCopy.type,
           properties: {},
           geometry: pathCopy.geometry,
           device: pathCopy.device,
           created: pathCopy.created,
           modified: pathCopy.modified
       }:null;

       if (selectedForZoom) {
           let filteredForZoom = paths.filter(function(path) {
               return path._id === selectedForZoom && path._id !== selectedForEdit;
           });

           let zoomPath = filteredForZoom[0];
           if (zoomPath) {
               let coords= zoomPath.geometry.coordinates;
               let middleIdx= Math.round((coords.length - 1) / 2);
               centerCoords = coords[middleIdx];
           }
       }
        if (pathCopy) {
            coordsCopy = JSON.parse(JSON.stringify(pathCopy.geometry.coordinates));
        }

       dispatch({
            ...state,
            reFetch: false,
            clearMap: false,
            visibleUserPaths: filteredForView,
            centerCoords: centerCoords,
            area: pathCopy ? pathCopy.area : null,
            distance: pathCopy ? pathCopy.distance : null,
            coordsCopy: coordsCopy,
            selectedPath: pathObj,
            selectedPathOriginal:  pathCopy,
            objectiveSelection: pathCopy ? pathCopy.properties.objective : defaultObjectiveValue,
            subjectiveSelection: pathCopy ? pathCopy.properties.subjective : defaultSubjectiveValue,
            pathEvaluated: !!selectedPath,
            pathName: pathCopy ? pathCopy.name : null,
            pathDescr: pathCopy ? pathCopy.description : null,
            drawType: pathCopy ? pathCopy.drawType : null,
            drawn: pathCopy ? pathCopy.drawn : null,
            evaluations: pathCopy ? JSON.parse(JSON.stringify(pathCopy.evaluations)) : [],
            edited: pathCopy ? JSON.parse(JSON.stringify(pathCopy.edited)) : [],
            snapped: pathCopy ?  JSON.parse(JSON.stringify(pathCopy.snapped)) : false
       });
        setValuesDispatched(true);
    }

    return (
        <Modal show={state.showPathListModal}
               onHide={handleClose}
               backdropClassName="path-list-backdrop"
               dialogClassName="path-list-dialog"
               backdrop="static">
            <Modal.Header>
                <Modal.Title as="h3">
                    My paths
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {paths && paths.length > 0 && !pathsReducer.allPaths.fetching ?
                    <React.Fragment>
                        <label className={"cbox-container userpaths" + (paths.length <= 0  || filterPaths ? " disable-list": "")}>
                                    <span className="cbox-lbl-txt">
                                        Show all
                                    </span>
                            <input type="checkbox"
                                   disabled={paths.length <= 0  || filterPaths }
                                   checked={showAllPaths}
                                   ref={showAllPathsRef}
                                   onChange={toggleShowAllPaths}
                            />
                            <span className="cbox-checkmark"/>
                        </label>
                        <div className="path-list__outer--wrapper">
                            <div className="path-list__outer">
                                <div className="path-list__wrapper">
                                    <div className="path-list__titles">
                                        <div className="speech-bubble">
                                            Toggle on map
                                        </div>
                                        <div className="speech-bubble speech-bubble__zoom">
                                            Focus on map
                                        </div>
                                        <div className="speech-bubble speech-bubble__edit">
                                            Edit
                                        </div>
                                        <div className="speech-bubble speech-bubble__delete">
                                            Delete
                                        </div>
                                    </div>
                                    <div className="path-list__container">
                                        {
                                            paths.map((path)=> {
                                                return <div key={path._id} className={"path-list__item" +
                                                        (selectedForEdit === path._id ? " selected" : "")}>
                                                    <div className='path-list__info--wrapper'>
                                                        <InfoTooltip id={path._id + '-tltp'} placement="right"
                                                                     gaEvent="user-path-list-info"
                                                                     pathDetails={true}
                                                                     content={<PathInfoTooltip subj={path.properties.subjective}
                                                                                               obj={path.properties.objective}
                                                                                               distance={path.distance}
                                                                                               area={path.area}
                                                                                               name={path.name}
                                                                                               description={path.description}
                                                                                               drawType={path.drawType}
                                                                                               type='path-list'
                                                                     />}
                                                                                               clsName='path-list-userpaths--row' />
                                                          <span className="path-list__item_name">
                                                            {path.name}
                                                         </span>
                                                    </div>
                                                    <div className="path-list__btns">
                                                        <Button className={"path-list__item_show" + (viewState[path._id] ? " selected" : "") }
                                                                onClick={()=> {
                                                                    toggleVisibleUserPaths(path._id)
                                                                }}>
                                                            <i>
                                                                <FontAwesomeIcon icon={viewState[path._id] ? faEye : faEyeSlash}/>
                                                            </i>
                                                        </Button>
                                                        <Button className={"path-list__item_zoom" + (selectedForZoom === path._id ? " selected": "")}
                                                                disabled={!viewState[path._id]}
                                                                onClick={()=> {
                                                                    toggleSelectedForZoom(path._id)
                                                                }}>
                                                            <i>
                                                                <FontAwesomeIcon icon={faSearchLocation}/>
                                                            </i>
                                                        </Button>
                                                        <Button className={"path-list__item_edit" + (selectedForEdit === path._id ? " selected": "")}
                                                                variant="info"
                                                                onClick={()=> {
                                                                    toggleSelectedForEdit(path._id)
                                                                }}>
                                                            <i>
                                                                <FontAwesomeIcon icon={faTools}/>
                                                            </i>
                                                        </Button>
                                                        <Button className="path-list__item_delete"
                                                                variant="danger"
                                                                title={"Delete this path"}
                                                                onClick={()=> {dispatch({...state, showDeleteModal:
                                                                        {show: true, type: 'deleteSelectedPathModal', msg: 'deleteSelectedPathModal', id: path._id }})}}>
                                                            <i>
                                                                <FontAwesomeIcon icon={faTrash}/>
                                                            </i>
                                                        </Button>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                 </div>
                                <div className="path-list__scroll path-list__scroll--user">
                                    <FontAwesomeIcon icon={faArrowsAltV} />
                                </div>
                            </div>
                            <div className="filter-paths--container">
                                <div className="filter-paths--container__top">
                                    <label className={"cbox-container userpaths" + (paths.length <= 0 ? " disable-list": "")}>
                                            <span className="cbox-lbl-txt">
                                               {filterLbl}
                                            </span>
                                        <input type="checkbox"
                                               checked={filterPaths}
                                               onChange={toggleFilterPaths}
                                        />
                                        <span className="cbox-checkmark"/>
                                    </label>
                                    {filterResult !== null ?
                                        <div className="filter-result">
                                            {"Paths found: " + filterResult}
                                        </div>:null}
                                </div>
                                <FilterPaths
                                    active={filterPaths}
                                    applyFilters={applyFilters}
                                    filterObjective={filterObjective}
                                    filterSubjective={filterSubjective}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                    :null}
                    {paths && paths.length <= 0 && !pathsReducer.allPaths.fetching ?
                    <div className="path-list--empty">
                        <i>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </i>
                        <span>You don't have any paths yet!</span>
                    </div>:null}
                    {pathsReducer.allPaths.fetching ?
                        <LoaderPin msg="Loading paths..."/>:null
                    }
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="path-list__btn path-list__btn--cancel"
                    variant="secondary" onClick={handleClose}>
                    <i>
                        <FontAwesomeIcon icon={faTimes} />
                    </i>
                    <span>
                        Cancel
                    </span>
                </Button>
                <Button
                    className="path-list__btn path-list__btn--submit"
                    variant="primary"
                    onClick={dispatchModalActions}>
                    <i>
                        <FontAwesomeIcon icon={faCheck} />
                    </i>
                    <span>
                        Ok
                    </span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export const PathListModal = withRouter(PathListModalComponent);
