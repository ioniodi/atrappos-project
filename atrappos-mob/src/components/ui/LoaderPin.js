import React from 'react';



export const LoaderPin = (props) => {
    const {msg} = props;
    return (
        <div className="loader-pin__wrapper">
               <div className="loader-pin">
                   <div className='pin'></div>
                   <div className='pulse'></div>
               </div>
            <h6>
                {msg}
            </h6>
        </div>
    );
};

