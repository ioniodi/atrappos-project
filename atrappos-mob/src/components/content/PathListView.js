import React, {useContext, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowsAltV,
    faExclamationTriangle,
    faEye,
    faEyeSlash,
    faTools,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";
import {KPIs} from "../ui/KPIs";
import InfoTooltip from "../ui/InfoTooltip";
import {PathInfoTooltip} from "../ui/PathInfoTooltip";
import {Button} from "react-bootstrap";
import {defaultObjectiveValue, defaultSubjectiveValue, filterLbl} from "../../lib/constants";
import {FilterPaths} from "../ui/FilterPaths";
import {LoaderPin} from "../ui/LoaderPin";
import {useSelector} from "react-redux";
import localforage from "localforage";
import {sendGaEvent} from "../../lib/utils";
import {withRouter} from "react-router-dom";
import {CollapseNotification} from "../ui/CollapseNotification";

const PathListViewComponent = (props) => {
    const {state, dispatch} = useContext(AppContext);
    const {location} = props;
    const [paths, setPaths] = useState([]);
    const [viewState, setViewState] = useState({});
    const [selectedForEdit, setSelectedForEdit] = useState(null);
    const [visibleUserPaths, setVisibleUserPaths] = useState([]);
    const [valuesDispatched, setValuesDispatched] = useState(false);
    const [showAllPaths, setShowAllPaths] = useState(false);
    const [filterPaths, setFilterPaths] = useState(false);
    const [filterObjective, setFilterObjective] = useState([]);
    const [filterSubjective, setFilterSubjective] = useState([]);
    const [filterResult, setFilterResult] = useState(null);
    const [pathsDefined, setPathsDefined] = useState(false);

    const [ids, setIds] = useState([]);

    const pathsReducer = useSelector(state => state.paths);

    const showAllPathsRef = useRef(null);

    const filterPathsRef = useRef(null);

    useEffect(() => {
        if (location && location.pathname !== '/pathlist') {
            setViewState({});
            setSelectedForEdit(null);
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[valuesDispatched]);

    useEffect(() => {
        if (state.pathsRefetched) {
            localforage.getItem('userPaths').then((val) => {
                setPaths(val);
                setPathsDefined(true);
                let ids = val.map((path) => path._id);
                setIds(ids);
            });
        }
    },[state.pathsRefetched]);

    useEffect(()=> {
        if ((filterObjective || filterSubjective) && paths) {
            let filterArr =  paths.filter((path, idx) => {
                return  filterObjective.includes(path.properties.objective) ||
                    filterSubjective.includes(path.properties.subjective);
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
            setFilterObjective([]);
            setFilterSubjective([]);
            setFilterResult(null);
        }
    }, [filterPaths]);

    useEffect(()=> {
        if (selectedForEdit) {
            dispatchModalActions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedForEdit]);

    useEffect(()=> {
        if (!state.bottomExpanded) {
            dispatchModalActions();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.bottomExpanded]);

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
            if (visiblePathsCopy.length === paths.length && visiblePathsCopy.length > 0) {
                setShowAllPaths(true);
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
        if (checked && filterPaths) {
            filterPathsRef.current.click();
        }
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
        ids.forEach((id) => {
            setViewState(prevState => ({...prevState, [id]: arr.includes(id)}));
        });
    }

    const toggleFilterPaths = (e) => {
        let checked = e.target.checked;
        if (showAllPaths && checked) {
            showAllPathsRef.current.click();
        }
        setFilterPaths(checked);
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

    const applyFilters = (type, target) => {
        const checked = target.checked;
        const val = target.value;
        if (type === 'objective' ) {
            if (checked) {
                setFilterObjective([ ...filterObjective, val]);
            } else {
                setFilterObjective(filterObjective.filter((e)=>(e !== val)))
            }
        } else {
            if (checked) {
                setFilterSubjective([ ...filterSubjective, val]);
            } else {
                setFilterSubjective(filterSubjective.filter((e)=>(e !== val)))
            }
        }
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
            snapped: pathCopy ?  (pathCopy.snapped ? JSON.parse(JSON.stringify(pathCopy.snapped)) : false) : false
        });
        setValuesDispatched(true);
    }
    return (
        <React.Fragment>
            {paths && paths.length > 0 && !pathsReducer.allPaths.fetching && pathsDefined  ?
                <React.Fragment>
                    <h4 className="path-list__ribbon">
                            <span>
                                Dashboard
                            </span>
                    </h4>
                    <KPIs userPaths={paths} />
                    <h4 className="path-list__ribbon">
                            <span>
                                List
                            </span>
                    </h4>
                    <label className={"cbox-container userpaths cbox--show-all" + (paths.length <= 0 ? " disable-list": "")}>
                                    <span className="cbox-lbl-txt">
                                        Show all in the map
                                    </span>
                        <input type="checkbox"
                               disabled={paths.length <= 0 }
                               checked={showAllPaths}
                               ref={showAllPathsRef}
                               onChange={toggleShowAllPaths}
                        />
                        <span className="cbox-checkmark"/>
                    </label>
                    {!filterPaths && visibleUserPaths !== null ?
                        <div className="select-result__wrapper">
                            <div className="select-result">
                                {"Selected paths: " + visibleUserPaths.length}
                            </div>
                        </div>:null}
                    <div className="path-list__outer--wrapper">
                        <div className="path-list__outer">
                            <div className="path-list__wrapper">
                                <div className="path-list__titles">
                                    <div className="speech-bubble">
                                        Toggle on map
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
                                                    <InfoTooltip id={path._id + '-user-tltp'}
                                                                 placement="auto-start"
                                                                 gaEvent="user-path-list-info"
                                                                 pathDetails={true}
                                                                 pathName={path.name}
                                                                 content={<PathInfoTooltip
                                                                           subj={path.properties.subjective}
                                                                           obj={path.properties.objective}
                                                                           distance={path.distance}
                                                                           area={path.area}
                                                                           name={path.name}
                                                                           description={path.description}
                                                                           drawType={path.drawType}
                                                                           type='path-list'
                                                                           id={path._id}
                                                                 />}
                                                                 clsName='path-list-userpaths--row' />
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
                                <label className={"cbox-container userpaths cbox--filter-paths" + (paths.length <= 0 ? " disable-list": "")}>
                                            <span className="cbox-lbl-txt">
                                               {filterLbl}
                                            </span>
                                    <input type="checkbox"
                                           checked={filterPaths}
                                           ref={filterPathsRef}
                                           onChange={toggleFilterPaths}
                                    />
                                    <span className="cbox-checkmark"/>
                                </label>
                                {filterPaths && filterResult !== null ?
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
                        <CollapseNotification hasPaths={true}/>
                    </div>
                </React.Fragment>
                :null}
                {paths && paths.length <= 0 && !pathsReducer.allPaths.fetching && pathsDefined ?
                    <React.Fragment>
                    <div className="path-list--empty">
                        <i>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </i>
                        <span>You don't have any paths yet!</span>
                    </div>
                    <CollapseNotification />
                    </React.Fragment>:null}
                    {pathsReducer.allPaths.fetching || !pathsDefined ?
                        <LoaderPin msg="Loading paths..."/>:null
                    }

        </React.Fragment>
    );
};

export const PathListView = withRouter(PathListViewComponent);

