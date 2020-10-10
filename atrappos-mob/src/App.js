import React, {useEffect, useReducer, useState} from 'react';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import update from 'immutability-helper';
import CustomMap from "./components/map/CustomMap";
import localforage from "localforage";
import jwt_decode from "jwt-decode";
import setAuthToken from "./auth/setAuthToken";
import { setCurrentUser, logoutUser } from "./services/authService";
import store from "./store";
import ReactGA from 'react-ga';
import {Header} from "./components/layout/Header";
import {LocateAndRecord} from "./components/navigation/LocateAndRecord";
import {BottomBar} from "./components/layout/BottomBar";
import {DrawPath} from "./components/navigation/DrawPath";
import {defaultObjectiveValue, defaultSubjectiveValue, minPathMetersLimit, toastDelay} from "./lib/constants";
import PrivateRoute from "./auth/PrivateRoute";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ChangePassword from "./components/auth/ChangePassword";
import Landing from "./components/layout/Landing";
import {useSelector} from "react-redux";
import {EvaluationModal} from "./components/ui/Modals/EvaluationModal";
import pathService from "./services/pathService";
import moment from "moment";
import {ConfirmDeletionModal} from "./components/ui/Modals/ConfirmDeletionModal";
import {NotificationToast} from "./components/ui/NotificationToast";
import {geoToPoly, sendGaEvent} from "./lib/utils";
import {PathList} from "./components/navigation/PathList";
import {CommunityPathList} from "./components/navigation/CommunityPathList";
import {MapSelectionModal} from "./components/ui/Modals/MapSelectionModal";
import {FaqModal} from "./components/ui/Modals/FaqModal";
import {isMobile} from "react-device-detect";
import {DeviceMessage} from "./components/layout/DeviceMessage";
import {SnapOverlay} from "./components/ui/SnapOverlay";
import {SaveLocationConsentModal} from "./components/ui/Modals/SaveLocationConsentModal";
import {DrawPathTutorialModal} from "./components/ui/Modals/DrawPathTutorialModal";
import {BouncyArrow} from "./components/ui/BouncyArrow";

export const AppContext = React.createContext();

const trackingId = process.env.GA_ID;
ReactGA.initialize(trackingId);


function reducer(state, action) {
  return update(state, {
    clearMap: {$set: action.clearMap},
    pathsRefetched: {$set: action.pathsRefetched},
    recording: {$set: action.recording},
    drawing: {$set: action.drawing},
    eraseProcedure: {$set: action.eraseProcedure},
    drawStart: {$set: action.drawStart},
    disableDraw: {$set: action.disableDraw},
    bottomExpanded: {$set: action.bottomExpanded},
    showEvaluationModal: {$set: action.showEvaluationModal},
    showMapSelectionModal: {$set: action.showMapSelectionModal},
    showFaqModal: {$set: action.showFaqModal},
    showSaveLocationConsentModal: {$set: action.showSaveLocationConsentModal},
    showDrawPathTutorialModal:  {$set: action.showDrawPathTutorialModal},
    showDeleteModal: {$set: action.showDeleteModal},
    notificationToast: {$set: action.notificationToast},
    visibleUserPaths: {$set: action.visibleUserPaths},
    visibleCommunityPaths: {$set: action.visibleCommunityPaths},
    editProcedure: {$set: action.editProcedure},
    objectiveSelection: {$set: action.objectiveSelection},
    subjectiveSelection: {$set: action.subjectiveSelection},
    pathEvaluated: {$set: action.pathEvaluated},
    recordedPath: {$set: action.recordedPath},
    area: {$set: action.area},
    distance: {$set: action.distance},
    coordsCopy: {$set: action.coordsCopy},
    centerCoords: {$set: action.centerCoords},
    recordedPathOriginal: {$set: action.recordedPathOriginal},
    drawnPath: {$set: action.drawnPath},
    selectedPath: {$set: action.selectedPath},
    selectedPathOriginal: {$set: action.selectedPathOriginal},
    pathName: {$set: action.pathName},
    pathDescr: {$set: action.pathDescr},
    drawType: {$set: action.drawType},
    drawn: {$set: action.drawn},
    evaluations: {$set: action.evaluations},
    edited: {$set: action.edited},
    snapped: {$set: action.snapped}
  });
}

const initialState = {
  clearMap: false,
  pathsRefetched: false,
  recording: false,
  drawing: false,
  eraseProcedure: false,
  disableDraw: false,
  bottomExpanded: true,
  showEvaluationModal: false,
  showMapSelectionModal: false,
  showFaqModal: false,
  showSaveLocationConsentModal: false,
  showDrawPathTutorialModal: false,
  showDeleteModal: {show: false, type: null,  msg: null, id: null},
  notificationToast: {show: false, type: null, msg: null},
  visibleUserPaths: [],
  visibleCommunityPaths: [],
  editProcedure: false,
  objectiveSelection: defaultObjectiveValue,
  subjectiveSelection: defaultSubjectiveValue,
  pathEvaluated: false,
  recordedPath: null,
  area: null,
  distance: null,
  coordsCopy: null,
  centerCoords: null,
  recordedPathOriginal: null,
  drawnPath: null,
  pathName: null,
  pathDescr: null,
  drawType: null,
  drawn: null,
  evaluations: [],
  edited: [],
  snapped: false
};

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

const AppComponent = (props) =>  {
  const {location, history} = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newPolyCoords, setNewPolyCoords] = useState([])

  const authReducer = useSelector(state => state.auth);

  const offlineReducer = useSelector(state => state.offline);

  useEffect(() => {
    localforage.config({
      name: 'atrapposIndexedDB',
      storeName: 'keyvaluepairs',
      driver: localforage.INDEXEDDB
    });
    localforage.removeItem('snapped-path');
  }, []);

  useEffect(()=> {
    if (!isMobile) {
      history.push('/incompatible');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (authReducer.isAuthenticated) {
      arrangePaths();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReducer.isAuthenticated]);

  useEffect(() => {
    if (state.selectedPath) {
      let copy = JSON.parse(JSON.stringify(state.selectedPath));
      setNewPolyCoords(geoToPoly(copy.geometry.coordinates));
    }
  }, [state.selectedPath]);

  useEffect(() => {
      if (state.snapped) {
        localforage.getItem('snapped-path').then((val) => {
          if (val) {
            alterExistingPath(definePath(), val, true);
          }
        })
      } else {
        if (state.coordsCopy) {
          alterExistingPath(definePath(), state.coordsCopy, false);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.snapped]);

  useEffect(() => {
    if (offlineReducer.lastTransaction > 0 &&
        offlineReducer.outbox.length === 0 &&
        offlineReducer.online &&
        !offlineReducer.retryScheduled > 0) {
      arrangePaths(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[offlineReducer]);


  const arrangePaths = (sync) => {
    let userId = authReducer.user.id;
    dispatch({...state, pathsRefetched: false})
    pathService.getAll().then((res) => {
      if (res) {
        let userPaths = res.filter(path => {
          return path.userId===userId;
        });
        let communityPaths = res.filter(path => {
          return path.userId!==userId;
        });
        localforage.setItem('userPaths', userPaths).then(() => {
          if (sync) {
            setTimeout(() => {
              dispatch({...state,
                pathsRefetched: true,
                notificationToast: {show: true, type: 'info', msg: 'pathsSyncedSuccessToast'}
              })
            }, toastDelay);
          } else {
            dispatch({...state,
              pathsRefetched: true});
          }
        });
        localforage.setItem('userPathsLength', userPaths.length);
        localforage.setItem('communityPaths', communityPaths);
      } else {
        // offline...
        dispatch({...state, pathsRefetched: true});
      }
    }, (err)=> {
        dispatch({...state, pathsRefetched: true});
    });
  }

  const defineEditState = () => {
    switch (true) {
      case !!state.recordedPath:
        return 'beforeSave';
      case !!state.drawnPath:
        return 'beforeSave';
      case !!state.selectedPath:
        return 'afterSave';
      default:
        return null
    }
  }

  const definePath= () => {
    switch (true) {
      case !!state.recordedPath:
        return 'recordedPath';
      case !!state.drawnPath:
        return 'drawnpath';
      case !!state.selectedPath:
        return 'selectedPath';
      default:
        return null;
    }
  }

  const setEditEndAndDuration = (start, end) => {
    let duration = moment.duration(end.diff(start));
    let minutes = duration.asSeconds();
    end = moment(end).format('YYYY-MM-DD HH:mm:ss');
    let editObj = {date: end, state: defineEditState(), duration: minutes, device: 'mobile'};
    dispatch({...state, edited: [...state.edited, editObj], editProcedure: false})
  }

  const generateRecordedPath = (geoJSON, distance) => {
    if (distance < minPathMetersLimit) {
      dispatch({
        ...state,
        clearMap: true,
        objectiveSelection: defaultObjectiveValue,
        subjectiveSelection: defaultSubjectiveValue,
        pathEvaluated: false,
        recordedPath: null,
        area: null,
        distance: null,
        pathName: null,
        pathDescr: null,
        drawType: null,
        drawn: null,
        evaluations: [],
        edited: [],
        snapped: false,
        notificationToast: {show: true, type: 'point-out-fail', msg: 'notEnoughMetersPointOutFailToast'}
      });
    } else {
      let end = moment(new Date());
      let duration = moment.duration(end.diff(state.drawStart));
      let seconds = duration.asSeconds();
      let drawEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');
      dispatch({...state,
        reFetch: false,
        clearMap: false,
        recordedPath: geoJSON,
        drawn: {date: drawEnd, duration: seconds},
        coordsCopy: geoJSON.geometry.coordinates,
        recordedPathOriginal: geoJSON
      });
    }
  }

  const setEditStartProcedure = (editing) => {
    dispatch({...state, editProcedure: editing})
  }

  const drawnPathActions = (geoJSON) => {
    let end = moment(new Date());
    let duration = moment.duration(end.diff(state.drawStart));
    let seconds = duration.asSeconds();
    let drawEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');
    dispatch({...state,
      drawing: false,
      reFetch: false,
      clearMap: false,
      drawnPath: geoJSON,
      drawn: {date: drawEnd, duration: seconds},
      drawType: 'phone'
    })
  }

  const cancelDraw = () => {
    if (state.drawing) {
      dispatch({...state,
        drawing: false});
    }
  }

  const stoppedErasing = (erasing) => {
    dispatch({...state, eraseProcedure: !erasing})
  }

  const resetDrawnPath = () => {
    dispatch({...state,
      objectiveSelection: defaultObjectiveValue,
      subjectiveSelection: defaultSubjectiveValue,
      drawnPath: null,
      pathEvaluated: false,
      area: null,
      pathName: null,
      pathDescr: null,
      drawType: null,
      drawn: null,
      evaluations: [],
      edited: []
    });
    sendGaEvent({category: 'erase-path', action: 'map-action'});
  }

  const alterExistingPath = (type, coords, snap) => {
    let currPath;
    let coordsCopy;
    switch (type) {
      case 'recordedPath':
        currPath = state.recordedPath;
        currPath.geometry.coordinates = coords;
        if (snap) {
          dispatch({...state, recordedPath: currPath});
        } else {
          let copy = JSON.parse(JSON.stringify(state.recordedPath));
          dispatch({...state, recordedPath: currPath, coordsCopy: copy.geometry.coordinates});
        }
        coordsCopy = JSON.parse(JSON.stringify(coords));
        setNewPolyCoords(geoToPoly(coordsCopy));
        break;
      case 'drawnPath':
        currPath = state.drawnPath;
        currPath.geometry.coordinates = coords;
        dispatch({...state, drawnPath: currPath});
        coordsCopy = JSON.parse(JSON.stringify(coords));
        setNewPolyCoords(geoToPoly(coordsCopy));
        break;
      case 'selectedPath':
        currPath = state.selectedPath;
        currPath.geometry.coordinates = coords;
        if (snap) {
          dispatch({...state, selectedPath: currPath});
        } else {
          let copy = JSON.parse(JSON.stringify(state.selectedPath));
          dispatch({...state, selectedPath: currPath, coordsCopy: copy.geometry.coordinates});
        }
        coordsCopy = JSON.parse(JSON.stringify(coords));
        setNewPolyCoords(geoToPoly(coordsCopy));
        break;
      default:
        return null;
    }
  }

  const disableDraw = (disable) => {
    dispatch({...state, disableDraw: disable});
  }

  const setAreaName = (area) => {
    dispatch({...state, area: area});
  }

  const setPathDistance = (distance) => {
    dispatch({...state, distance: distance});
  }

  const cancelEverything = () => {
    dispatch({
      ...state,
      clearMap: false,
      pathsRefetched: true,
      recording: false,
      drawing: false,
      eraseProcedure: false,
      disableDraw: false,
      bottomExpanded: true,
      showEvaluationModal: false,
      showMapSelectionModal: false,
      showFaqModal: false,
      showSaveLocationConsentModal: false,
      showDrawPathTutorialModal: false,
      showDeleteModal: {show: false, type: null,  msg: null, id: null},
      notificationToast: {show: false, type: null, msg: null},
      visibleUserPaths: [],
      visibleCommunityPaths: [],
      editProcedure: false,
      objectiveSelection: defaultObjectiveValue,
      subjectiveSelection: defaultSubjectiveValue,
      pathEvaluated: false,
      recordedPath: null,
      area: null,
      distance: null,
      coordsCopy: null,
      centerCoords: null,
      recordedPathOriginal: null,
      drawnPath: null,
      selectedPath: null,
      pathName: null,
      pathDescr: null,
      drawType: null,
      drawn: null,
      evaluations: [],
      edited: [],
      snapped: false
    });
    localforage.removeItem('snapped-path');
  }

  return (
    <div className="App">
        <AppContext.Provider value={{ state, dispatch }}>
          <Header/>
          <main>
            <section>
              {!location.pathname.match(/home/) &&
              !location.pathname.match(/register/) &&
              !location.pathname.match(/login/) &&
              !location.pathname.match(/incompatible/) &&
              !location.pathname.match(/change\/password/) ?
              <CustomMap
                recording = {state.recording}
                objectiveSelection = {state.objectiveSelection}
                subjectiveSelection = {state.subjectiveSelection}
                generateRecordedPath= {generateRecordedPath}
                setEditEndAndDuration={setEditEndAndDuration}
                clearMap={state.clearMap}
                setEditStartProcedure={setEditStartProcedure}
                drawnPathActions={drawnPathActions}
                stoppedErasing={stoppedErasing}
                pathDescr={state.pathDescr}
                resetDrawnPath={resetDrawnPath}
                drawing={state.drawing}
                drawnPath={!!state.drawnPath}
                recordedPath={!!state.recordedPath}
                selectedPath={!!state.selectedPath}
                alterExistingPath={alterExistingPath}
                newPolyCoords={newPolyCoords}
                visibleUserPaths={state.visibleUserPaths}
                visibleCommunityPaths={state.visibleCommunityPaths}
                disableDraw={disableDraw}
                centerCoords={state.centerCoords}
                setAreaName={setAreaName}
                setPathDistance={setPathDistance}
                location={location.pathname}
                cancelDraw={cancelDraw}
                cancelEverything={cancelEverything}
              />:null}
              <Switch>
                <Route exact path="/home" component={withRouter(Landing)} />
                <Route exact path="/register" component={withRouter(Register)} />
                <Route exact path="/login" component={withRouter(Login)} />
                <Route exact path="/incompatible" component={DeviceMessage} />
                <PrivateRoute exact path="/change/password" component={ChangePassword} />
                <PrivateRoute  authed={authReducer.isAuthenticated} exact path='/location' component={LocateAndRecord} />}/>
                <PrivateRoute  authed={authReducer.isAuthenticated} exact path='/draw' component={DrawPath} />}/>
                <PrivateRoute  authed={authReducer.isAuthenticated} exact path='/pathlist' component={PathList} />}/>
                <PrivateRoute  authed={authReducer.isAuthenticated} exact path='/community' component={CommunityPathList} />}/>
                <Route path="/" render={()=> <Redirect to="/home"/>}/>
              </Switch>
              <BouncyArrow />
              <BottomBar/>
              <EvaluationModal />
              <MapSelectionModal />
              <FaqModal />
              <ConfirmDeletionModal />
              <NotificationToast />
              <SaveLocationConsentModal />
              <DrawPathTutorialModal />
              <SnapOverlay />
            </section>
          </main>
        </AppContext.Provider>

    </div>
  );
}


export const App = withRouter(AppComponent);

