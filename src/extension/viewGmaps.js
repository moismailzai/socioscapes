/*jslint node: true */
/*global module, require, google, event, feature, gapi*/
'use strict';

export default function viewGmaps(socioscapes) {
    if (socioscapes && socioscapes.fn && socioscapes.fn.extender) {
        socioscapes.fn.extender(socioscapes, [
            {
                path: 'viewGmapSymbology',
                alias: 'gsymbology',
                silent: true,
                extension:
                    function viewGmapSymbology(view) {
                        let chroma = viewGmapSymbology.prototype.chroma,
                            isValidObject = viewGmapSymbology.prototype.isValidObject,
                            fetchFromScape = viewGmapSymbology.prototype.fetchFromScape,
                            newCallback = viewGmapSymbology.prototype.newCallback,
                            newEvent = viewGmapSymbology.prototype.newEvent;
                        //
                        let callback = newCallback(arguments),
                            layer,
                            GmapLayer = function(view) {
                                let idValue,
                                    listenerClick,
                                    listenerHoverSet,
                                    listenerHoverReset,
                                    that = this;
                                if (view && view.config && view.config.gmap) {
                                    view.config.gmap.styles = view.config.gmap.styles ||
                                        {};
                                    view.config.gmap.styles.default = view.config.gmap.styles.default ||
                                        {
                                            fillOpacity: 0.75,
                                            fillColor: 'purple',
                                            strokeOpacity: 0.75,
                                            strokeColor: 'black',
                                            strokeWeight: 1,
                                            zIndex: 5,
                                            visible: true,
                                            clickable: true,
                                        };
                                    view.config.gmap.styles.hover = view.config.gmap.styles.hover ||
                                        {
                                            fillOpacity: 0.75,
                                            fillColor: 'purple',
                                            strokeOpacity: 1,
                                            strokeColor: 'black',
                                            strokeWeight: 2,
                                            zIndex: 10,
                                            visible: true,
                                            clickable: true,
                                        };
                                    view.config.gmap.styles.click = view.config.gmap.styles.click ||
                                        {
                                            fillOpacity: 1,
                                            fillColor: 'purple',
                                            strokeOpacity: 1,
                                            strokeColor: 'black',
                                            strokeWeight: 3,
                                            zIndex: 15,
                                            visible: true,
                                            clickable: true,
                                        };
                                    view.config.features = {
                                        'selected': {},
                                        'selectedCount': 0,
                                        'selectedLimit': 0,
                                    };
                                    this.dataLayer = new google.maps.Data();
                                    Object.defineProperty(this, 'init', {
                                        value: function() {
                                            let callback = newCallback(
                                                arguments),
                                                layer = fetchFromScape(
                                                    view.config.layer, 'name',
                                                    view.meta.schema.parent.layer) ||
                                                    false,
                                                data = layer ?
                                                    layer.data :
                                                    false,
                                                geom = layer ?
                                                    layer.geom :
                                                    false,
                                                featureIdProperty = (typeof view.config.featureIdProperty ===
                                                    'string') ?
                                                    view.config.featureIdProperty.toLowerCase() :
                                                    'dauid',
                                                valueIdProperty = (typeof view.config.valueIdProperty ===
                                                    'string') ?
                                                    view.config.valueIdProperty.toLowerCase() :
                                                    'total';
                                            if (data && geom &&
                                                featureIdProperty &&
                                                valueIdProperty) {
                                                // remove the layer's existing features
                                                that.dataLayer.forEach(
                                                    function(feature) {
                                                        that.dataLayer.remove(
                                                            feature);
                                                    });
                                                // load features from the layer's geom store
                                                that.dataLayer.addGeoJson(
                                                    geom.geoJson,
                                                    {featureIdProperty: featureIdProperty});
                                                if (data.geoJson.features[0].properties[valueIdProperty] !==
                                                    undefined) {
                                                    // join those features with the layer's data store
                                                    that.dataLayer.forEach(
                                                        function(feature) {
                                                            // [this feature's value]  =  [the   matching   data   object's]    [value field]  (if it exists)
                                                            if (data.byId[feature.getProperty(
                                                                featureIdProperty)][valueIdProperty]) {
                                                                feature.setProperty(
                                                                    valueIdProperty,
                                                                    data.byId[feature.getProperty(
                                                                        featureIdProperty)][valueIdProperty]);
                                                            }
                                                        });
                                                    that.classify(function() {
                                                        that.style(function() {
                                                            that.onHover();
                                                            that.onClick(5);
                                                            newEvent(
                                                                'socioscapes.updateSymbology',
                                                                view);
                                                            callback(that);
                                                        });
                                                    });
                                                } else {
                                                    console.log(
                                                        'Sorry, that layer does not contain matching data for the geometry.');
                                                }
                                            } else {
                                                console.log(
                                                    'Sorry, there was a problem with your ".config" options. Did you you set a valid layer? Does your layer have data and geometry? Do the property names in your data and geometry correspond to the "featureIdProperty" and "valueIdProperty" fields?');
                                            }
                                            return that;
                                        },
                                    });
                                    Object.defineProperty(this, 'classify', {
                                        value: function() {
                                            let callback = newCallback(
                                                arguments),
                                                layer = isValidObject(view) ?
                                                    fetchFromScape(
                                                        view.config.layer,
                                                        'name',
                                                        view.meta.schema.parent.layer) :
                                                    false,
                                                data = layer ?
                                                    layer.data :
                                                    false,
                                                classification = 'getClass' +
                                                    view.config.classification.charAt(
                                                        0).toUpperCase() +
                                                    view.config.classification.slice(
                                                        1),
                                                breaks = parseInt(
                                                    view.config.breaks);
                                            if (data) {
                                                that.off();
                                                try {
                                                    view.config.classes = layer.data.geostats[classification](
                                                        breaks);
                                                } catch {
                                                }
                                                that.on();
                                                callback(that);
                                            }
                                            return that;
                                        },
                                    });
                                    Object.defineProperty(this, 'style', {
                                        value: function() {
                                            let callback = newCallback(
                                                arguments),
                                                myFillScale,
                                                valueProperty,
                                                exportType,
                                                exportOptions;
                                            that.dataLayer.setStyle(
                                                function(feature) {
                                                    myFillScale = chroma.scale(
                                                        view.config.colourScale).
                                                        mode('lab').
                                                        classes(
                                                            view.config.classes).
                                                        out('hex');
                                                    valueProperty = feature.getProperty(
                                                        view.config.valueIdProperty);
                                                    exportType = feature.getProperty(
                                                        'hover') ?
                                                        'hover' :
                                                        (feature.getProperty(
                                                            'selected') ?
                                                            'click' :
                                                            'default');
                                                    exportOptions = {
                                                        fillOpacity: view.config.gmap.styles[exportType].fillOpacity,
                                                        fillColor: myFillScale(
                                                            valueProperty) ||
                                                            view.config.gmap.styles[exportType].fillColor,
                                                        strokeOpacity: view.config.gmap.styles[exportType].strokeOpacity,
                                                        strokeColor: chroma(
                                                            myFillScale(
                                                                valueProperty)).
                                                                darken(1) ||
                                                            view.config.gmap.styles[exportType].strokeColor,
                                                        strokeWeight: view.config.gmap.styles[exportType].strokeWeight,
                                                        zIndex: view.config.gmap.styles[exportType].zIndex,
                                                        visible: view.config.gmap.styles[exportType].visible,
                                                        clickable: view.config.gmap.styles[exportType].clickable,
                                                    };
                                                    return /** @type {google.maps.Data.StyleOptions} */(exportOptions);
                                                });
                                            callback(that);
                                            return that;
                                        },
                                    });
                                    Object.defineProperty(this, 'on', {
                                        value: function() {
                                            let callback = newCallback(
                                                arguments);
                                            that.dataLayer.setMap(
                                                view.gmap.mapBase);
                                            callback(that);
                                            return that;
                                        },
                                    });
                                    Object.defineProperty(this, 'off', {
                                        value: function() {
                                            let callback = newCallback(
                                                arguments);
                                            that.dataLayer.setMap(null);
                                            callback(that);
                                            return that;
                                        },
                                    });
                                    Object.defineProperty(this, 'onHover', {
                                        value: function(callback) {
                                            callback = newCallback(arguments);
                                            if (listenerHoverSet) {
                                                listenerHoverSet.remove();
                                                listenerHoverReset.remove();
                                            }
                                            listenerHoverSet = that.dataLayer.addListener(
                                                'mouseover', function(event) {
                                                    if (!event.feature.getProperty(
                                                        'selected')) {
                                                        event.feature.setProperty(
                                                            'hover', true);
                                                    }
                                                    newEvent(
                                                        'socioscapes.updateFeatureHover',
                                                        {
                                                            id: event.feature.getProperty(
                                                                view.config.featureIdProperty),
                                                            value: event.feature.getProperty(
                                                                view.config.valueIdProperty),
                                                        });
                                                    callback(event.feature);
                                                });
                                            listenerHoverReset = that.dataLayer.addListener(
                                                'mouseout', function(event) {
                                                    event.feature.setProperty(
                                                        'hover', false);
                                                    newEvent(
                                                        'socioscapes.updateFeatureHover',
                                                        {id: '', value: ''});
                                                    callback(event.feature);
                                                });
                                            return that;
                                        },
                                    });
                                    Object.defineProperty(this, 'onClick', {
                                        value: function(limit, callback) {
                                            callback = newCallback(arguments);
                                            // Check for existing listener, remove it, reset previously altered features
                                            if (listenerClick) {
                                                listenerClick.remove();
                                                for (let prop in view.config.features.selected) {
                                                    if (view.config.features.selected.hasOwnProperty(
                                                        prop)) {
                                                        view.config.features.selected[prop].setProperty(
                                                            'selected', false);
                                                        delete view.config.features.selected[prop];
                                                    }
                                                }
                                            }
                                            view.config.features.selectedLimit = Number.isInteger(
                                                limit) ? limit : 0;
                                            view.config.features.selectedCount = 0;
                                            listenerClick = that.dataLayer.addListener(
                                                'click', function(event) {
                                                    idValue = event.feature.getProperty(
                                                        view.config.featureIdProperty);
                                                    if (event.feature.getProperty(
                                                        'selected')) {
                                                        event.feature.setProperty(
                                                            'selected', false);
                                                        view.config.features.selectedCount = view.config.features.selectedLimit ?
                                                            Math.max(
                                                                view.config.features.selectedCount -
                                                                1, 0) :
                                                            view.config.features.selectedCount;
                                                        delete view.config.features.selected[idValue];
                                                        callback(event.feature,
                                                            false);
                                                    } else {
                                                        if (view.config.features.selectedLimit ?
                                                            (view.config.features.selectedLimit >
                                                                view.config.features.selectedCount) :
                                                            true) {
                                                            event.feature.setProperty(
                                                                'selected',
                                                                true);
                                                            view.config.features.selectedCount = (view.config.features.selectedLimit >
                                                                view.config.features.selectedCount) ?
                                                                view.config.features.selectedCount +
                                                                1 :
                                                                view.config.features.selectedCount;
                                                            view.config.features.selected[idValue] = event.feature;
                                                        }
                                                        callback(event.feature,
                                                            true);
                                                    }
                                                });
                                            return that;
                                        },
                                    });
                                    return this;
                                }
                            };
                        // check to see that this is a view and that the view.config options point to a valid layer
                        view = socioscapes.fn.isValidObject(view) ?
                            view :
                            (this || false);
                        layer = (view && view.meta.schema && view.config) ?
                            fetchFromScape(view.config.layer, 'name',
                                view.meta.schema.parent.layer) :
                            false;
                        if (layer) {
                            view.gmap.mapSymbology = new GmapLayer(view);
                            callback(view);
                        } else {
                            callback(false);
                        }
                        return view;
                    },
            }]);
        socioscapes.fn.extender(socioscapes, [
            {
                path: 'viewGmapLabels',
                alias: 'glabel',
                silent: true,
                extension:
                    function viewGmapLabels(view) {
                        let isValidObject = viewGmapLabels.prototype.isValidObject,
                            newCallback = viewGmapLabels.prototype.newCallback;
                        //
                        let callback = newCallback(arguments),
                            dom,
                            layerHack;
                        if (isValidObject(view)) {
                            view.config.gmap.styles = view.config.gmap.styles ||
                                {};
                            view.config.gmap.styles.mapLabels = view.config.gmap.styles.mapLabels ||
                                [
                                    {
                                        'elementType': 'all',
                                        'stylers': [
                                            {'visibility': 'off'},
                                        ],
                                    }, {
                                    'featureType': 'administrative',
                                    'elementType': 'labels.text.fill',
                                    'stylers': [
                                        {
                                            'visibility': 'on',
                                        },
                                        {
                                            'color': '#ffffff',
                                        },
                                    ],
                                }, {
                                    'featureType': 'administrative',
                                    'elementType': 'labels.text.stroke',
                                    'stylers': [
                                        {
                                            'visibility': 'on',
                                        },
                                        {
                                            'color': '#000000',
                                        },
                                        {
                                            'lightness': 13,
                                            //"weight": 5
                                        },
                                    ],
                                },
                                ];
                            // Create a custom OverlayView class and declare rules that will ensure it appears above all other map content
                            layerHack = new google.maps.OverlayView();
                            layerHack.onAdd = function() {
                                dom = this.getPanes();
                                dom.mapPane.style.zIndex = 150;
                            };
                            layerHack.onRemove = function() {
                                this.div_.parentNode.removeChild(this.div_);
                                this.div_ = null;
                            };
                            layerHack.draw = function() {
                            };
                            if (view.gmap.mapBase) {
                                layerHack.setMap(view.gmap.mapBase);
                                view.gmap.mapLabels = new google.maps.StyledMapType(
                                    view.config.gmap.styles.mapLabels);
                                view.gmap.mapBase.overlayMapTypes.insertAt(0,
                                    view.gmap.mapLabels);
                                view.gmap.mapLabels.layerHack = layerHack;
                                callback(view);
                            } else {
                                callback(false);
                            }
                        } else {
                            callback(false);
                        }
                        return view;
                    },
            }]);
        socioscapes.fn.extender(socioscapes, [
            {
                'path': 'viewGmapMap',
                'alias': 'gmap',
                'silent': true,
                extension:
                    function viewGmapMap(view) {
                        let isValidObject = viewGmapMap.prototype.isValidObject,
                            fetchGoogleGeocode = viewGmapMap.prototype.fetchGoogleGeocode,
                            newCallback = viewGmapMap.prototype.newCallback;
                        let callback = newCallback(arguments),
                            myDiv;
                        if (isValidObject(view)) {
                            view.gmap = view.gmap || {};
                            view.config.address = view.config.address ||
                                'Toronto, Canada';
                            view.config.gmap = view.config.gmap || {};
                            view.config.gmap.div = view.config.gmap.div ||
                                'map-canvas';
                            view.config.gmap.styles = view.config.gmap.styles ||
                                {};
                            view.config.gmap.styles.map = view.config.gmap.styles.map ||
                                [
                                    {
                                        'featureType': 'all',
                                        'elementType': 'labels.text',
                                        'stylers': [
                                            {
                                                'visibility': 'off',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'landscape',
                                        'elementType': 'geometry.fill',
                                        'stylers': [
                                            {
                                                'visibility': 'on',
                                            },
                                            {
                                                'saturation': -100,
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'poi',
                                        'elementType': 'geometry.fill',
                                        'stylers': [
                                            {
                                                'visibility': 'on',
                                            },
                                            {
                                                'color': '#dadada',
                                            },
                                            {
                                                'saturation': -100,
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'poi',
                                        'elementType': 'labels.icon',
                                        'stylers': [
                                            {
                                                'visibility': 'off',
                                            },
                                            {
                                                'saturation': -100,
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'transit.line',
                                        'elementType': 'geometry.fill',
                                        'stylers': [
                                            {
                                                'color': '#ffffff',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'transit.line',
                                        'elementType': 'geometry.stroke',
                                        'stylers': [
                                            {
                                                'color': '#dbdbdb',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'road.highway',
                                        'elementType': 'geometry.fill',
                                        'stylers': [
                                            {
                                                'color': '#ffffff',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'road.highway',
                                        'elementType': 'geometry.stroke',
                                        'stylers': [
                                            {
                                                'color': '#dbdbdb',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'road.arterial',
                                        'elementType': 'geometry.stroke',
                                        'stylers': [
                                            {
                                                'color': '#d7d7d7',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'road.local',
                                        'elementType': 'geometry.fill',
                                        'stylers': [
                                            {
                                                'color': '#ffffff',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'road.local',
                                        'elementType': 'geometry.stroke',
                                        'stylers': [
                                            {
                                                'color': '#d7d7d7',
                                            },
                                            {
                                                'saturation': -100,
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'transit.station',
                                        'elementType': 'labels.icon',
                                        'stylers': [
                                            {
                                                'hue': '#5e5791',
                                            },
                                        ],
                                    },
                                    {
                                        'featureType': 'water',
                                        'elementType': 'geometry.fill',
                                        'stylers': [
                                            {
                                                'hue': '#0032ff',
                                            },
                                            {
                                                'gamma': '0.45',
                                            },
                                        ],
                                    },
                                ];
                            myDiv = document.getElementById(
                                view.config.gmap.div);
                            if (myDiv) {
                                fetchGoogleGeocode(view.config.address,
                                    function(geocodeResult) {
                                        if (geocodeResult) {
                                            view.config.gmap.geocode = geocodeResult;
                                            view.config.gmap.options = view.config.gmap.options ||
                                                {
                                                    'zoom': 13,
                                                    'center': geocodeResult,
                                                    'mapTypeId': google.maps.MapTypeId.ROADMAP,
                                                    'mapTypeControl': true,
                                                    'mapTypeControlOptions': {
                                                        'mapTypeIds': [
                                                            google.maps.MapTypeId.ROADMAP,
                                                            google.maps.MapTypeId.SATELLITE,
                                                            google.maps.MapTypeId.TERRAIN,
                                                            google.maps.MapTypeId.HYBRID,
                                                        ],
                                                        'style': google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                                                        'position': google.maps.ControlPosition.TOP_RIGHT,
                                                    },
                                                    disableDefaultUI: true,
                                                    addressControlOptions: {
                                                        position: google.maps.ControlPosition.BOTTOM_CENTER,
                                                    },
                                                    'overviewMapControl': true,
                                                    'overviewMapControlOptions': {
                                                        'position': google.maps.ControlPosition.BOTTOM_LEFT,
                                                    },
                                                    'zoomControl': true,
                                                    'zoomControlOptions': {
                                                        'position': google.maps.ControlPosition.LEFT_CENTER,
                                                        'style': google.maps.ZoomControlStyle.LARGE,
                                                    },
                                                    'streetViewControl': true,
                                                    'streetViewControlOptions': {
                                                        'position': google.maps.ControlPosition.LEFT_CENTER,
                                                    },
                                                    'panControl': false,
                                                    'panControlOptions': {
                                                        'position': google.maps.ControlPosition.RIGHT_CENTER,
                                                    },
                                                    'scaleControl': true,
                                                    'scaleControlOptions': {
                                                        'position': google.maps.ControlPosition.BOTTOM_CENTER,
                                                    },
                                                };
                                            view.config.gmap.options.styles = view.config.gmap.styles.map;
                                            view.gmap.mapBase = new google.maps.Map(
                                                myDiv,
                                                view.config.gmap.options);
                                            google.maps.event.addListenerOnce(
                                                view.gmap.mapBase, 'idle',
                                                function() { // one time listener to make sure we don't trigger callback before map is ready
                                                    view.gmap.mapBase.setTilt(
                                                        45);
                                                    callback(view);
                                                });
                                        } else {
                                            callback(false);
                                        }
                                    });
                            } else {
                                console.log(
                                    'Sorry, unable to located the view\'s config.gmap.div element.');
                                callback(false);
                            }
                        }
                        return view;
                    },
            }]);
        socioscapes.fn.extender(socioscapes, [
            {
                path: 'viewGmapView',
                alias: 'gview',
                silent: true,
                extension:
                    function viewGmap(context, config) {
                        let isValidObject = viewGmap.prototype.isValidObject,
                            newCallback = viewGmap.prototype.newCallback;
                        //
                        let callback = newCallback(arguments),
                            gmap = viewGmap.prototype.viewGmapMap,
                            glabel = viewGmap.prototype.viewGmapLabels,
                            gsymbology = viewGmap.prototype.viewGmapSymbology,
                            view = context;
                        if (isValidObject(view)) {
                            if (!view.gmap) {
                                gmap(view, function(mapResult) {
                                    if (mapResult) {
                                        glabel(view, function(labelResult) {
                                            if (labelResult) {
                                                gsymbology(view,
                                                    function(symbologyResult) {
                                                        if (symbologyResult) {
                                                            view.gmap.mapSymbology.init(
                                                                function(initResult) {
                                                                    if (initResult) {
                                                                        view.gmap.mapSymbology.on();
                                                                        callback(
                                                                            view);
                                                                    } else {
                                                                        callback(
                                                                            false);
                                                                    }
                                                                });
                                                        } else {
                                                            callback(false);
                                                        }
                                                    });
                                            } else {
                                                callback(false);
                                            }
                                        });
                                    } else {
                                        callback(false);
                                    }
                                });
                            } else {
                                if (!view.gmap.mapLabels) {
                                    glabel(view, function(labelResult) {
                                        if (labelResult) {
                                            gsymbology(view,
                                                function(symbologyResult) {
                                                    if (symbologyResult) {
                                                        view.gmap.mapSymbology.init(
                                                            function(initResult) {
                                                                if (initResult) {
                                                                    view.gmap.mapSymbology.on();
                                                                    callback(
                                                                        view);
                                                                } else {
                                                                    callback(
                                                                        false);
                                                                }
                                                            });
                                                    } else {
                                                        callback(false);
                                                    }
                                                });
                                        } else {
                                            callback(false);
                                        }
                                    });
                                } else {
                                    gsymbology(view, function(symbologyResult) {
                                        if (symbologyResult) {
                                            view.gmap.mapSymbology.init(
                                                function(initResult) {
                                                    if (initResult) {
                                                        view.gmap.mapSymbology.on();
                                                        callback(view);
                                                    } else {
                                                        callback(false);
                                                    }
                                                });
                                        } else {
                                            callback(false);
                                        }
                                    });
                                }
                            }
                        } else {
                            callback(false);
                        }
                        return view;
                    },
            }]);
    }
}
