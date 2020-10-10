
const initialState = {
    allPaths: {
        fetching: false,
        fetched: false,
        payload: null
    },
    snappedPath: {
        fetching: false,
        fetched: false,
        payload: null
    },
    rehydrated: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case 'GET_ALL_PATHS_PENDING':
            return {
                ...state,
                allPaths: {
                    fetching: true,
                    fetched: false
                }
            };
        case 'GET_ALL_PATHS_REJECTED':
            return {
                ...state,
                allPaths: {
                    fetching: false,
                    fetched: false
                }
            };
        case 'GET_ALL_PATHS_FULFILLED':
            return {
                ...state,
                allPaths: {
                    fetching: false,
                    fetched: true
                }
            };
        case 'persist/REHYDRATE':
            return {
                ...state,
                allPaths: {
                    fetching: false,
                    fetched: true
                },
                rehydrated: true
            };
        case 'SNAP_PATH_PENDING':
            return {
                ...state,
                snappedPath: {
                    fetching: true,
                    fetched: false
                }
            };
        case 'SNAP_PATH_REJECTED':
            return {
                ...state,
                snappedPath: {
                    fetching: false,
                    fetched: false,
                    payload: action.payload
                }
            };
        case 'SNAP_PATH_FULFILLED':
            return {
                ...state,
                snappedPath: {
                    fetching: false,
                    fetched: true
                }
            };
        case "POST_PATH":
            return (state = {
                ...state,
                newPath: action.payload
            });
        case "PUT_PATH":
            return (state = {
                ...state,
                editedPath: action.payload
            });
        case "DELETE_PATH":
            return (state = {
                ...state,
                deletedPath: action.payload
            });
        default:
            return state;
    }
}
