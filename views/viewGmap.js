'use strict';
/**
 * This METHOD creates new Google Maps view and returns the object.
 *
 * @method viewGmap
 * @param config.div Div ID for an empty div or a Google map object.
 * @param config.address {String} The address to center the map around.
 * @param config.styles {String} The style options for the Google map.
 * @param config.options {String} The map options for the Google map.
 * @param config.labelStyles {String} The style options for the Label layer.
 * @return this {Object}
 */

var fetchGoogleGeocode = require('../fetchers/fetchGoogleGeocode.js'),
    viewGmap_Labels = require('./viewGmap_Labels.js'),
    viewGmap_Map = require('./viewGmap_Map.js');

module.exports = function (config) {

    var MyView = function() {
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
                    Object.defineProperty(that, 'map', {
                        value: _myMap
                    });
                    Object.defineProperty(that, 'div', {
                        get: function () { return _myDiv; },
                        set: function (div) {
                            if (document.getElementById(div)) {
                                _myDiv = document.getElementById(div);
                            }
                        }
                    });
                });
            });
        });

        Object.defineProperty(this, 'newGmapLayer', {
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

                    Object.defineProperty(that[name], 'style', {
                        get: function () { return _myStyle; },
                        set: function (styleFunction) {
                            _myGmapLayer.setStyle(styleFunction);
                            _myStyle = styleFunction;
                        }
                    });

                    Object.defineProperty(that[name], 'on', {
                        value: function () { _myGmapLayer.setMap(_myDiv); }
                    });

                    Object.defineProperty(that[name], 'off', {
                        value: function () { _myGmapLayer.setMap(null); }
                    });

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
    return new MyView;
};