/*jslint node: true */
/*global socioscapes, module, google, feature, event, require*/
'use strict';
var fetchGoogleGeocode = require('./../fetch/fetchGoogleGeocode.js'),
    viewGmap_Labels = require('./gmapLabels.js'),
    viewGmap_Map = require('./gmapMap.js');
/**
 * This constructor method appends a new Google Maps object of class {@linkcode MyGmapView} to {@linkcode myLayer}.
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
    var callback = arguments[arguments.length - 1];
    callback = (typeof callback === 'function') ? callback:function(result) { return result; };
    /**
     * Each instance of this class consists of a Google Map object, {@linkcode MyLayer.MyGmapView.map}, a
     * corresponding div container, {@linkcode MyLayer.MyGmapView.div}, and an arbitrary number of Google Map
     * data layers, {@linkcode MyGmapDataLayer}.
     *
     * @namespace MyGmapView
     */
    var MyGmapView = function () {
        var _myMap,
            _myGmapDataLayer,
            _myGmapDataLayers,
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
                     * This container stores the Google Map data object and all related methods. To learn more about the
                     * Google Maps object, see {@link https://developers.google.com/maps/documentation/javascript/reference}.
                     *
                     * @member map
                     * @memberof! MyGmapView
                     */
                    Object.defineProperty(that, 'map', {
                        value: _myMap
                    });
                    /**
                     * This method sets or returns the DOM div object that stores the Google Map object.
                     *
                     * @example
                     * // set the google maps div to 'map-container'
                     * MyLayer.MyGmapView.div('map-container')
                     *
                     * @method div
                     * @memberof! MyGmapView
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
         * This constructor method appends a new Google Maps data layer ({@linkcode MyGmapDataLayer}) to
         * {@linkcode MyGmapView}. It expects three arguments: a name for the new layer, the property by which geometry
         * features should be identified, and a link to a valid GeoJSON URL. To learn more about Google Maps data layers,
         * see {@link https://developers.google.com/maps/documentation/javascript/datalayer}.
         *
         * @example
         * //fetches and loads GeoJSON features using the 'dauid' property as an identifier
         * MyGmapDataLayer('myLayerName', 'dauid', 'http://www.mygeojsonfiles.com/myfile.json')
         *
         * @method newGmapDataLayer
         * @memberof! MyGmapView
         * @return {Object} MyGmapDataLayer
         */
        Object.defineProperty(this, 'newGmapDataLayer', {
            value: function (name, id, url) {
                if (!_myGmapDataLayers) {
                    _myGmapDataLayers = {};
                }
                if (!name) {
                    return _myGmapDataLayers;
                }
                if (that[name] && id === "DELETE") {
                    delete(_myGmapDataLayers[name]);
                    delete(that[name]);
                } else if (!that[name] && id !== "DELETE") {
                    /**
                     * Each MyGmapDataLayer is made up of a Google Maps Data Layer object as well as the
                     * {@link MyGmapDataLayer.on}, {@link MyGmapDataLayer.off}, {@link MyGmapDataLayer.onHover},
                     * {@link MyGmapDataLayer.onClick}, and {@link MyGmapDataLayer.style} methods. To learn more about
                     * Google Map Data Layers, see
                     * {@link https://developers.google.com/maps/documentation/javascript/datalayer}.
                     *
                     * @namespace MyGmapDataLayer
                     */
                    _myGmapDataLayer = new google.maps.Data();
                    _myGmapDataLayer.loadGeoJson(url, {idPropertyName: id});
                    /**
                     * This method calls the Google Maps Data Layer setStyle() function to create declarative style rules
                     * for {@linkcode MyGmapDataLayer}. To learn more about styling Google Maps Data Layers, see
                     * {@linkcode https://developers.google.com/maps/documentation/javascript/datalayer}.
                     *
                     * @method style
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'style', {
                        value: function (styleFunction) {
                            if (!styleFunction) {
                                return _myStyle;
                            }
                            _myGmapDataLayer.setStyle(styleFunction);
                            _myStyle = styleFunction;
                        }
                    });
                    /**
                     * This method renders {@linkcode MyGmapDataLayer} in {@linkcode MyGmapView.div}.
                     *
                     * @example
                     * // shows MyGmapDataLayer
                     * MyGmapDataLayer.on()
                     *
                     * @method on
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'on', {
                        value: function () { _myGmapDataLayer.setMap(_myDiv); }
                    });
                    /**
                     * This method hides {@linkcode MyGmapDataLayer}.
                     *
                     * @example
                     * // hides MyGmapDataLayer
                     * MyGmapDataLayer.off()
                     *
                     * @method off
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'off', {
                        value: function () { _myGmapDataLayer.setMap(null); }
                    });
                    /**
                     * This method creates a Google Maps listener that sets the 'hover' property of a
                     * {@linkcode MyGmapDataLayer} feature to 'true' when a user hovers over it. To learn more about
                     * Google Map listeners, see {@link https://developers.google.com/maps/documentation/javascript/events}.
                     *
                     * @example
                     * // turns on the onHover listener
                     * MyGmapDataLayer.onHover()
                     *
                     * @method onHover
                     * @memberof! MyGmapDataLayer
                     * @param {Function} [callback] - This is an optional callback to send 'event.feature' to.
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
                            _myHoverListenerSet = _myGmapDataLayer.addListener('mouseover', function (event) {
                                event.feature.setProperty('hover', true);
                                if (typeof callback === "function") {
                                    callback(event.feature);
                                }
                            });
                            // Reset
                            _myHoverListenerReset = _myGmapDataLayer.addListener('mouseout', function (event) {
                                event.feature.setProperty('hover', false);
                                if (typeof callback === "function") {
                                    callback(event.feature);
                                }
                            });
                        }
                    });
                    /**
                     * This method creates a Google Maps listener that sets the 'selected' property of a
                     * {@linkcode MyGmapDataLayer} feature to 'true' when a user clicks it. When a geometry feature is
                     * clicked, it remains in a selected state until it is clicked again. Calling this method with an
                     * integer parameter sets a limit for the total number of simultaneously selected geometry features.
                     * To learn more about Google Map listeners, see
                     * {@link https://developers.google.com/maps/documentation/javascript/events}.
                     *
                     * @example
                     * // turns on the onClick listener
                     * MyGmapDataLayer.onClick()
                     *
                     * @example
                     * // turns off the onClick listener
                     * MyGmapDataLayer.onClick('OFF')
                     *
                     * @example
                     * // turns on the onClick listener and sets the maximum number of selected geometry features to 2
                     * MyGmapDataLayer.onClick(2)
                     *
                     * @method onClick
                     * @memberof! MyGmapDataLayer
                     * @param {Number} [limit] - This optional parameter can be used either to set a limit for the total
                     * number of simultaneously selected features, by entering an integer value, or to turn off the
                     * listener, by entering the string 'OFF'.
                     * @param {Function} [callback] - This is an optional callback to send 'event.feature' to.
                     */
                    Object.defineProperty(that[name], 'onClick', {
                        value: function (limit, callback) {
                            // Check for existing listener
                            if (_myOnClickListener !== undefined) {
                                _myOnClickListener.remove();
                                for (var _selectedFeature in _mySelectedFeatures) {
                                    if (_mySelectedFeatures.hasOwnProperty(_selectedFeature)) {
                                        _mySelectedFeatures[_selectedFeature].setProperty('selected', false);
                                        delete _mySelectedFeatures[_selectedFeature];
                                    }
                                }
                            }
                            if (limit === 'OFF') {
                                return;
                            }
                            if (limit !== undefined && Number.isInteger(limit) === true) {
                                _mySelectionLimit = limit;
                            }
                            _mySelectionCount = 0;
                            _myOnClickListener = this.addListener('click', function(event) {
                                _myFeatureId = event.feature.getProperty(id);
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
                    /**
                     * This container stores all features that have been set to a 'selected' state by
                     * {@linkcode MyGmapDataLayer.onClick}.
                     *
                     * @member selectedFeatures
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'selectedFeatures', {
                        value: _mySelectedFeatures
                    });
                }
            }
        });
    };
    callback(new MyGmapView);
};