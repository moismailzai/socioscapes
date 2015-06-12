/**
 * This METHOD appends a new Google Maps view to the socioscapes object and places it inside the specified div.
 *
 * @method setViewGmap
 * @param viewName {String} This is the name for the new view.
 * @param latLong {Object} Object with latitude and longitude coordinates. [.lat .long]
 * @param div {String} The DIV ID to place this view in (no #).
 * @param [mapOptions] {Object} Optional object with google maps options. See google api docs for formatting.
 * @param callback {Function} Callback.
 * @return this {Object}
 */

var fetchGoogleAuth = require('../fetchers/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('../fetchers/fetchGoogleGeocode.js'),
    setViewGmap_Labels = require('./setViewGmap_Labels.js'),
    setViewGmap_Map = require('./setViewGmap_Map.js');

module.exports = function (config) {
    var myGmapView, _myDiv, _myMap, _myGmapLayer, _myGmapLayers, _myStyle, _myHoverListenerSet, _myHoverListenerReset, _myOnClickListener, _mySelectedFeatures, _mySelectionLimit, _mySelectionCount, _myFeatureId;
    _myDiv = document.getElementById(config.div);

    fetchGoogleGeocode(config.address, function (geocodedAddress) {
        setViewGmap_Map(geocodedAddress, _myDiv, config.styles, config.options, function (mappedAddress) {
            setViewGmap_Labels(mappedAddress, config.labels, function (myMap) {
                myGmapView = {};
                _myMap = myMap;
                Object.defineProperty(myGmapView, 'div', {
                    get: function () { return _myDiv; },
                    set: function (div) {
                        if (document.getElementById(div)) {
                            _myDiv = document.getElementById(div);
                        }
                    }
                });
                Object.defineProperty(myGmapView, 'map', {
                    value: function () { return _myMap; }
                });
                Object.defineProperty(myGmapView.map, 'newLayer', {
                    get: function () { return _myGmapLayers; },
                    set: function (name, id, url) {
                        if (!myGmapView.map.layers) {
                            myGmapView.map.layers = {};
                        }
                        if (myGmapView.map.layers[name] && id === "DELETE") {
                            delete(_myGmapLayers[layerName]);
                            delete(myGmapView.map.layers[name]);
                        } else if (!myGmapView.map.layers[name] && id !== "DELETE") {
                            _myGmapLayer = new google.maps.Data();
                            _myGmapLayer.loadGeoJson(url, {idPropertyName: id});
                            Object.defineProperty(myGmapView.map.layers, name, {
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'setStyle', {
                                get: function () { return _myStyle; },
                                set: function (styleFunction) {
                                    _myGmapLayer.setStyle(styleFunction);
                                    _myStyle = styleFunction;
                                }
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'on', {
                                value: function () { _myGmapLayer.setMap(_myDiv); }
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'off', {
                                value: function () { _myGmapLayer.setMap(null); }
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'onHover', {
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
                            Object.defineProperty(myGmapView.map.layers.name, 'onClick', {
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
                                        // If the clicked feature's isSelected property is TRUE
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
                        return myGmapView;
                    }
                });
            });
        });
    });
};