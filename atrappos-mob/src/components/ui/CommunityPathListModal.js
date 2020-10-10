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
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import {withRouter} from "react-router-dom";
import InfoTooltip from "./InfoTooltip";
import {PathInfoTooltip} from "./PathInfoTooltip";
import {useSelector} from "react-redux";
import {LoaderPin} from "./LoaderPin";
import {FilterPaths} from "./FilterPaths";
import {filterLbl} from "../../lib/constants";
import {sendGaEvent} from "../../lib/utils";

const CommunityPathListModalComponent = (props) => {
    const {location} = props;
    const [paths, setPaths] = useState([]);
    const [viewState, setViewState] = useState({});
    const [visibleCommunityPaths, setVisibleCommunityPaths] = useState([]);
    const [selectedForZoom, setSelectedForZoom] = useState(null);
    const [valuesDispatched, setValuesDispatched] = useState(false);
    const [showAllCommunityPaths, setShowAllCommunityPaths] = useState(false);
    const [filterPaths, setFilterPaths] = useState(false);
    const [filterObjective, setFilterObjective] = useState(null);
    const [filterSubjective, setFilterSubjective] = useState(null);
    const [filterResult, setFilterResult] = useState(null);

    const [ids, setIds] = useState(false);

    const {state, dispatch} = useContext(AppContext);

    const showAllPathsRef = useRef(null);

    const pathsReducer = useSelector(state => state.paths);


    const handleClose = () => {
        dispatch({...state, showCommunityPathListModal: false})
    }

    useEffect(() => {

        if (location && location.pathname !== '/community') {
            setViewState({});
            setSelectedForZoom(null);
            setVisibleCommunityPaths([]);
            setShowAllCommunityPaths(false);
            setFilterPaths(false);
            dispatch({
                ...state,
                reFetch: false,
                clearMap: true,
                valuesDispatched: false,
                visibleCommunityPaths: [],
                centerCoords: null,
                selectedPath: null,
                selectedPathOriginal: null
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location]);


    useEffect(() => {
        if (valuesDispatched) {
            handleClose();
            setValuesDispatched(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[valuesDispatched]);

    useEffect(() => {
        if (state.pathsRefetched) {
            localforage.getItem('communityPaths').then((val) => {
                setPaths(val);
                let ids = val.map((path) => path._id);
                setIds(ids);
            });
        }
    },[state.pathsRefetched]);


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
            sendGaEvent({category: "zoom-community-path", action: 'map-action'});
        }
    },[selectedForZoom]);


    const toggleVisibleCommunityPaths = (id) => {
        let idx = visibleCommunityPaths.indexOf(id);
        let visiblePathsCopy = JSON.parse(JSON.stringify(visibleCommunityPaths))
            if (idx > -1) {
                setShowAllCommunityPaths(false);
                visiblePathsCopy.splice(idx, 1);
                sendGaEvent({category: "hide-single-community-path", action: 'map-action'});
            } else {
                sendGaEvent({category: "show-single-community-path", action: 'map-action'});
                visiblePathsCopy.push(id);
            }
            if (filterPaths) {
                setFilterPaths(false);
            }
            if (visiblePathsCopy.length === paths.length) {
                setShowAllCommunityPaths(true);
            }
            if (id === selectedForZoom && viewState[id]) {
                setSelectedForZoom(null);
            }
            setViewState(prevState => ({...prevState, [id]: !prevState[id]}));
            setVisibleCommunityPaths(visiblePathsCopy);
    };



    const toggleShowAllCommunityPaths= (e) => {
        setShowAllCommunityPaths(e.target.checked);
        if (e.target.checked) {
            setVisibleCommunityPaths(ids);
            sendGaEvent({category: "show-all-community-paths", action: 'map-action'});
        } else {
            setVisibleCommunityPaths([]);
            sendGaEvent({category: "hide-all-community-paths", action: 'map-action'});
        }
        let checked = e.target.checked;
        ids.forEach((id)=> {
            setViewState(prevState => ({ ...prevState, [id]: checked}));
        });
    };

    const showFilteredPaths = (arr) => {
        setVisibleCommunityPaths(arr);
        ids.forEach((id)=> {
            setViewState(prevState => ({ ...prevState, [id]: arr.includes(id)}));
        });
        if (arr.length === paths.length) {
            setShowAllCommunityPaths(true);
        }
    }

    const toggleFilterPaths = (e) => {
        let checked = e.target.checked;
        setFilterPaths(checked);
        if (showAllCommunityPaths && checked) {
            showAllPathsRef.current.click();
        }
        if (!checked) {
            setVisibleCommunityPaths([]);
            ids.forEach((id)=> {
                setViewState(prevState => ({ ...prevState, [id]: false}));
            });
            sendGaEvent({category: "disable-filter-community-paths", action: 'map-action'});
        } else {
            sendGaEvent({category: "enable-filter-community-paths", action: 'map-action'});
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
            return visibleCommunityPaths.indexOf(path._id) !== -1
        });
        let centerCoords = null;
        if (selectedForZoom) {
            let filteredForZoom = paths.filter(function(path) {
                return path._id === selectedForZoom;
            });

            let zoomPath = filteredForZoom[0];
            if (zoomPath) {
                let coords= zoomPath.geometry.coordinates;
                let middleIdx= Math.round((coords.length - 1) / 2);
                centerCoords = coords[middleIdx];
            }
        }

       dispatch({
            ...state,
            visibleCommunityPaths: filteredForView,
            centerCoords: centerCoords
       });
        setValuesDispatched(true);
    }

    return (
        <Modal show={state.showCommunityPathListModal}
               onHide={handleClose}
               backdropClassName="community-path-list-backdrop"
               dialogClassName="community-path-list-dialog"
               backdrop="static">
            <Modal.Header>
                <Modal.Title as="h3">
                    Community paths
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {paths && paths.length > 0 && !pathsReducer.allPaths.fetching ?
                    <React.Fragment>
                        <label className={"cbox-container communitypaths" + (paths.length <= 0 || filterPaths ? " disable-list": "")}>
                                    <span className="cbox-lbl-txt">
                                        Show all
                                    </span>
                            <input type="checkbox"
                                   disabled={paths.length <= 0 || filterPaths }
                                   checked={showAllCommunityPaths}
                                   ref={showAllPathsRef}
                                   onChange={toggleShowAllCommunityPaths}
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
                                    </div>
                                    <div className="path-list__container">
                                        {
                                            paths.map((path)=> {
                                                return <div key={path._id} className="path-list__item">
                                                    <div className='path-list__info--wrapper'>
                                                        <InfoTooltip id={path._id + '-tltp'} placement="right"
                                                                     gaEvent="community-path-list-info"
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
                                                                     clsName='path-list-communitypaths--row' />
                                                        <span className="path-list__item_name">
                                                            {path.name}
                                                         </span>
                                                    </div>
                                                    <div className="path-list__btns">
                                                        <Button className={"path-list__item_show" + (viewState[path._id] ? " selected" : "") }
                                                                onClick={()=> {
                                                                    toggleVisibleCommunityPaths(path._id)
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

                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="path-list__scroll path-list__scroll--community">
                                    <FontAwesomeIcon icon={faArrowsAltV} />
                                </div>
                            </div>
                            <div className="filter-paths--container">
                                <div className="filter-paths--container__top">
                                    <label className={"cbox-container communitypaths" + (paths.length <= 0 ? " disable-list": "")}>
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
                        <span>There are no paths available from other users</span>
                    </div>:null}
                    {pathsReducer.allPaths.fetching ?
                        <LoaderPin msg="Loading paths..." />:null
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
                    className="path-list__btn community-path-list__btn--submit"
                    variant="primary"
                    onClick={dispatchModalActions}
                >
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

export const CommunityPathListModal = withRouter(CommunityPathListModalComponent);

