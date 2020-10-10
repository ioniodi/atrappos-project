import React, {useEffect, useState} from 'react';
import {LoaderPin} from "./LoaderPin";
import {useSelector} from "react-redux";



export const SnapOverlay = (props) => {
    const pathsReducer = useSelector(state => state.paths);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(()=> {
        setShowOverlay(pathsReducer.snappedPath.fetching);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathsReducer.snappedPath.fetching]);

    return (
        <React.Fragment>
            {showOverlay ?
                <div className='snap-overlay'>
                    <div className='snap-overlay__loader'>
                        <LoaderPin msg="Snapping path, please be patient if this takes too long..." />
                    </div>
                </div>:null}
        </React.Fragment>
    );
};
