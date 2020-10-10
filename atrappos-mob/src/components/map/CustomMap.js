import React, {Component} from 'react';
import {connect} from "react-redux";
import * as L from 'leaflet';
import 'leaflet-draw';
import {CachedTileLayer} from '@yaga/leaflet-cached-tile-layer';
import PropTypes from "prop-types";
import { EditControl } from "react-leaflet-draw";
import {
    AttributionControl,
    Map,
    TileLayer,
    FeatureGroup,
    GeoJSON, Polyline, Marker, Popup
} from "react-leaflet";
import Geocoder from 'leaflet-control-geocoder';
// eslint-disable-next-line
// import { GestureHandling } from "leaflet-gesture-handling";
// import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import {loginUser} from "../../services/authService";
import moment from "moment";
import {
    defaultObjectiveValue,
    defaultSubjectiveValue, drawLocalOpts, locateOpts,
    mapLayers, subjectiveTypesKeyValue
} from "../../lib/constants";
import LocateControl from './LocateControl.js';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import {cancelMapEvent, getRandomInt, isFunction, sendGaEvent} from "../../lib/utils";
import {PathInfoTooltip} from "../ui/PathInfoTooltip";


const southWest = L.latLng( 34.582754, 19.072326),
    northEast = L.latLng(41.948798, 29.382288),
    bounds = L.latLngBounds(southWest, northEast);

const locateOptions = locateOpts;

delete L.Icon.Default.prototype._getIconUrl;

L.drawLocal = drawLocalOpts;

class CustomMap extends Component {
    constructor(props) {
        super(props);

        this.mapRef = React.createRef();

        this.state = {
            zoom: 16,
            currCenter: null,
            recording: props.recording,
            locationPolyCoords: [],
            objective: props.objectiveSelection,
            subjective: props.subjectiveSelection,
            editStart: null,
            editStop: null,
            pathDescr: null,
            hasDrawnPath: false,
            hasRecordedPath: false,
            hasSelectedPath: false,
            polyKey: getRandomInt(9999),
            selectedUserPaths: [],
            selectedCommunityPaths: [],
            locationName: 'Unknown area',
            distance: null,
            tileLayer: this.props.mapLayers.mapLayer,
        }


        this._onFeatureGroupReady = this._onFeatureGroupReady.bind(this);
        this._onFeatureGroupReady = this._onFeatureGroupReady.bind(this);
        this._onCreated = this._onCreated.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onMounted = this._onMounted.bind(this);
        this._onEditStart = this._onEditStart.bind(this);
        this._onEditStop = this._onEditStop.bind(this);
        this._onEdited = this._onEdited.bind(this);
        this.generateGeoJSON = this.generateGeoJSON.bind(this);
        this.getLocationName = this.getLocationName.bind(this);
        this.getPathDistance = this.getPathDistance.bind(this);
    }


    UNSAFE_componentWillMount() {
        let latlng = new L.LatLng(37.9754983,  23.7356671);
        this.setState({
            currCenter: latlng
        })
    }

    componentDidMount() {
        const map = this.mapRef.current.leafletElement;
        let _this = this;
        const leafletCachedTileLayer = new CachedTileLayer(mapLayers[this.state.tileLayer].layer, {
            // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: mapLayers[this.state.tileLayer].maxZoom,
            databaseName: 'tile-cache-data', // optional
            databaseVersion: 1, // optional
            objectStoreName: 'OSM', // optional
            crawlDelay: 500, // optional
            maxAge: 1000 * 60 * 60 * 24 * 7, // optional
            bounds: bounds
        });

        leafletCachedTileLayer.addTo(map);

        map.on('locationfound', function(loc) {
            if (_this.state.recording) {
                _this.setState(prevState => {
                    return {
                        locationPolyCoords: prevState.locationPolyCoords.length <= 0 ? [[loc.latitude, loc.longitude]] : [...prevState.locationPolyCoords, [loc.latitude, loc.longitude]]
                    }
                }, () => {
                    console.log("on location found", _this.state.locationPolyCoords)
                })
            }
        });

        map.on('draw:toolbarclosed', function(e){
           if (_this.props.drawing) {
               _this.props.cancelDraw();
           }
        })

        map.on('popupopen', function(e){
            if (e.popup &&
                e.popup._source &&
                e.popup._source.options) {
                if (e.popup._source.options.className && e.popup._source.options.className === 'leaflet-control-locate-marker') {
                    sendGaEvent({category: "open-location-info-popup", action: 'map-action'});
                } else {
                    if (e.popup._source.options.data &&
                        e.popup._source.options.data.type==='Feature') {
                        sendGaEvent({category: "open-poly-info-popup", action: 'map-action'});
                    } else {
                        sendGaEvent({category: "open-marker-info-popup", action: 'map-action'});
                    }
                }
            }
        });
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.recording !== this.props.recording) {
            this.setState({
                ...this.state,
                recording: this.props.recording
            }, ()=> {
                if (!this.state.recording) {
                    this.generateGeoJSON('recorded')
                }
            })
        }
        if (prevProps.objectiveSelection !== this.props.objectiveSelection) {
            if (this.state.hasDrawnPath || this.state.hasSelectedPath) {
                let layers = this._editableFG.leafletElement.getLayers();
                Object.keys(layers).forEach((key)=> {
                    if (layers[key] instanceof L.Polyline) {
                        layers[key].setStyle({weight: this.props.objectiveSelection});
                    }
                })
            }
            this.setState({
                objective: this.props.objectiveSelection
            })
        }
        if (prevProps.subjectiveSelection !== this.props.subjectiveSelection) {
            if (this.state.hasDrawnPath || this.state.hasSelectedPath) {
                let layers = this._editableFG.leafletElement.getLayers();
                Object.keys(layers).forEach((key)=> {
                    if (layers[key] instanceof L.Polyline) {
                        layers[key].setStyle({color: this.props.subjectiveSelection});
                    }
                })
            }
            this.setState({
                subjective: this.props.subjectiveSelection
            })
        }

        if (prevProps.drawnPath !== this.props.drawnPath) {
            this.setState({
                hasDrawnPath: this.props.drawnPath
            })
        }

        if (prevProps.recordedPath !== this.props.recordedPath) {
            this.setState({
                hasRecordedPath: this.props.recordedPath
            })
        }

        if (prevProps.selectedPath !== this.props.selectedPath) {
            this.setState({
                hasSelectedPath: this.props.selectedPath
            })
        }


        if (prevProps.clearMap !== this.props.clearMap) {
            if (this.props.clearMap) {
                this.setState({
                    locationPolyCoords: [],
                    editStart: null,
                    editStop: null,
                }, ()=> {
                    this._editableFG.leafletElement.clearLayers();
                })
            }
        }

        if (prevProps.pathDescr !== this.props.pathDescr) {
            this.setState({
                pathDescr: this.props.pathDescr
            })
        }
        // The disabling of map's zoom during draw/edit has been commented out, due to users' feedback
        // if (prevProps.drawing !== this.props.drawing) {
        //     const map = this.mapRef.current.leafletElement;
        //    if (this.props.drawing) {
        //           map.gestureHandling.disable();
        //    } else {
        //           map.gestureHandling.enable();
        //    }
        // }

        if (prevProps.newPolyCoords !== this.props.newPolyCoords) {
            if (this.props.newPolyCoords.length > 0) {
                let coords = this.props.newPolyCoords;
                let middleIdx= Math.round((coords.length - 1) / 2);
                let centerCoords = coords[middleIdx];
                let centerMap = new L.LatLng(centerCoords[0], centerCoords[1]);
                this.setState({
                    locationPolyCoords: this.props.newPolyCoords,
                    polyKey: getRandomInt(99999),
                    currCenter: centerMap

                });
            }
        }

        if (prevProps.visibleUserPaths !== this.props.visibleUserPaths) {
            this.setState({
                    selectedUserPaths: this.props.visibleUserPaths
            }, ()=> {
                let map = this.mapRef.current;
                let latLons = this.state.selectedUserPaths.map((path) => {
                    return path.geometry.coordinates.map((coords) => {
                        return [coords[1], coords[0]]
                    })
                }).flat(1);
                if (map && latLons.length > 0) {
                    let mapLeaf= map.leafletElement;
                    mapLeaf.fitBounds(latLons);
                }
            })
        }

        if (prevProps.visibleCommunityPaths !== this.props.visibleCommunityPaths) {
            this.setState({
                selectedCommunityPaths: this.props.visibleCommunityPaths
            }, () => {
                let map = this.mapRef.current;
                let latLons = this.state.selectedCommunityPaths.map((path) => {
                    return path.geometry.coordinates.map((coords) => {
                        return [coords[1], coords[0]]
                    })
                }).flat(1);
                if (map && latLons.length > 0) {
                    let mapLeaf= map.leafletElement;
                    mapLeaf.fitBounds(latLons);
                }
            })
        }

        if (prevProps.location !== this.props.location && this.props.location !== '/pathlist') {
            this.setState({
                selectedUserPaths: []
            })
        }

        if (prevProps.location !== this.props.location && this.props.location !== '/community') {
            this.setState({
                selectedCommunityPaths: []
            })
        }

        if (prevProps.centerCoords !== this.props.centerCoords && this.props.centerCoords) {
            let centerMap = new L.LatLng(this.props.centerCoords[1], this.props.centerCoords[0]);
            this.setState({
                currCenter: centerMap
            })
        }

        if (prevState.locationName !== this.state.locationName && this.state.locationName) {
            this.props.setAreaName(this.state.locationName)
        }

        if (prevState.distance !== this.state.distance && this.state.distance) {
            this.props.setPathDistance(this.state.distance)
        }

        if (prevProps.mapLayers.mapLayer !== this.props.mapLayers.mapLayer) {
            this.setState({
                ...this.state,
                tileLayer: this.props.mapLayers.mapLayer
            })
        }

        window.onpopstate = e => {
            cancelMapEvent(e);
            this._editableFG.leafletElement.clearLayers();
            this.props.cancelEverything();

        }
    }

    generateGeoJSON(type) {
        let fg = this._editableFG.leafletElement;
        if (fg._layers) {
            Object.keys(fg._layers).forEach((key)=> {
                let geoJSON = fg._layers[key].toGeoJSON();
                if (geoJSON.geometry.type === 'LineString') {
                    let latlng = fg._layers[key]._latlngs[0];
                    this.getLocationName(latlng, Math.round(parseInt(this.state.zoom)));
                    let that = this;
                    this.getPathDistance(fg._layers[key]._latlngs, function(resDistance) {
                        if (resDistance) {
                            that.setState({
                                distance: resDistance
                            });
                            if (type === 'recorded') {
                                that.props.generateRecordedPath(geoJSON, resDistance);
                            }
                        }
                    });
                }
            })
        } else {
            if (type === 'recorded') {
                this.props.generateRecordedPath(null)
            }
        }
    }

    onZoomChange(zoom) {
        if (zoom < 16) {
            this.props.disableDraw(true);
        } else {
            this.props.disableDraw(false);
        }

        this.setState({
            zoom: zoom
        })
    }

    _editableFG = null;

    _onFeatureGroupReady (reactFGref) {
        if (reactFGref) {
            this._editableFG = reactFGref;
        }
    };

    _onChange = () => {
        // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API
        const { onChange } = this.props;
        if (!this._editableFG || !onChange) {
            return;
        }
        const geojsonData = this._editableFG.leafletElement.toGeoJSON();
        onChange(geojsonData);
    }

    _onEdited = (e) => {
        let layers = this._editableFG.leafletElement.getLayers();
        Object.keys(layers).forEach((key)=> {
            if (layers[key] instanceof L.Polyline) {
                let latLng = layers[key]._latlngs[0];
                this.getLocationName(latLng, Math.round(parseInt(this.state.zoom)));
                this.getPathDistance(layers[key]._latlngs);
                let newCoords = layers[key].toGeoJSON().geometry.coordinates;
                let type;
                switch(true) {
                   case this.state.hasRecordedPath:
                       type = "recordedPath";
                       break;
                   case this.state.hasDrawnPath:
                       type = "drawnPath";
                       break;
                   case this.state.hasSelectedPath:
                       type = "selectedPath";
                       break;
                   default:
                       return null;
                }
                this.props.alterExistingPath(type, newCoords);
            }
        })
        this._onChange();
    }

    _onCreated = (e) => {
        let type = e.layerType;
        let layer = e.layer;


        if (type === 'polyline') {
            if (this.state.pathDescr) {
                layer.bindPopup(this.state.pathDescr);
            }

            let latLng = layer._latlngs[0];
            this.getLocationName(latLng, Math.round(parseInt(this.state.zoom)));
            this.getPathDistance(layer._latlngs);

            this._editableFG.leafletElement.addLayer(layer);

            this.props.drawnPathActions(layer.toGeoJSON());

        } else {
            console.log("_onCreated: something else created:", type, e);
        }

        this._onChange();

    }

    _onDeleted = (e) => {

        let numDeleted = 0;
        e.layers.eachLayer( (layer) => {
            numDeleted += 1;
        });
        console.log(`onDeleted: removed ${numDeleted} layers`, e);
        let _this = this;
        if (numDeleted > 0) {
            _this.props.resetDrawnPath();
        }

        this._onChange();
    }

    _onMounted = (drawControl) => {
        console.log('_onMounted', drawControl);
    }

    _onEditStart = (e) => {
        // this.mapRef.current.leafletElement.gestureHandling.disable();
        this.setState({
            editStart: moment(new Date())
        }, ()=> {
            this.props.setEditStartProcedure(true);
        });
    }

    _onEditStop = (e) => {
        console.log('_onEditStop', e);
        // this.mapRef.current.leafletElement.gestureHandling.enable();
        this.setState({
            editStop: moment(new Date())
        }, ()=> {
            this.props.setEditEndAndDuration(this.state.editStart, this.state.editStop);

        });
    }

    _onDeleteStart = (e) => {
        // this.mapRef.current.leafletElement.gestureHandling.disable();
        console.log('_onDeleteStart', e);
    }

    _onDeleteStop = (e) => {
        console.log('_onDeleteStop', e);
        // this.mapRef.current.leafletElement.gestureHandling.enable();
        this.props.stoppedErasing(true);
    }

    async getLocationName(latLng, zoom) {
        const geocoder = Geocoder.nominatim();
        let promise = new Promise(function(resolve, reject) {
            geocoder.reverse(
                latLng,
                zoom,
                results => {
                    let r = results[0];
                    if (r) {
                        resolve(r)
                    }
                }
            );
        });
        await promise.then(area => {
            let result = area && area.properties && area.properties.address ?
                ((area.properties.address.road ?
                    area.properties.address.road : (area.properties.address.postcode ?
                    area.properties.address.postcode : 'Unknown road'
                    )) + ", " + (area.properties.address.suburb ?
                    area.properties.address.suburb :
                    (area.properties.address.city ? area.properties.address.city: 'Unknown suburb')
                )): 'Unknown area';
            this.setState({
                locationName:  result
            })
        })
    }

    getPathDistance(latLngs, callback) {
        let tempLatLng = null;
        let totalDistance = 0.00000;
        latLngs.forEach((latlng, idx)=> {
            if (tempLatLng == null){
                tempLatLng = latlng;
                return;
            }
            totalDistance += tempLatLng.distanceTo(latlng);
            tempLatLng = latlng;
            if (idx === (latLngs.length - 1) && isFunction(callback)) {
               callback(totalDistance);
            }
        });
    }


    render() {
        return (
            <Map
                onzoomend={() => {this.onZoomChange(this.mapRef.current.leafletElement.getZoom())}}
                ref={this.mapRef}
                style={{height: "calc(100vh - 35px)", width: "100%"}}
                minZoom={8}
                maxZoom={mapLayers[this.state.tileLayer].maxZoom ? mapLayers[this.state.tileLayer].maxZoom : 19}
                // gestureHandling={true}
                center={this.state.currCenter}
                maxBounds={bounds}
                zoom={this.state.zoom}
                attributionControl={false}
            >
                <TileLayer
                    url={mapLayers[this.state.tileLayer].layer}
                    bounds={bounds}
                    maxZoom={mapLayers[this.state.tileLayer].maxZoom}
                    attribution={mapLayers[this.state.tileLayer].attribution}
                />
                <AttributionControl position="topright" prefix={false} />
                <LocateControl options={locateOptions} startDirectly />
                <FeatureGroup ref={ (reactFGref) => {
                    this._onFeatureGroupReady(reactFGref)}}>
                    {this.state.locationPolyCoords && this.state.locationPolyCoords.length > 0 ?
                        <Polyline key={this.state.polyKey}
                                  positions={this.state.locationPolyCoords}
                                  color={this.state.subjective ? this.state.subjective : defaultSubjectiveValue}
                                  weight={this.state.objective ? this.state.objective : defaultObjectiveValue}
                        />:null
                    }
                    <EditControl
                        position='topleft'
                        draw={{
                            rectangle: false,
                            polygon: false,
                            circlemarker: false,
                            circle: false,
                            marker: false,
                            polyline: {
                                shapeOptions:  {
                                    color: this.state.subjective,
                                    weight: this.state.objective,
                                    opacity: 1
                                }}
                        }}
                        edit= {{

                        }}
                        onChange={this._onChange}
                        onCreated={this._onCreated}
                        onMounted={this._onMounted}
                        onEditStart={this._onEditStart}
                        onEditStop={this._onEditStop}
                        onEdited={this._onEdited}
                        onDeleteStart={this._onDeleteStart}
                        onDeleteStop={this._onDeleteStop}
                        onDeleted={this._onDeleted}
                    />
                </FeatureGroup>
                {this.state.selectedUserPaths.length > 0 ?
                    this.state.selectedUserPaths.map((path)=> {
                        return <React.Fragment key={path._id}>
                            {path.geometry.type === "LineString" ?
                                <React.Fragment>
                                    <GeoJSON  key={path._id}
                                              data={path}
                                              style={{weight: path.properties.objective, color: path.properties.subjective}}>
                                        <Popup>
                                            <PathInfoTooltip distance={path.distance}
                                                             area={path.area}
                                                             name={path.name}
                                                             description={path.description}
                                                             drawType={path.drawType}
                                                             type='path-map'
                                                             id={path._id}
                                            />
                                        </Popup>
                                    </GeoJSON>
                                    <Marker
                                        icon={subjectiveTypesKeyValue[path.properties.subjective].marker}
                                        position={[path.geometry.coordinates[0][1], path.geometry.coordinates[0][0]]}>
                                        <Popup>
                                            <PathInfoTooltip distance={path.distance}
                                                             area={path.area}
                                                             name={path.name}
                                                             description={path.description}
                                                             drawType={path.drawType}
                                                             type='path-map'
                                                             id={path._id}
                                            />
                                        </Popup>
                                    </Marker>
                                    <Marker
                                        icon={subjectiveTypesKeyValue[path.properties.subjective].marker}
                                        position={[path.geometry.coordinates[path.geometry.coordinates.length - 1][1], path.geometry.coordinates[path.geometry.coordinates.length - 1][0]]}>
                                        <Popup>
                                            <PathInfoTooltip distance={path.distance}
                                                             area={path.area}
                                                             name={path.name}
                                                             description={path.description}
                                                             drawType={path.drawType}
                                                             type='path-map'
                                                             id={path._id}
                                            />
                                        </Popup>
                                    </Marker>
                                </React.Fragment>
                                :null}
                        </React.Fragment>
                    })
                    :null}
                {this.state.selectedCommunityPaths.length > 0 ?
                    this.state.selectedCommunityPaths.map((path)=> {
                        return <React.Fragment key={path._id}>
                            {path.geometry.type === "LineString" ?
                                <React.Fragment>
                                    <GeoJSON  key={path._id}
                                              data={path}
                                              style={{weight: path.properties.objective,
                                                  color: path.properties.subjective,
                                                  opacity: path.userId !== this.props.auth.user.id ? '0.55' : '1'
                                              }}>
                                        <Popup>
                                            <PathInfoTooltip distance={path.distance}
                                                             area={path.area}
                                                             name={path.name}
                                                             description={path.description}
                                                             drawType={path.drawType}
                                                             type='path-map'
                                            />
                                        </Popup>
                                    </GeoJSON>
                                    <Marker
                                        icon={subjectiveTypesKeyValue[path.properties.subjective].marker}
                                        position={[path.geometry.coordinates[0][1], path.geometry.coordinates[0][0]]}>
                                        <Popup>
                                            <PathInfoTooltip distance={path.distance}
                                                             area={path.area}
                                                             name={path.name}
                                                             description={path.description}
                                                             drawType={path.drawType}
                                                             type='path-map'
                                                             id={path._id}
                                            />
                                        </Popup>
                                    </Marker>
                                    <Marker
                                        icon={subjectiveTypesKeyValue[path.properties.subjective].marker}
                                        position={[path.geometry.coordinates[path.geometry.coordinates.length - 1][1], path.geometry.coordinates[path.geometry.coordinates.length - 1][0]]}>
                                        <Popup>
                                            <PathInfoTooltip distance={path.distance}
                                                             area={path.area}
                                                             name={path.name}
                                                             description={path.description}
                                                             drawType={path.drawType}
                                                             type='path-map'
                                                             id={path._id}
                                            />
                                        </Popup>
                                    </Marker>
                                </React.Fragment>
                                :null}
                        </React.Fragment>
                    })
                    :null}
            </Map>
        );
    }
}

CustomMap.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    mapLayers: state.mapLayers
});

export default connect(
    mapStateToProps,
    { loginUser }
)(CustomMap);