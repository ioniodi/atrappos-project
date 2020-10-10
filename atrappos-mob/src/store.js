import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import logger from "redux-logger";
import reducers from "./reducers";
import { offline } from "redux-offline";
import offlineConfig from "redux-offline/lib/defaults";
import localforage from "localforage";
offlineConfig.persistOptions = { storage: localforage };

export const enhancer =
    (process.env.NODE_ENV === 'production' ?
            compose(
                applyMiddleware(promise, thunk),
                offline(offlineConfig)
            )
            :
            compose(
                applyMiddleware(promise, thunk, logger),
                offline(offlineConfig)
            )
    );

export default createStore(
    reducers,
    enhancer
);

