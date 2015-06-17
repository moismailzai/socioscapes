/*jslint node: true */
'use strict';
var fetchGoogleGeocode = require('../fetchers/fetchGoogleGeocode.js'),
    viewGmap_Labels = require('./newViewGmap_Labels.js'),
    viewGmap_Map = require('./newViewGmap_Map.js');
/**
 * This constructor method appends a new Google Maps object -- of class {@linkcode MyGmapView} -- to the {@linkcode myLayer}
 * instance.
 *
 * @method newViewGmap
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Map view.
 * @param {String} config.div - The id of an html div element that will store the map
 * @param {String} config.address - The address around which the map around (eg. 'Toronto, Canada').
 * @param {String} config.styles - An optional array of {"feature": "rule"} declarative styles for map features.
 * @param {String} config.options - An array of valid Google Maps map option.
 * @param {String} config.labelStyles - An optional array of {"feature": "rule"} declarative styles for map labels.
 * @return {Object} MyGmapView - The rendered and configured view object.
 */
module.exports = function newViewGmap(config) {
    /**
     * Each instance of this class consists of a Google Map object, {@linkcode socioscapes.MyLayer.MyGmapView#map}, the
     * corresponding div container, {@linkcode socioscapes.MyLayer.MyGmapView#div}, and an arbitrary number of Google Map
     * data layers, {@linkcode socioscapes.MyLayer.MyGmapView#myGmapLayer}. 
     *
     * @namespace socioscapes.MyLayer.MyGmapView
     */
    var MyGmapView = function () {
        var _myMap,
            _myGmapLayer,
            _myGmapLayers,
            _myStyle,
            _myHoverListenerSet,
            _myHoverListenerReset,
            _myOnClickListener,
            _mySelectedFeatures,
            _mySelectionLimit,
            _mySelectionCount,
            _myFeatureId,
            _myDiv = document.getElementById(config.div),
            that = this;

        fetchGoogleGeocode(config.address, function (returnedAddress) {
            viewGmap_Map(returnedAddress, _myDiv, config.styles, config.options, function (returnedMap) {
                viewGmap_Labels(returnedMap, config.labelStyles, function (returnedLabeledMap) {
                    _myMap = returnedLabeledMap;
                    /**
                     * This container holds the Google Map data object and all related methods.
                     *
                     * @member map
                     * @memberof! socioscapes.MyLayer.MyGmapView
                     */
                    Object.defineProperty(that, 'map', {
                        value: _myMap
                    });
                    /**
                     * This method can be used to get or set the div for the Google Maps data object.
                     *
                     * @method div
                     * @memberof! socioscapes.MyLayer.MyGmapView
                     */
                    Object.defineProperty(that, 'div', {
                        value: function (div) {
                            if (!div) {
                                return _myDiv;
                            }
                            if (document.getElementById(div)) {
                                _myDiv = document.getElementById(div);
                                if (_myMap) {
                                //TODO add code that moves GMap to a new div and rerenders all existing layers.
                                }
                            }
                        }
                    });
                });
            });
        });

        /**
         *
         * @method myGmapLayer
         * @memberof! socioscapes.MyLayer.MyGmapView
         */
        Object.defineProperty(this, 'myGmapLayer', {
            get: function () { return _myGmapLayers; },
            set: function (name, id, url) {
                if (!_myGmapLayers) {
                    _myGmapLayers = {};
                }
                if (that[name] && id === "DELETE") {
                    delete(_myGmapLayers[name]);
                    delete(that[name]);
                } else if (!that[name] && id !== "DELETE") {
                    _myGmapLayer = new google.maps.Data();
                    _myGmapLayer.loadGeoJson(url, {idPropertyName: id});
                    /**
                     *
                     * @method style
                     * @memberof! socioscapes.MyLayer.MyGmapView.myGmapLayer
                     */
                    Object.defineProperty(that[name], 'style', {
                        get: function () { return _myStyle; },
                        set: function (styleFunction) {
                            _myGmapLayer.setStyle(styleFunction);
                            _myStyle = styleFunction;
                        }
                    });
                    /**
                     *
                     * @method on
                     * @memberof! socioscapes.MyLayer.MyGmapView.myGmapLayer
                     */
                    Object.defineProperty(that[name], 'on', {
                        value: function () { _myGmapLayer.setMap(_myDiv); }
                    });
                    /**
                     *
                     * @method off
                     * @memberof! socioscapes.MyLayer.MyGmapView.myGmapLayer
                     */
                    Object.defineProperty(that[name], 'off', {
                        value: function () { _myGmapLayer.setMap(null); }
                    });
                    /**
                     *
                     * @method onHover
                     * @memberof! socioscapes.MyLayer.MyGmapView.myGmapLayer
                     */
                    Object.defineProperty(that[name], 'onHover', {
                        value: function (callback) {
                            if (_myHoverListenerSet !== undefined) {
                                _myHoverListenerSet.remove();
                                _myHoverListenerReset.remove();
                            }
                            if (callback === "OFF") {
                                return;
                            }
                            // Set
                            _myHoverListenerSet = _myGmapLayer.addListener('mouseover', function (event) {
                                event.feature.setProperty('hover', true);
                                if (typeof callback === "function") {
                                    callback(event.feature);
                                }
                            });
                            // Reset
                            _myHoverListenerReset = _myGmapLayer.addListener('mouseout', function (event) {
                                event.feature.setProperty('hover', false);
                                if (typeof callback === "function") {
                                    callback(event.feature);
                                }
                            });
                        }
                    });
                    /**
                     *
                     * @method onClick
                     * @memberof! socioscapes.MyLayer.MyGmapView.myGmapLayer
                     */
                    Object.defineProperty(that[name], 'onClick', {
                        value: function (limit, callback) {
                            // Check to see if a click listener already exists for this layer and remove it / reset properties
                            if (_myOnClickListener !== undefined) {
                                _myOnClickListener.remove();
                                for (var _selectedFeature in _mySelectedFeatures) {
                                    if (_mySelectedFeatures.hasOwnProperty(_selectedFeature)) {
                                        _mySelectedFeatures[_selectedFeature].setProperty('selected', false);
                                        delete _mySelectedFeatures[_selectedFeature];
                                    }
                                }
                            }
                            if (limit === "OFF") {
                                return;
                            }
                            if (limit !== undefined && Number.isInteger(limit) === true) {
                                _mySelectionLimit = limit;
                            }
                            // Create the listener
                            _mySelectionCount = 0;
                            _myOnClickListener = this.addListener('click', function(event) {
                                _myFeatureId = event.feature.getProperty(id);
                                // If the clicked feature's selected property is TRUE
                                if (event.feature.getProperty('selected') === true) {
                                    event.feature.setProperty('selected', false);
                                    delete _mySelectedFeatures[_myFeatureId];
                                    if (_mySelectionLimit !== undefined && _mySelectionLimit > 0) {
                                        _mySelectionCount  = _mySelectionCount  - 1;
                                    }
                                    if (typeof callback === "function") {
                                        callback(event.feature, false);
                                    }
                                } else {
                                    if (_mySelectionLimit > _mySelectionCount ) {
                                        event.feature.setProperty('selected', true);
                                        _mySelectionCount  = _mySelectionCount  + 1;
                                        _mySelectedFeatures[_myFeatureId] = event.feature;
                                    } else if (!_mySelectionLimit){
                                        event.feature.setProperty('selected', true);
                                        _mySelectedFeatures[_myFeatureId] = event.feature;
                                    }
                                    if (typeof callback === "function") {
                                        callback(event.feature, true);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    };
    return new MyGmapView;
};