/*jslint node: true */
/*global module, require, socioscapes, google*/
'use strict';
var chroma = socioscapes.fn.chroma,
    isValidObject = socioscapes.fn.isValidObject,
    fetchGoogleGeocode = socioscapes.fn.fetchGoogleGeocode,
    fetchFromScape = socioscapes.fn.fetchFromScape,
    fetchScapeObject = socioscapes.fn.fetchScape,
    newCallback = socioscapes.fn.newCallback;
socioscapes.fn.extend([
    {   path: 'viewGmapSymbology',
        alias: 'gsymbology',
        silent: true,
        extension:
            function viewGmapSymbology(view) {
                var callback = newCallback(arguments),
                    layer,
                    GmapLayer = function(view) {
                        var idValue,
                            listenerClick,
                            listenerHoverSet,
                            listenerHoverReset,
                            that = this;
                        if (view && view.config && view.config.gmap) {
                            view.config.gmap.styles = view.config.gmap.styles || {};
                            view.config.gmap.styles.default = view.config.gmap.styles.default ||  {
                                    fillOpacity: 0.75,
                                    fillColor: "purple",
                                    strokeOpacity: 0,
                                    strokeColor: "black",
                                    strokeWeight: 0,
                                    zIndex: 5,
                                    visible: true,
                                    clickable: true
                                };
                            view.config.gmap.styles.hover  = view.config.gmap.styles.hover ||  {
                                    fillOpacity: 75,
                                    fillColor: "purple",
                                    strokeOpacity: 1,
                                    strokeColor: "black",
                                    strokeWeight: 2,
                                    zIndex: 10,
                                    visible: true,
                                    clickable: true
                                };
                            view.config.gmap.styles.click  = view.config.gmap.styles.click || {
                                    fillOpacity: 1,
                                    fillColor: "purple",
                                    strokeOpacity: 1,
                                    strokeColor: "black",
                                    strokeWeight: 3,
                                    zIndex: 15,
                                    visible: true,
                                    clickable: true
                                };
                            view.config.features = {
                                "selected": {},
                                "selectedCount": 0,
                                "selectedLimit": 0
                            };
                            this.dataLayer = new google.maps.Data();
                            Object.defineProperty(this, 'init', {
                                value: function () {
                                    var callback = newCallback(arguments),
                                        layer = fetchScapeObject(view) ? fetchFromScape(view.config.layer, 'name', view.schema.parent.layer):false,
                                        data = layer ? layer.data:false,
                                        geom = layer ? layer.geom:false,
                                        featureIdProperty = (typeof view.config.featureIdProperty === 'string') ? view.config.featureIdProperty.toLowerCase():'dauid',
                                        valueIdProperty = (typeof view.config.valueIdProperty === 'string') ? view.config.valueIdProperty.toLowerCase():'total';
                                    if (data && geom && featureIdProperty && valueIdProperty) {
                                        if (geom.geoJson && geom.geoJson.features[0].properties[featureIdProperty]) {
                                            // remove the layer's existing features
                                            that.dataLayer.forEach(function(feature) {
                                                that.dataLayer.remove(feature);
                                            });
                                            try {
                                                // load features from the layer's geom store
                                                that.dataLayer.addGeoJson(geom.geoJson, {featureIdProperty: featureIdProperty});
                                                if (data.geoJson.features[0].properties[valueIdProperty] !== undefined) {
                                                    // join those features with the layer's data store
                                                    that.dataLayer.forEach(function(feature) {
                                                        // [this feature's value]  =  [the   matching   data   object's]    [value field]  (if it exists)
                                                        feature.G[valueIdProperty] = data.byId[feature.G[featureIdProperty]][valueIdProperty] ?
                                                            data.byId[feature.G[featureIdProperty]][valueIdProperty]:
                                                            false;
                                                    });
                                                    that.classify(function() {
                                                        that.style(function() {
                                                            that.onHover();
                                                            that.onClick(5);
                                                            callback(that);
                                                        });
                                                    });
                                                } else {
                                                    console.log('Sorry, that layer does not contain matching data for the geometry.');
                                                }
                                            }
                                            catch(error) {
                                                console.log('Sorry, the Google Maps API encountered a problem adding your features to the symbology layer: ' + error);
                                            }
                                        } else {
                                            console.log('Sorry, the geometry at layer "' + view.config.layer + '" does not have a property called "' + view.config.featureIdProperty + '".');
                                        }
                                    } else {
                                        console.log('Sorry, there was a problem with your ".config" options. Did you you set a valid layer? Does your layer have data and geometry? Do the property names in your data and geometry correspond to the "featureIdProperty" and "valueIdProperty" fields?');
                                    }
                                    return view;
                                }
                            });
                            Object.defineProperty(this, 'classify', {
                                value: function () {
                                    var callback = newCallback(arguments),
                                        layer = fetchScapeObject(view) ? fetchFromScape(view.config.layer, 'name', view.schema.parent.layer):false,
                                        data = layer ? layer.data:false,
                                        classification = 'getClass' + view.config.classification.charAt(0).toUpperCase() + view.config.classification.slice(1),
                                        breaks = view.config.breaks;
                                    if (data) {
                                        view.config.classes = layer.data.geostats[classification](breaks);
                                        callback(that);
                                    }
                                    return view;
                                }
                            });
                            Object.defineProperty(this, 'style', {
                                value: function () {
                                    var callback = newCallback(arguments),
                                        myFillScale,
                                        valueProperty,
                                        exportType,
                                        exportOptions;
                                    that.dataLayer.setStyle(function (feature) {
                                        myFillScale = chroma.scale(view.config.colourScale).domain(view.config.classes).out('hex');
                                        valueProperty = feature.getProperty(view.config.valueIdProperty);
                                        exportType = feature.getProperty('hover') ? 'hover' : (feature.getProperty('selected') ? "click" : "default");
                                        exportOptions = {
                                            fillOpacity: view.config.gmap.styles[exportType].fillOpacity,
                                            fillColor: myFillScale(valueProperty) || view.config.gmap.styles[exportType].fillColor,
                                            strokeOpacity: view.config.gmap.styles[exportType].strokeOpacity,
                                            strokeColor: chroma(myFillScale(valueProperty)).darken() || view.config.gmap.styles[exportType].strokeColor,
                                            strokeWeight: view.config.gmap.styles[exportType].strokeWeight,
                                            zIndex: view.config.gmap.styles[exportType].zIndex,
                                            visible: view.config.gmap.styles[exportType].visible,
                                            clickable: view.config.gmap.styles[exportType].clickable
                                        };
                                        return /** @type {google.maps.Data.StyleOptions} */(exportOptions);
                                    });
                                    callback(that);
                                    return view;
                                }
                            });
                            Object.defineProperty(this, 'on', {
                                value: function () {
                                    var callback = newCallback(arguments);
                                    that.dataLayer.setMap(view.gmap.mapBase);
                                    callback(that);
                                    return view;
                                }
                            });
                            Object.defineProperty(this, 'off', {
                                value: function () {
                                    var callback = newCallback(arguments);
                                    that.dataLayer.setMap(null);
                                    callback(that);
                                    return view;
                                }
                            });
                            Object.defineProperty(this, 'onHover', {
                                value: function (callback) {
                                    callback = newCallback(arguments);
                                    if (listenerHoverSet) {
                                        listenerHoverSet.remove();
                                        listenerHoverReset.remove();
                                    } else {
                                        listenerHoverSet = that.dataLayer.addListener('mouseover', function (event) {
                                            event.feature.setProperty('hover', true);
                                            callback(event.feature);
                                        });
                                        listenerHoverReset = that.dataLayer.addListener('mouseout', function (event) {
                                            event.feature.setProperty('hover', false);
                                            callback(event.feature);
                                        });
                                    }
                                    return view;
                                }
                            });
                            Object.defineProperty(this, 'onClick', {
                                value: function (limit, callback) {
                                    callback = newCallback(arguments);
                                    // Check for existing listener, remove it, reset previously altered features
                                    if (listenerClick) {
                                        listenerClick.remove();
                                        for (var prop in view.config.features.selected) {
                                            if (view.config.features.selected.hasOwnProperty(prop)) {
                                                view.config.features.selected[prop].setProperty('selected', false);
                                                delete view.config.features.selected[prop];
                                            }
                                        }
                                    } else {
                                        view.config.features.selectedLimit = Number.isInteger(limit) ? limit : 0;
                                        view.config.features.selectedCount = 0;
                                        listenerClick = that.dataLayer.addListener('click', function (event) {
                                            idValue = event.feature.getProperty(view.config.featureIdProperty);
                                            if (event.feature.getProperty('selected')) {
                                                event.feature.setProperty('selected', false);
                                                view.config.features.selectedCount = view.config.features.selectedLimit ? Math.max(view.config.features.selectedCount - 1, 0) : view.config.features.selectedCount;
                                                delete view.config.features.selected[idValue];
                                                callback(event.feature, false);
                                            } else {
                                                if (view.config.features.selectedLimit ? (view.config.features.selectedLimit > view.config.features.selectedCount) : true) {
                                                    event.feature.setProperty('selected', true);
                                                    view.config.features.selectedCount = (view.config.features.selectedLimit > view.config.features.selectedCount) ? view.config.features.selectedCount + 1 : view.config.features.selectedCount;
                                                    view.config.features.selected[idValue] = event.feature;
                                                }
                                                callback(event.feature, true);
                                            }
                                        });
                                    }
                                    return view;
                                }
                            });
                            return this;
                        }
                    };
                // check to see that this is a view and that the view.config options point to a valid layer
                view = socioscapes.fn.isValidObject(view) ? view:(this || false);
                layer = (view && view.schema && view.config) ? fetchFromScape(view.config.layer, 'name', view.schema.parent.layer):false;
                if (layer) {
                    view.gmap.mapSymbology = new GmapLayer(view);
                    callback(view);
                }
                return view;
            }
    }]);
socioscapes.fn.extend([
    {
        path: 'viewGmapLabels',
        alias: 'glabel',
        silent: true,
        extension:
            function viewGmapLabels(view) {
                var callback = newCallback(arguments),
                    dom,
                    layerHack;
                view = view || this;
                if (isValidObject(view)) {
                    view.config.gmap.styles = view.config.gmap.styles || {};
                    view.config.gmap.styles.mapLabels = view.config.gmap.styles.mapLabels || [
                            {
                                "elementType": "all",
                                "stylers": [
                                    { "visibility": "off" }
                                ]
                            },{
                                "featureType": "administrative",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "visibility": "on"
                                    },
                                    {
                                        "color": "#ffffff"
                                    }
                                ]
                            },{
                                "featureType": "administrative",
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "visibility": "on"
                                    },
                                    {
                                        "color": "#000000"
                                    },
                                    {
                                        "lightness": 13
                                        //"weight": 5
                                    }
                                ]
                            }
                        ];
                    // Create a custom OverlayView class and declare rules that will ensure it appears above all other map content
                    layerHack = new google.maps.OverlayView();
                    layerHack.onAdd = function () {
                        dom = this.getPanes();
                        dom.mapPane.style.zIndex = 150;
                    };
                    layerHack.onRemove = function () {
                        this.div_.parentNode.removeChild(this.div_);
                        this.div_ = null;
                    };
                    layerHack.draw = function () {
                    };
                    if (view.gmap.mapBase) {
                        layerHack.setMap(view.gmap.mapBase);
                        view.gmap.mapLabels = new google.maps.StyledMapType(view.config.gmap.styles.mapLabels);
                        view.gmap.mapBase.overlayMapTypes.insertAt(0, view.gmap.mapLabels);
                        callback(view);
                    } else {
                        callback(false);
                    }
                }
                return this;
            }
    }]);
socioscapes.fn.extend([
    {
        "path": 'viewGmapMap',
        "alias": 'gmap',
        "silent": true,
        extension:
            function viewGmapMap(view) {
                var callback = newCallback(arguments),
                    myDiv;
                view = view || this;
                if (isValidObject(view)) {
                    view.gmap = view.gmap || {};
                    view.config.address = view.config.address || 'Toronto, Canada';
                    view.config.gmap = view.config.gmap || {};
                    view.config.gmap.div = view.config.gmap.div || 'map-canvas';
                    view.config.gmap.styles = view.config.gmap.styles || {};
                    view.config.gmap.styles.map = view.config.gmap.styles.map || [
                            {
                                "featureType": "all",
                                "elementType": "labels.text",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "landscape",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "visibility": "on"
                                    },
                                    {
                                        "saturation": -100
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "visibility": "on"
                                    },
                                    {
                                        "color": "#dadada"
                                    },
                                    {
                                        "saturation": -100
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "labels.icon",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    },
                                    {
                                        "saturation": -100
                                    }
                                ]
                            },
                            {
                                "featureType": "transit.line",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "color": "#ffffff"
                                    }
                                ]
                            },
                            {
                                "featureType": "transit.line",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#dbdbdb"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "color": "#ffffff"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#dbdbdb"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.arterial",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#d7d7d7"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.local",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "color": "#ffffff"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.local",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#d7d7d7"
                                    },
                                    {
                                        "saturation": -100
                                    }
                                ]
                            },
                            {
                                "featureType": "transit.station",
                                "elementType": "labels.icon",
                                "stylers": [
                                    {
                                        "hue": "#5e5791"
                                    }
                                ]
                            },
                            {
                                "featureType": "water",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "hue": "#0032ff"
                                    },
                                    {
                                        "gamma": "0.45"
                                    }
                                ]
                            }
                        ];
                    myDiv = document.getElementById(view.config.gmap.div);
                    if (myDiv) {
                        fetchGoogleGeocode(view.config.address, function(geocodeResult) {
                            if (geocodeResult) {
                                view.config.gmap.geocode = geocodeResult;
                                view.config.gmap.options = view.config.gmap.options || {
                                        "zoom": 13,
                                        "mapTypeId": google.maps.MapTypeId.ROADMAP,
                                        "mapTypeControl": true,
                                        "center": geocodeResult,
                                        "MapTypeControlOptions": {
                                            "mapTypeIds": [
                                                google.maps.MapTypeId.ROADMAP,
                                                google.maps.MapTypeId.SATELLITE
                                            ],
                                            "style": google.maps.MapTypeControlStyle.DROPDOWN_MENU
                                        },
                                        "scaleControl": true,
                                        "disableDoubleClickZoom": true,
                                        "streetViewControl": true,
                                        "overviewMapControl": true
                                    };
                                view.config.gmap.options.styles = view.config.gmap.styles.map;
                                view.gmap.mapBase = new google.maps.Map(myDiv, view.config.gmap.options);
                                view.gmap.mapBase.setTilt(45);
                                callback(view);
                            } else {
                                callback(false);
                            }
                        });
                    } else {
                        console.log('Sorry, unable to located the view\'s config.gmap.div element.');
                    }
                }
                return this;
            }
    }]);
socioscapes.fn.extend([
    {   path: 'viewGmapView',
        alias: 'gview',
        silent: true,
        extension:
            function viewGmap(view) {
                var callback = newCallback(arguments),
                    gmap = socioscapes.fn.viewGmapMap,
                    glabel = socioscapes.fn.viewGmapLabels,
                    gsymbology = socioscapes.fn.viewGmapSymbology;
                view = view || this;
                if (isValidObject(view)) {
                    if (!view.gmap.mapBase) {
                        gmap(view, function(mapResult) {
                            if (mapResult) {
                                glabel(view, function(labelResult) {
                                    if (labelResult) {
                                        gsymbology(view, function(symbologyResult) {
                                            if (symbologyResult) {
                                                view.gmap.mapSymbology.init(function(initResult) {
                                                    if (initResult) {
                                                        view.gmap.mapSymbology.on();
                                                        callback(view);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        if (!view.gmap.mapLabels) {
                            glabel(view, function(labelResult) {
                                if (labelResult) {
                                    gsymbology(view, function(symbologyResult) {
                                        if (symbologyResult) {
                                            view.gmap.mapSymbology.init(function(initResult) {
                                                if (initResult) {
                                                    view.gmap.mapSymbology.on();
                                                    callback(view);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            gsymbology(view, function(symbologyResult) {
                                if (symbologyResult) {
                                    view.gmap.mapSymbology.init(function(initResult) {
                                        if (initResult) {
                                            view.gmap.mapSymbology.on();
                                            callback(view);
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
                return this;
            }
    }]);