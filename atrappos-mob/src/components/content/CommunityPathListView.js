import React, {useContext, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowsAltV,
    faExclamationTriangle,
    faEye,
    faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../App";
import InfoTooltip from "../ui/InfoTooltip";
import {PathInfoTooltip} from "../ui/PathInfoTooltip";
import {Button} from "react-bootstrap";
import {filterLbl} from "../../lib/constants";
import {FilterPaths} from "../ui/FilterPaths";
import {LoaderPin} from "../ui/LoaderPin";
import {useDispatch, useSelector} from "react-redux";
import localforage from "localforage";
import {sendGaEvent} from "../../lib/utils";
import {setIncludeUserPathsReducer} from "../../actions/pathsActions";
import {withRouter} from "react-router-dom";
import {CollapseNotification} from "../ui/CollapseNotification";


const CommunityPathListViewComponent = (props) => {
    const {location} = props;
    const [paths, setPaths] = useState([]);
    const [userPaths, setUserPaths] = useState([]);
    const [communityPaths, setCommunityPaths] = useState([]);
    const [includeUserPaths, setIncludeUserPaths] = useState(false);
    const [userPathsLength, setUserPathsLength] = useState(0);
    const [viewState, setViewState] = useState({});
    const [visibleCommunityPaths, setVisibleCommunityPaths] = useState([]);
    const [valuesDispatched, setValuesDispatched] = useState(false);
    const [showAllCommunityPaths, setShowAllCommunityPaths] = useState(false);
    const [filterPaths, setFilterPaths] = useState(false);
    const [filterObjective, setFilterObjective] = useState([]);
    const [filterSubjective, setFilterSubjective] = useState([]);
    const [filterResult, setFilterResult] = useState(null);
    const [usrPathsLengthNotZero, setUsrPathsLengthNotZero] = useState(false);
    const [commPathsLengthNotZero, setCommPathsLengthNotZero] = useState(false);
    const [pathsDefined, setPathsDefined] = useState(false);

    const [ids, setIds] = useState([]);

    const {state, dispatch} = useContext(AppContext);

    const showAllPathsRef = useRef(null);

    const filterPathsRef = useRef(null);

    const pathsReducer = useSelector(state => state.paths);

    const authReducer = useSelector(state => state.auth);

    const consentReducer = useSelector(state => state.consent);

    const reduxDispatch = useDispatch();


    useEffect(() => {

        if (location && location.pathname !== '/community') {
            setViewState({});
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
            setValuesDispatched(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[valuesDispatched]);

    useEffect(()=> {
        if (showAllCommunityPaths && includeUserPaths && ids && ids.length > 0) {
            setVisibleCommunityPaths(ids);
            ids.forEach((id)=> {
                setViewState(prevState => ({ ...prevState, [id]: true}));
            });
        }

    }, [ids, showAllCommunityPaths, includeUserPaths]);


    useEffect(() => {
        if (state.pathsRefetched) {
            localforage.getItem('communityPaths').then((val) => {
                setPaths(val);
                setCommunityPaths(val);
                let ids = val.map((path) => path._id);
                setIds(ids);
                setPathsDefined(true);
            });
            localforage.getItem('userPaths').then((val) => {
                setUserPaths(val);
                setUserPathsLength(val ? val.length : 0)
            });
        }
    },[state.pathsRefetched]);

    useEffect(()=> {
        setUsrPathsLengthNotZero(userPaths.length > 0)
    }, [userPaths]);

    useEffect(()=> {
        setCommPathsLengthNotZero(communityPaths.length > 0);
    }, [communityPaths]);


    useEffect(()=> {
        let checked = consentReducer.includeUserPaths;
        setIncludeUserPaths(checked && userPathsLength > 0);
    }, [consentReducer.includeUserPaths, userPathsLength]);

    useEffect(()=> {
        if (includeUserPaths && usrPathsLengthNotZero && commPathsLengthNotZero) {
            let newList = userPaths.concat(communityPaths);
            setPaths(newList);
            let ids = newList.map((path) => path._id);
            setIds(ids);
        } else {
            setPaths(communityPaths);
            let ids = communityPaths.map((path) => path._id);
            setIds(ids);
            userPaths.forEach((path) => {
                if (viewState[path._id]) {
                    setViewState(prevState => ({ ...prevState, [path._id]: false}));
                    setVisibleCommunityPaths(prevState => (prevState.filter(e => e !== path._id)));
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [includeUserPaths, usrPathsLengthNotZero, commPathsLengthNotZero]);


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
        if (!state.bottomExpanded) {
            dispatchModalActions();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.bottomExpanded]);

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
        if (visiblePathsCopy.length === paths.length && visiblePathsCopy.length > 0) {
            setShowAllCommunityPaths(true);
        }

        setViewState(prevState => ({...prevState, [id]: !prevState[id]}));
        setVisibleCommunityPaths(visiblePathsCopy);
    };



    const toggleIncludeUserPaths= (e) => {
        const checked = e.target.checked;
        reduxDispatch(setIncludeUserPathsReducer(checked));
    };


    const toggleShowAllCommunityPaths= (e) => {
        let checked = e.target.checked;
        if (checked && filterPaths) {
            filterPathsRef.current.click();
        }
        setShowAllCommunityPaths(checked);
        if (checked) {
            setVisibleCommunityPaths(ids);
            sendGaEvent({category: "show-all-community-paths", action: 'map-action'});
        } else {
            setVisibleCommunityPaths([]);
            sendGaEvent({category: "hide-all-community-paths", action: 'map-action'});
        }
        ids.forEach((id)=> {
            setViewState(prevState => ({ ...prevState, [id]: checked}));
        });
    };

    const showFilteredPaths = (arr) => {
        setVisibleCommunityPaths(arr);
        ids.forEach((id) => {
            setViewState(prevState => ({...prevState, [id]: arr.includes(id)}));
        });
    }

    const toggleFilterPaths = (e) => {
        let checked = e.target.checked;
        if (showAllCommunityPaths && checked) {
            showAllPathsRef.current.click();
        }
        setFilterPaths(checked);
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
            return visibleCommunityPaths.indexOf(path._id) !== -1
        });
        let centerCoords = null;

        dispatch({
            ...state,
            visibleCommunityPaths: filteredForView,
            centerCoords: centerCoords
        });
        setValuesDispatched(true);
    }


    return (
       <React.Fragment>
           {paths && paths.length > 0 && !pathsReducer.allPaths.fetching && pathsDefined ?
               <React.Fragment>
                   <div className="community__checkboxes">
                       <label className={"cbox-container communitypaths cbox--include-user" + (userPathsLength <= 0 ? " disable-list": "")}>
                                        <span className="cbox-lbl-txt">
                                            Include my paths
                                        </span>
                           <input type="checkbox"
                                  disabled={userPathsLength <= 0 }
                                  checked={includeUserPaths}
                                  onChange={toggleIncludeUserPaths}
                           />
                           <span className="cbox-checkmark"/>
                       </label><br/>
                       <label className={"cbox-container communitypaths cbox--show-all" + (paths.length <= 0 ? " disable-list": "")}>
                                        <span className="cbox-lbl-txt">
                                            Show all in the map
                                        </span>
                           <input type="checkbox"
                                  disabled={paths.length <= 0 }
                                  checked={showAllCommunityPaths}
                                  ref={showAllPathsRef}
                                  onChange={toggleShowAllCommunityPaths}
                           />
                           <span className="cbox-checkmark"/>
                       </label>
                   </div>
                   {!filterPaths && visibleCommunityPaths !== null ?
                       <div className="select-result__wrapper">
                           <div className="select-result">
                               {"Selected paths: " + visibleCommunityPaths.length}
                           </div>
                       </div> :null}
                   <div className="path-list__outer--wrapper">
                       <div className="path-list__outer">
                           <div className="path-list__wrapper">
                               <div className="path-list__titles">
                                   <div className="speech-bubble">
                                       Toggle on map
                                   </div>
                               </div>
                               <div className={"path-list__container"}>
                                   {
                                       paths.map((path)=> {
                                           return <div key={path._id}
                                                       className={"path-list__item" + (authReducer.user.id === path.userId ?
                                                               " path-list__item--user" : ""
                                                       )}>
                                               <div className='path-list__info--wrapper'>
                                                   <InfoTooltip id={path._id + '-community-tltp'}
                                                                placement="auto-start"
                                                                gaEvent="community-path-list-info"
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
                                                                clsName='path-list-communitypaths--row' />
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
                               <label className={"cbox-container communitypaths cbox--filter-paths" + (paths.length <= 0 ? " disable-list": "")}>
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
                       <CollapseNotification hasPaths={true} />
                   </div>
               </React.Fragment>
               :null}
               {paths && paths.length <= 0 && !pathsReducer.allPaths.fetching && pathsDefined ?
                   <React.Fragment>
                   <div className="path-list--empty">
                       <i>
                           <FontAwesomeIcon icon={faExclamationTriangle}/>
                       </i>
                       <span>There are no paths available from other users</span>
                   </div>
                   <CollapseNotification />
                   </React.Fragment>:null}
                   {pathsReducer.allPaths.fetching || !pathsDefined ?
                       <LoaderPin msg="Loading paths..." />:null}
       </React.Fragment>
    );
};

export const CommunityPathListView = withRouter(CommunityPathListViewComponent);

