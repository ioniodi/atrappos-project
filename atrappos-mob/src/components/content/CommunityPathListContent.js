import React from 'react';
import {CommunityPathListView} from "./CommunityPathListView";


export const CommunityPathListContent = () => {
    return (
        <div className="path-list__content bottom__content">
            <h5>{"Community paths"}</h5>
                <React.Fragment>
                    <CommunityPathListView />
            </React.Fragment>
        </div>
    );
};
