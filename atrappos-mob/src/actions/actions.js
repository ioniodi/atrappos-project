const prefix = process.env.NODE_ENV === 'production' && process.env.SERVER_URL ? process.env.SERVER_URL : "";

export const saveOnePath = (path) => (dispatch) =>
    new Promise(function(resolve, reject) {
        path = JSON.stringify(path);
        let token = localStorage.getItem("jwtToken");
        dispatch({
            type: "POST_PATH",
            payload: {
                path
            },
            meta: {
                offline: {
                    // the network action to execute:
                    effect: {
                        url: prefix + `/api/path`,
                        method: "POST",
                        body: `${path}`,
                        headers: {
                            "content-type": "application/json;charset=UTF-8",
                            "Authorization": token
                        }
                    },
                    // action to dispatch when effect succeeds:
                    commit: { type: "POST_PATH", meta: {path} },
                    // action to dispatch if network action fails permanently:
                    rollback: { type: "POST_PATH_ROLLBACK", meta: { path } }
                }
            }
        });
        resolve(path)
    });

export const editOnePath = (path, id) => (dispatch) =>
    new Promise(function(resolve, reject) {
        let token = localStorage.getItem("jwtToken");
        path = JSON.stringify(path);
        dispatch({
            type: "PUT_PATH",
            payload: {
                path,
            },
            meta: {
                offline: {
                    // the network action to execute:
                    effect: {
                        url: prefix + `/api/path?id=` + id,
                        method: "PUT",
                        body: `${path}`,
                        headers: {
                            "content-type": "application/json;charset=UTF-8",
                            "Authorization": token
                        },
                    },
                    // action to dispatch when effect succeeds:
                    commit: {
                        type: "PUT_PATH",
                        meta: {path} },
                    // action to dispatch if network action fails permanently:
                    rollback: {
                        type: "PUT_PATH_ROLLBACK",
                        meta: { path } }
                }
            }
        });
        resolve(path)
    });

export const deleteOnePath = (id) => (dispatch) =>
    new Promise(function(resolve, reject) {
        let token = localStorage.getItem("jwtToken");
        dispatch({
            type: "DELETE_PATH",
            meta: {
                offline: {
                    // the network action to execute:
                    effect: {
                        url: prefix + `/api/path?id=` + id,
                        method: "DELETE",
                        headers: {
                            "content-type": "application/json;charset=UTF-8",
                            "Authorization": token
                        },
                    },
                    // action to dispatch when effect succeeds:
                    commit: { type: "DELETE_PATH" },
                    // action to dispatch if network action fails permanently:
                    rollback: { type: "DELETE_PATH_ROLLBACK" }
                }
            }
        });
        resolve(id)
    });


export function setMapLayer(layer) {
    return {
        type: "SET_MAP_LAYER",
        mapLayer: layer
    }
}




