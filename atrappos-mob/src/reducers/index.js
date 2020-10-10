import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import pathsReducer from "./pathsReducer";
import mapLayersReducer from "./mapLayersReducer";
import consentReducer from "./consentReducer";

const appReducer = combineReducers({
  auth: authReducer,
  consent: consentReducer,
  paths: pathsReducer,
  errors: errorReducer,
  mapLayers: mapLayersReducer
});

const rootReducer = (state, action) => {
  return appReducer(state, action)
};

export default rootReducer;