import ReactGA from 'react-ga';

export  const mapEvent =(e, cls)=> {
    let isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // eslint-disable-next-line
    var e;
    if (isiOS) {
        e = document.createEvent('TouchEvent');
        e.initEvent('touchstart', true, true);
    } else {
        e = document.createEvent('Event');
        e.initEvent('click', true, true);
    }
    var cb = document.getElementsByClassName(cls);
    return !cb[0].dispatchEvent(e);
};

export const cancelMapEvent =(e)=> {
    let isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // eslint-disable-next-line
    var e;
    if (isiOS) {
        e = document.createEvent('TouchEvent');
        e.initEvent('touchstart', true, true);
    } else {
        e = document.createEvent('Event');
        e.initEvent('click', true, true);
    }


        var cb = document.getElementsByClassName('leaflet-draw-actions-top')[0];
    var lastChild = cb ? cb.lastChild : null;
    var anchor = lastChild ? lastChild.children[0] : null;
    return anchor ? anchor.click() : null;
};


export const handleNavClick = (e, disabled) => {
    if (disabled) {
        e.preventDefault();
    }
}

export const geoToPoly = (data) => {
    return data.map((coords)=> {
        return coords.reverse();
    })
}

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

export function sendGaEvent (obj) {
    ReactGA.event(obj)
}

export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}